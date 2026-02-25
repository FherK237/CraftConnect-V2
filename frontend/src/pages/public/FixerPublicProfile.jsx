import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, redirect } from 'react-router-dom';
import api from '../../services/api';
import './FixerPublicProfile.css'; // Usamos el CSS externo y limpio
import { useAuth } from '../../context/AuthContext';

function FixerPublicProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
	const { user} = useAuth
    
  const [fixer, setFixer] = useState(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const { data } = await api.get(`/fixers/${id}`);
        // Usamos tu lógica exacta: data.profile
        setFixer(data.profile);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando perfil", error);
        setLoading(false);
      }
    };
        fetchPublicData();
  }, [id]);

  

  const handleContactClick = () => {
		if (!user) {
			alert('Debes iniciar sesión primero.')
			navigate('/login' , {state: { redirectTo: `/fixers/${fixer.id}`}})
			return
		}
    // Próximamente lo conectaremos al chat
    alert(`Iniciando chat con ${fixer?.firstname}...`)
    navigate('/messages',{
      state: {
        fixerId: fixer.id,
        fixerName: `${fixer.firstname} ${fixer.lastname}`
      }
    })
  }

  if (loading) {
    return (
      <div className="profile-page-wrapper">
        <div className="profile-loading">
          <span className="material-icons-outlined spinner">refresh</span>
          <p>Cargando perfil del profesional...</p>
        </div>
      </div>
    );
  }

  if (!fixer) {
    return (
      <div className="profile-page-wrapper">
        <div className="profile-error">
          <span className="material-icons-outlined">sentiment_dissatisfied</span>
          <h2>Este Fixer no existe.</h2>
          <button onClick={() => navigate('/search')} className="btn-back">
            Volver a la búsqueda
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = fixer.picture 
    ? `http://localhost:3001/${fixer.picture}` 
    : "https://cdn-icons-png.flaticon.com/512/149/149071.png" // Tu fallback original

    return (
        <div className="profile-page-wrapper">
            <main className="profile-container">
                {/* --- ENCABEZADO (HERO) --- */}
                <section className="profile-header-card">
                    <div className="profile-avatar-wrapper">
                        <img 
                            src={imageUrl} 
                            alt={fixer.firstname} 
                            className="profile-avatar"
                            // Rescatamos tu excelente validación de errores
                            onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
                        />
                        
                        {/* Rescatamos tu lógica de verificación real */}
                        {fixer.is_verified && (
                            <div className="verified-badge" title="Identidad Verificada">
                                <span className="material-icons">verified</span>
                            </div>
                        )}
                    </div>

                    <div className="profile-header-info">
                        <h1 className="profile-name">
                            {fixer.firstname} {fixer.lastname}
                        </h1>
                        <h2 className="profile-job">
                            {fixer.job ? fixer.job.title : 'Oficio sin definir'}
                        </h2>
                        
                        <div className="profile-meta">
                            {/* Mostrar años de experiencia de forma dinámica */}
                            <span className="meta-item">
                                <span className="material-icons-outlined">work_history</span>
                                {fixer.experience_years ? `${fixer.experience_years} años exp.` : 'Experiencia comprobada'}
                            </span>
                        </div>

                        <div className="profile-actions">
                            <button onClick={handleContactClick} className="btn-contact-primary">
                                <span className="material-icons-outlined">chat</span>
                                Solicitar Servicio
                            </button>
                        </div>
                    </div>
                </section>

                {/* --- CONTENIDO PRINCIPAL --- */}
                <div className="profile-body-grid">
                    <div className="profile-main-column">
                        <section className="profile-section">
                            <h3 className="section-title">Sobre mí</h3>
                            <p className="profile-bio">
                                {fixer.description || "Este Fixer no ha agregado una descripción aún."}
                            </p>
                        </section>
                    </div>

                    <aside className="profile-sidebar">
                        <div className="trust-card">
                            <h3 className="trust-title">Garantía CraftConnect</h3>
                            <ul className="trust-list">
                                {fixer.is_verified ? (
                                    <li>
                                        <span className="material-icons-outlined text-green">check_circle</span>
                                        Identidad validada
                                    </li>
                                ) : (
                                    <li>
                                        <span className="material-icons-outlined" style={{ color: '#f59e0b' }}>pending_actions</span>
                                        Identidad en proceso de validación
                                    </li>
                                )}
                                <li>
                                    <span className="material-icons-outlined text-green">check_circle</span>
                                    Acuerda el precio por chat
                                </li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </main>
        </div>


    );
}

export default FixerPublicProfile;