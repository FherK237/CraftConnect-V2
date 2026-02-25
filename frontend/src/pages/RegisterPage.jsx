import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "../services/auth.service"
import InputGroup from "../components/ui/InputGroup"
import Footer from "../components/layout/Footer"
import logoCraft from '../assets/CC-logo-v2.png'
import NavBar from '../components/layout/NavBar'
import InputPass from "../components/ui/InputPass"
import './RegisterPage.css'
import './LoginPage.css'

function RegisterPage() {
    const [role, setRole] = useState(null)

    const [showPass, setShowPass] = useState(null)
    const togglePassVisibility = () => {
        setShowPass(!showPass)
    }

    const [formDataR, setformDataR ] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        role: setRole
    })

    const navigate = useNavigate()

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

    if (!role) {
        return (
            <div className="login-page-wrapper">
                <NavBar/>

                <div className="role-selection-card">
                    <h2 className="login-title" style={{ textAlign: 'center', marginBottom: '30px' }}>
                        ¿Cómo quieres usar CraftConnect?
                    </h2>
                    
                    <div className="role-buttons-container">
                        {/* OPCIÓN CLIENTE */}
                        <button className="role-btn" onClick={() => setRole('user')}>
                            <span className="material-icons-outlined role-icon client-icon">person_search</span>
                            <h3>Soy Cliente</h3>
                            <p>Busco profesionales para mi hogar</p>
                        </button>

                        {/* OPCIÓN FIXER */}
                        <button className="role-btn" onClick={() => setRole('fixer')}>
                            <span className="material-icons-outlined role-icon fixer-icon">handyman</span>
                            <h3>Soy Fixer</h3>
                            <p>Quiero ofrecer mis servicios</p>
                        </button>
                    </div>
                    <p className="login-footer-text" style={{ marginTop: '40px' }}>
                            ¿Ya tienes una cuenta? {" "}
                            <Link to='/login' className="login-link">
                                Inicia Sesión
                            </Link>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="login-page-wrapper">
            <div className="login-card" style={{ marginTop: '40px' }}>
                <button type="button" className="btn-back-role" onClick={() => setRole(null)}>
                    <span className="material-icons-outlined">arrow_back</span>
                    Cambiar tipo de cuenta
                </button>
                <div className="login-header" style={{ marginBottom: '20px' }}>
                    <Link to='/home'>
                    <img src={logoCraft} alt="CraftConnect Logo" className="login-logo"/>
                    </Link>

                <h2 className="login-title">Crear una cuenta</h2>
                <p className="login-subtitle">
                    Registrándose como: <strong style={{ color: '#2563eb' }}>{role === 'user' ? 'Cliente' : 'Fixer'}</strong>
                </p>
                </div>
                <form onSubmit={handleSubmit} className="login-form">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
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
                    </div>

                    <InputGroup 
                        label="Correo electrónico"
                        type="email"
                        name="email"
                        value={formDataR.email}
                        onChange={handleChange}
                        placeholder="ejemplo@correo.com"
                    />

                    <InputPass
                        label="Contraseña"
                        type={showPass ? "text" : "password"}
                        name="password"
                        value={formDataR.password}
                        onChange={handleChange}
                        placeholder="Minimo 8 caracteres"
                        type2="button"
                        onClick={togglePassVisibility}
                        button={showPass ? 'visibility_off' : 'visibility'}
                    />

                    <button type="submit" className="btn-submit-login">
                        Registrarse
                    </button>
                </form>
                <p className="login-footer-text">
                    ¿Ya tienes una cuenta? {''}
                    <Link to='/login' className="login-link">
                        Login
                    </Link>
                </p>
            </div>
        </div>
        
    )
}

export default RegisterPage