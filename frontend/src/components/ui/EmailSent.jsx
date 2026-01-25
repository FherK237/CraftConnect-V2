import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaEnvelope } from 'react-icons/fa';

const EmailSent = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const email = location.state?.email || "tu correo"

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <div style={{ fontSize: '50px', color: '#4CAF50' }}>
        <FaEnvelope />
      </div>
      <h2>¡Casi terminamos!</h2>
      <p>Hemos enviado un enlace de confirmación a: <strong>{email}</strong></p>
      <p>Por favor revisa tu bandeja de entrada (y spam) para activar tu cuenta.</p>
      
      <button onClick={() => navigate('/login')} style={{ marginTop: '20px' }}>
        Volver al Login
      </button>
    </div>
  )
}

export default EmailSent

