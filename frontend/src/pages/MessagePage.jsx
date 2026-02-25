import { useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useEffect, useRef, useState } from "react"
import io from 'socket.io-client'
import api from "../services/api"

import './MessagePage.css'


const socket = io('http://localhost:3001')

function MessagePage() {
  const { user } = useAuth()
  const location = useLocation()

  const [contactos, setContactos] = useState([])
  const [chatActivo, setChatActivo] = useState(() => {
    if (location.state?.fixerId) {
      return {
        id: location.state.fixerId,
        name: location.state.fixerName,
        type: 'professional'
      };
    }
    return null;
  });
  const [mensajes, setMensajes] = useState([])
  const [nuevoMensaje, setNuevoMensaje] = useState('')

  const mensajesFinRef = useRef(null)

  //INICIALIZAR SOCKET Y CARGAR CONTACTOS
  // 1. CARGAR CONTACTOS (Se ejecuta UNA SOLA VEZ al iniciar)
  useEffect(() => {
    cargarContactos();
  }, [user?.id])

  const cargarContactos = async () => {
    try {
        const token = localStorage.getItem('token'); // 🔑 1. Sacamos el token de la memoria
        console.log(token)
        // 🛡️ 2. Se lo enviamos al backend como un "Header"
        const { data } = await api.get('/contracts/chats-list', {
            headers: {
                Authorization: `Bearer ${token}` 
            }
        }); 
        
        setContactos(data.conversations || []);
    } catch (error) {
        console.error("Error cargando contactos:", error);
    }
};

  // 2. INICIALIZAR SOCKET (Se ejecuta al entrar a la página)
  useEffect(() => {
    if (!user) return

    socket.emit('join_room', user.id)

    const manejarNuevoMensaje = (msg) => {
        // 1. Preguntamos: ¿El mensaje es de la persona con la que hablo AHORA, o es mío?
        const esDeEsteChat = 
            msg.sender_id === chatActivo?.id || 
            msg.receiver_id === chatActivo?.id || 
            msg.sender_id === user.id

        // 2. Si SÍ pertenece a esta plática, lo pintamos en la pantalla
        if (esDeEsteChat) {
            setMensajes((prev) => [...prev, msg]) 
        }
        cargarContactos()
    }
    
    // ¡SOLO REGISTRAMOS EL EVENTO UNA VEZ!
    socket.on('receive_message', manejarNuevoMensaje);

    return () => {
        socket.off('receive_message', manejarNuevoMensaje);
    };
}, [user?.id, chatActivo?.id]);


  // 3. CARGAR HISTORIAL (Se ejecuta SOLO cuando haces clic en un contacto)
  useEffect(() => {
      if (!chatActivo) return;

      const cargarHistorial = async () => {
        if (!chatActivo) return;
  
        try {
            const token = localStorage.getItem('token'); // 🔑 1. Sacamos el token
            
            // 🛡️ 2. Se lo pegamos a la petición del historial
            const { data } = await api.get(`/contracts/chat/${chatActivo.id}`, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
            
            setMensajes(data.chatHistory || []);
        } catch (error) {
            console.error("Error cargando historial:", error);
        }
    };
      // const cargarHistorial = async () => {
      //     try {
      //         // Ajusta esta ruta si en tu backend la pusiste en /contracts/...
      //         const { data } = await api.get(`/contracts/chat/${chatActivo.id}`);
      //         setMensajes(data.chatHistory || []);
      //     } catch (error) {
      //         console.error("Error cargando historial:", error);
      //     }
      // };
      cargarHistorial();
  }, [chatActivo?.id]);

  useEffect(() => {
    mensajesFinRef.current?.scrollIntoView({ behavior: 'smooth'})
  }, [mensajes])

  //ENVIAR MENSAJE

  const handleEnviarMensaje = (e) => {
    e.preventDefault()
    if (!nuevoMensaje.trim() || !chatActivo) return

    const dbSenderType = user.role === 'fixer' ? 'professional' : 'user'
    const dbReceiverType = chatActivo.type

    const dataMensaje = {
      senderId: user.id,
      receiverId: chatActivo.id,
      senderType: dbSenderType,
      receiverType: dbReceiverType,
      message: nuevoMensaje
    }

    socket.emit('send_message', dataMensaje)
    console.log("Se envio el mensaje: ", nuevoMensaje)
    setNuevoMensaje('')
  }

  return (
    <div className="messages-page-wrapper">
      <main className="chat-container">
        {/* --- COLUMNA IZQUIERDA: LISTA DE CONTACTOS --- */}
        <aside className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h2>Mensajes</h2>
          </div>
          <div className="contact-list">
            {contactos.length === 0 ? (
              <p className="no-contacts">Aún no tienes mensajes.</p>
            ) : (
              contactos.map((contacto) => (
                <div 
                  key={contacto.id} 
                  className={`contact-item ${chatActivo?.id === contacto.id ? 'active' : ''}`}
                  onClick={() => setChatActivo(contacto)}
                >
                  <div className="contact-avatar">
                    {contacto.picture ? (
                      <img src={`http://localhost:3001/${contacto.picture}`} alt={contacto.name} />
                    ) : (
                      <span className="material-icons-outlined">person</span>
                    )}
                  </div>
                  <div className="contact-info">
                    <h4>{contacto.name}</h4>
                    {/* Podrías poner la fecha o el último mensaje aquí */}
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

            {/* --- COLUMNA DERECHA: CHAT ACTIVO --- */}
            <section className="chat-window">
          {chatActivo ? (
            <>
              {/* Cabecera del Chat */}
              <header className="chat-header">
                <div className="chat-header-info">
                  <h3>{chatActivo.name}</h3>
                  <span className="chat-status">En línea</span>
                </div>
              </header>

              {/* Área de Mensajes */}
              <div className="chat-messages-area">
                {mensajes.map((msg, index) => {
                  const soyYo = msg.sender_id === user.id;
                    return (
                      <div key={index} className={`message-wrapper ${soyYo ? 'mine' : 'theirs'}`}>
                        <div className="message-bubble">
                          <p>{msg.message}</p>
                          <span className="message-time">
                            {new Date(msg.created_at || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </div>
                    );
                })}
                {/* Div invisible para anclar el scroll automático */}
                <div ref={mensajesFinRef} />
              </div>

              {/* Input de Mensaje */}
              <footer className="chat-input-area">
                <form onSubmit={handleEnviarMensaje} className="chat-form">
                  <input 
                    type="text" 
                    placeholder="Escribe un mensaje..." 
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                    className="chat-input"
                  />
                  <button type="submit" className="btn-send-message">
                    <span className="material-icons-outlined">send</span>
                  </button>
                </form>
              </footer>
            </>
          ) : (
            <div className="chat-empty-state">
              <span className="material-icons-outlined empty-icon">forum</span>
                <h3>Tus mensajes</h3>
                <p>Selecciona un chat de la lista para comenzar a hablar.</p>
            </div>
          )}
        </section>
      </main>
    </div>
);
}

export default MessagePage