import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "../services/auth.service"
import InputGroup from "../components/ui/InputGroup"
import './LoginPage.css'
import Footer from "../components/layout/Footer"
import NavBar from '../components/layout/NavBar'

function RegisterPage() {
    
    const [role, setRole] = useState(null)

    const [formDataR, setformDataR ] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        role: setRole
    })
    const navigate = useNavigate()
    if (!role) {
        return (
            <>
            <NavBar/>
                <div className="role-selection-container" style={{ textAlign: 'center', marginTop: '50px' }}>
                    <h2>¿Cómo quieres usar CrafterConnect?</h2>
                    
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
                        {/* OPCIÓN CLIENTE */}
                        <button 
                            onClick={() => setRole('user')}
                            style={{ padding: '30px', cursor: 'pointer', border: '2px solid #007bff', borderRadius: '10px', background: 'white' }}
                        >
                            <h3>Soy Cliente</h3>
                            <p>Busco profesionales para mi hogar</p>
                        </button>

                        {/* OPCIÓN FIXER */}
                        <button 
                            onClick={() => setRole('fixer')}
                            style={{ padding: '30px', cursor: 'pointer', border: '2px solid #28a745', borderRadius: '10px', background: 'white' }}
                        >
                            <h3>Soy Fixer</h3>
                            <p>Quiero ofrecer mis servicios</p>
                        </button>
                    </div>
                </div>
            </>
        );
    }
    const handleChange = (e) => {
        const { name, value } = e.target
        setformDataR({
            ...formDataR,
            [name]: value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try  {
            const dataToSend = { ...formDataR, role: role };
            const data = await registerUser(dataToSend);
            console.log('registro exitoso:' , data)
            alert("¡Registro exitoso! Por favor revisa tu correo electronico.");
            navigate('/email-sent', { state: { email: formDataR.email} });
        } catch (error) {
            const mensajeError = error.response?.data?.message || "Error al inciar sesión"
            alert(mensajeError)
        }
    }

    return (
        <>
            <div className="navbar">
                <Link to="/home" className="navbar-brand">
                    <img src="CC-logo-v2.png" alt="" className="logo-craftt"/>
                </Link>
            </div>

            <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h2 style={{ textAlign: 'center' }}>Crear una cuenta</h2>

                <button onClick={() => setRole(null)}>← Cambiar tipo de cuenta</button>
                <h3>Registrándose como: {role === 'user' ? 'Cliente' : 'Fixer'}</h3>
                <hr />

                <form onSubmit={handleSubmit}>
                    <InputGroup 
                        label="Nombre"
                        type="text"
                        name="firstname"
                        value={formDataR.firstname}
                        onChange={handleChange}
                        placeholder="KESO KLUMA"
                    />
                    <InputGroup 
                        label="Apellido"
                        type="text"
                        name="lastname"
                        value={formDataR.lastname}
                        onChange={handleChange}
                        placeholder="Pérez"
                    />
                    <InputGroup 
                        label="Correo electrónico"
                        type="email"
                        name="email"
                        value={formDataR.email}
                        onChange={handleChange}
                        placeholder="ejemplo@correo.com"
                    />

                    <InputGroup
                        label="Contraseña"
                        type="password"
                        name="password"
                        value={formDataR.password}
                        onChange={handleChange}
                        placeholder="********"
                    />

                    <button
                    type="submit"
                    style={{ marginTop: '10px', padding: '10px', width: '100%' }}
                    >
                        Registrarse
                    </button>
                </form>
                <p>
                    ¿Ya tienes una cuenta? {''}
                    <Link to='/login'>
                        Login
                    </Link>
                </p>
            </div>

            <Footer/>
        </>
        
    )
}

export default RegisterPage