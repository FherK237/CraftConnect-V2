import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import './NavBar.css'

const NavBar = () => {

    const { user, isAuthenticated, logout} = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="navbar">
            <Link to="/home" className="navbar-brand">
                <img src="CC-logo-v2.png" alt="" className="logo-craft"/>
            </Link>

            <div className="navbar-links">
                {isAuthenticated ? (
                    <>
                        
                        <Link to="/home" className="nav-link">Home</Link>
                        <label> | </label>
                        <Link to="/search" className="nav-link">Buscar</Link>
                        <label> | </label>
                        <Link to="/messages" className="nav-link">Mensajes</Link>
                        <label> | </label>
                        <Link to="/notifications" className="nav-link">Notificaciones</Link>
                        <label> | </label>
                        <Link to="/profile" className="nav-link">Perfil</Link>
                        <label> | </label>
                        <span style={{ color: 'black' }}>
                            Hola, {user?.firstname}
                        </span>
                        
                        <button onClick={handleLogout} className="btn-logout">
                            Cerrar Sesión
                        </button>
                    </>
                ): (
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <Link to='/search' className="nav-link">Buscar</Link>
                        <label> | </label>
                        <Link to="/login" className="nav-link" style={{ color: '#008fcc', fontWeight: 'bold' }}>Iniciar Sesión</Link>
                        <label> | </label>
                        <Link to="/register" className="nav-link" style={{ color: '#3565af', fontWeight: 'bold' }}>Registrarse</Link>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default NavBar