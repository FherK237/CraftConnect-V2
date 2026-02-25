import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { loginUser } from '../services/auth.service'
import InputGroup from '../components/ui/InputGroup'
import InputPass from "../components/ui/InputPass"
import Footer from "../components/layout/Footer"
import logoCraft from '../assets/CC-logo-v2.png'
import './LoginPage.css'

function LoginPage() {
    const [ formDataL, setFormDataL ] = useState({
        email: '',
        password: ''
    })

    const [ showPass, setShowPass ] = useState(false)
    const togglePassVisibility = () => {
        setShowPass(!showPass)
    }

    const { login } = useAuth()
    const navigate = useNavigate()
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormDataL({
            ...formDataL,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const responseBack = await loginUser(formDataL)

            console.log("login exitoso:", responseBack)

            if (responseBack.token && responseBack.user) {
                login(responseBack.user, responseBack.token)
                if (responseBack.user.role === 'fixer') {
                    navigate('/fixer-dashboard')
                } else {
                    navigate('/home')
                }
            } else {
                alert("El servidor no devolvio datos del usuario")
            }
        } catch (error) {
            const mensajeError = error.response?.data?.message && "Asegurate de haber verificado tu cuenta desde el correo electronico registrado."
            alert(mensajeError)
        }
    }

    return (
        <div className="login-page-wrapper">
            <div className="login-card" >
                <div className="login-header" style={{ marginBottom: '20px' }}>
                    <Link to="/home">
                        <img src={logoCraft} alt="" className="login-logo"/>
                    </Link>
                    <h2 className="login-title">Inicar Sesión</h2>
                    <p className="login-subtitle">¡Qué bueno verte de nuevo!</p>
                </div>


                <form onSubmit={handleSubmit} className="login-form">
                    <InputGroup 
                        label="Correo Electrónico"
                        type="email"
                        name="email"
                        value={formDataL.email}
                        onChange={handleChange}
                        placeholder="ejemplo@correo.com"
                    />

                    <InputPass 
                        label="Contraseña"
                        type={showPass ? "text" : "password"}
                        name="password"
                        value={formDataL.password}
                        onChange={handleChange}
                        placeholder="Contraseña"
                        
                        type2="button"
                        onClick={togglePassVisibility}
                        button={showPass ? 'visibility_off' : 'visibility'}
                    />

                    <button
                    type="submit"
                    className="btn-submit-login"
                    >
                        Entrar
                    </button>
                </form>
                <p className="login-footer-text">
                    ¿Aún no tienes cuenta? {""}
                    <Link to='/register' className="login-link">
                        Registrarse
                    </Link>
                </p>
            </div>
        </div>
        
    )
}

export default LoginPage