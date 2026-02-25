import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import logoCraft from '../../assets/CC-logo-v2.png'
import './NavBar.css'
import { useState } from "react"


const NavBar = () => {
    const {theme, toggleTheme } = useTheme()
    const { user, isAuthenticated, logout} = useAuth()
    const navigate = useNavigate()

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen)
    }

		const closeMenu = () => {
			setIsMobileMenuOpen(false)
		}

    const handleLogout = () => {
      logout()
      navigate('/login')
    }

    return (
      <nav className="navbar">
        {/* LOGO*/}
        <Link to="/home" className="navbar-brand" onClick={closeMenu}>
          <img src={logoCraft} alt="Logo CraftConnect" className="logo-craft" />
        </Link>

        {/* EMENU ESCRITORIO */}
        <div className="nav-menu">
          {isAuthenticated ? (
          <>  
            <Link to='/search' className="nav-link">Buscar</Link>
              {/* <Link to={user?.role === 'user' ? '/user' : '/fixer'} className="nav-link">Ir ahora</Link> */}
            <Link to={user?.role === 'user' ? '/profile' : '/profile'} className="nav-link">Ir ahora</Link>
          </>
          ) : (
            <Link to="/search" className="nav-link">Buscar Profesionales</Link>
          )}
        </div>
            {/* CONTROLES Y SESION*/}
        <div className="nav-controls">
            
          <button onClick={toggleTheme} className="btn-theme-toggle" title="Cambiar tema">
            <span className="material-icons-outlined">
              {theme === 'light' ? 'dark_mode' : 'light_mode'}
            </span>
          </button>

          {/* Área de Usuario */}
          {isAuthenticated ? (
            <div className="user-area">
              <span className="user-greeting">Hola, {user?.firstname}</span>
              <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
            </div>
          ) : (
            <div className="guest-area">
              <Link to="/login" className="nav-link btn-login-text">Iniciar Sesión</Link>
              <Link to="/register" className="btn-register-solid">Registrarse</Link>
            </div>
          )}

					{/* BOTN HAMBURGUESA PARA MOVIL */}
					<button className="btn-hamburger" onClick={toggleMobileMenu}>
						<span className="material-icons-outlined">
							{isMobileMenuOpen ? 'close' : 'menu'}
						</span>
					</button>
        </div>

        <div className={`mobile-dropdown ${isMobileMenuOpen ? 'show' : ''}`}>
          {isAuthenticated ? (
            <>
              <Link to="/search" className="nav-link-mobile" onClick={closeMenu}>
                <span className="material-icons-outlined">search</span> Buscar
              </Link>
              <button onClick={handleLogout} className="nav-link-mobile">Cerrar Sesión</button>
              <Link to={user?.role === 'user' ? '/profile' : '/profile'} className="nav-link-mobile" onClick={closeMenu}>
                <span className="material-icons-outlined">person</span> Perfil
              </Link>
              <button onClick={toggleTheme} className="nav-link-mobile" title="Cambiar tema">
            <span className="material-icons-outlined">
              {theme === 'light' ? 'dark_mode' : 'light_mode'}
            </span>
          </button>
            </>
          ) : (
            <>
              <div>
                <Link to="/login" className="nav-link-mobile">Iniciar Sesión</Link>
                <Link to="/register" className="nav-link-mobile">Registrarse</Link>
                <Link to="/search" className="nav-link-mobile" onClick={closeMenu}>
                    <span className="material-icons-outlined">search</span> Buscar Profesionales
                </Link>

              </div>
            </>
            
            
            
          )}
        </div>
      </nav>
    )
}

export default NavBar