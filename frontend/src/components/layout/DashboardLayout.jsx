import React from 'react'
import NavBar from '../layout/NavBar'
import { Link, Outlet } from 'react-router-dom'

function DashboardLayout() {
  return (
    <>
      <div style={{ display:'flex', minHeight:'calc(100vh - 60px)' }}>
        <aside style={{ width:'250px', background:'var(--terceary-color)', padding:' 20px', borderRight: '1px solid var(--border-color)' }}>
          <h3>Panel Fixer</h3>
          <ul style={{ listStyle: 'none', padding: 0, marginTop:'20px'}}>
            <li style={{ marginBottom: '15px'}}>
              <Link to='/fixer/profile' style={{ textDecoration: 'none', color:'#333'}}>
                Editar Perfil
              </Link>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <Link to='#' style={{ textDecoration: 'none', color: '#555' }}>
                Mis trabajos
              </Link>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <Link to='#' style={{ textDecoration: 'none', color: '#555' }}>
                Mas apartados
              </Link>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <Link to='#' style={{ textDecoration: 'none', color: '#555' }}>
                Mas apartados
              </Link>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <Link to='#' style={{ textDecoration: 'none', color: '#555' }}>
                Mas apartados
              </Link>
            </li>
          </ul>
        </aside>

        <main style={{ 
            flex: 1, 
            padding: '40px',          // <--- 1. MUCHO PADDING INTERNO
            background: 'var(--bg-color)',    // <--- 2. COLOR DE FONDO GRIS CLARO (Diferente al sidebar blanco)
            overflowY: 'auto'         // <--- 3. Si el form es largo, hace scroll
        }}>
          {/*carga de apartados*/}
          <Outlet/>
        </main>
      </div>
    </>
  )
}

export default DashboardLayout
