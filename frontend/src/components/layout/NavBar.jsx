import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import './NavBar.css'
import { useTheme } from "../../context/ThemeContext"

const NavBar = () => {
    const {theme, toggleTheme } = useTheme()
    const { user, isAuthenticated, logout} = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="navbar" style={{ backgroundColor: 'var(--navbar-bg)' }}>
            <Link to="/home" className="navbar-brand">
                <img src="CC-logo-v2.png" alt="" className="logo-craft"/>
            </Link>
            <div className="navbar-links">
            <button 
                onClick={toggleTheme} 
                style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    fontSize: '1.2rem',
                    padding: '5px'
                }}
                title="Cambiar tema"
                >
                {theme === 'light' ? '🌙' : '☀️'}
            </button>
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
                        {/* <Link to={user.role === 'user' ? '/user' : '/fixer'} className="nav-link">Perfil</Link> verificar funcionamientp */}
                        <Link to='/fixer' className="nav-link">Perfil</Link>
                        <label> | </label>
                        <span style={{ color: 'var(--navbar-text)' }}>
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