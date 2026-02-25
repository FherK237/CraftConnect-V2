import React, { useState } from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import './DashboardLayout.css'

function DashboardLayout() {
  const [ isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
      <header className="mobile-dashboard-header">
        <button className="btn-menu-mobile" onClick={toggleSidebar}>
          <span className="material-icons-outlined">menu</span>
        </button>
        <h2 className="mobile-dashboard-title">Panel de Control</h2>
      </header>
      <main className="dashboard-main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout
