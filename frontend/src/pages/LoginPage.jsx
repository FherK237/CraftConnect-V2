import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { loginUser } from '../services/auth.service'
import InputGroup from '../components/ui/InputGroup'
import InputPass from "../components/ui/InputPass"
import './LoginPage.css'
import Footer from "../components/layout/Footer"

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
        <>
            <div className="navbar">
                <Link to="/home" className="navbar-brand">
                    <img src="CC-logo-v2.png" alt="" className="logo-craftt"/>
                </Link>
            </div>

            <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                
                <h2 style={{ textAlign: 'center' }}>Inicar Sesión</h2>

                <form onSubmit={handleSubmit}>
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
                        button={showPass ? 'Ocultar' : 'Mostrar'}
                    />

                    <button
                    type="submit"
                    style={{ marginTop: '10px', padding: '10px', width: '100%' }}
                    >
                        Entrar
                    </button>
                </form>
                <p>
                    ¿Aún no tienes cuenta? {""}
                    <Link to='/register'>
                        Registrarse
                    </Link>
                </p>
            </div>
            <Footer/>
        
        </>
        
    )
}

export default LoginPage