
import { useAuth } from '../../context/AuthContext'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Sidebar.css'

function Sidebar ({isOpen, toggleSidebar}) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path ? 'active' : ''

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Si no hay usuario, no mostrar el sidebar
  if (!user) return null

  const imgUrl = user.picture ? `http://localhost:3001/${user.picture}` : null
  console.log("Datos del usuario en Sidebar:", user);
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={toggleSidebar}></div>

      <aside className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">

          <div className="sidebar-avatar">
            {imgUrl ? (
              <img src={imgUrl}
              alt={`Perfil de ${user.firstname}`} 
              className="sidebar-profile-img"
              onError={(e) => { e.target.style.display = 'none'; }}
              />
            ):(
              <span className="material-icons-outlined">person</span>
            )}
          </div>

          <div className="sidebar-user-info">
            <h3>{user.firstname} {user.lastname}</h3>
            <p>{user.role === 'fixer' ? 'Fixer' : 'Cliente'}</p>
          </div>

          <button className="btn-close-sidebar" onClick={toggleSidebar}>
            <span className="material-icons-outlined">close</span>
          </button>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-section-title">PRINCIPAL</p>
          <ul>
            <li>
              <Link to='/home' className={`nav-item ${isActive('/home')}`}>
                <span className="material-icons-outlined">home</span>
                Inicio
              </Link>
            </li>

            <li>
              <Link to="/search" className={`nav-item ${isActive('/search')}`}>
                <span className="material-icons-outlined">search</span>
                Buscar Fixers
              </Link>
            </li>

            <li>
              <Link to="/messages" className={`nav-item ${isActive('/messages')}`}>
                <span className="material-icons-outlined">chat</span>
                Mensajes
                {/* Ejemplo de un globito de notificación (opcional) */}
                <span className="badge">2</span> 
              </Link>
            </li>
          </ul>

          {user.role === 'fixer' && (
            <>
            <p className="nav-section-title" >MI NEGOCIO</p>
              <ul>
                <li>
                  <Link to="/fixer-dashboard" className={`nav-item ${isActive('/fixer-dashboard')}`}>
                    <span className="material-icons-outlined">dashboard</span>
                    Panel de Control
                  </Link>
                </li>
                <li>
                  <Link to="/requests" className={`nav-item ${isActive('/requests')}`}>
                    <span className="material-icons-outlined">work</span>
                    Solicitudes
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className={`nav-item ${isActive('/profile')}`}>
                    <span className="material-icons-outlined">manage_accounts</span>
                    Información personal
                  </Link>
                </li>
                <li>
                  <Link to="/wallet" className={`nav-item ${isActive('/wallet')}`}>
                    <span className="material-icons-outlined">account_balance_wallet</span>
                    Billetera y Pagos
                  </Link>
                </li>
                <li>
                  <Link to="/verification" className={`nav-item ${isActive('/verification')}`}>
                    <span className="material-icons-outlined">verified_user</span>
                    Verificación
                  </Link>
                </li>
              </ul>
            </>
          )} 

          {user.role === 'user' && (
            <>
              <p className="nav-section-title">MI ACTIVIDAD</p>
              <ul>
                <li>
                  <Link to="/my-services" className={`nav-item ${isActive('/my-services')}`}>
                    <span className="material-icons-outlined">handyman</span>
                    Servicios Contratados
                  </Link>
                </li>
                <li>
                  <Link to="/favorites" className={`nav-item ${isActive('/favorites')}`}>
                    <span className="material-icons-outlined">favorite_border</span>
                    Fixers Favoritos
                  </Link>
                </li>
                <li>
                  <Link to="/payment-history" className={`nav-item ${isActive('/payment-history')}`}>
                    <span className="material-icons-outlined">receipt_long</span>
                    Historial de Pagos
                  </Link>
                </li>
              </ul>
            </>
          )}

          {/* AJUSTES COMUNES */}
          <p className="nav-section-title">CUENTA</p>
          <ul>
            <li>
              <Link to="/settings" className={`nav-item ${isActive('/settings')}`}>
                <span className="material-icons-outlined">settings</span>
                Configuración
              </Link>
            </li>
          </ul>
        </nav>

        {/* BOTÓN DE SALIR AL FONDO */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn-sidebar-logout">
            <span className="material-icons-outlined">logout</span>
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
