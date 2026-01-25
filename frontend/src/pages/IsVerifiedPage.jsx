import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import './IsVerifiedPage.css'
// import { isVerified } from "../services/auth.service"
import api from "../services/api";

function IsVerifiedPage() {
    const { token } = useParams()
    const [ status, setStatus ] = useState('verificando')
    const navigate = useNavigate()
    
    useEffect(() => {
        if(!token) {
            console.log('No hay token en el url')
            return
        }
//asdasdad
        const verifyAccount = async () => {
            try {
                await api.get(`/auth/verify/${token}`)
                // await isVerified(token)

                setStatus('success')
            } catch (error) {
                console.log("Verificando error:", error)
                setStatus('error')
            }
        }
        if (token) {
            verifyAccount()
        }
    }, [token])

    if (status === 'verificando') {
        return (
            <h1>Verificando cuenta, por favor espera...</h1>
        )
    }

    if (status === 'success') {
        return (
            <div className="verified-container">
                <div className="success-checkmark">
                    <div className="check-icon">
                        <span className="icon-line line-tip"></span>
                        <span className="icon-line line-long"></span>
                        <div className="icon-circle"></div>
                        <div className="icon-fix"></div>
                    </div>
                </div>

                <h2>Cuenta Verificada</h2>
                <p>Ya eres parte de CraftConnect</p>

                <button onClick={() => navigate('/login')} className="btn-go-login">
                    Iniciar Sesión
                </button>
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h2 style={{ color: 'red' }}>Enlace inválido o expirado</h2>
                <p>Por favor solicita un nuevo correo de verificación.</p>
                <button onClick={() => navigate('/home')}>Ir al inicio</button>
            </div>
        )
    }
}

export default IsVerifiedPage