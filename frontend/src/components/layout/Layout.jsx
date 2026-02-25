import { Outlet } from "react-router-dom"
import NavBar from "./NavBar"
import Footer from "./Footer"

const Layout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <NavBar />
            <main style={{ flex: 1}}>
                <Outlet/>
            </main>             
            <Footer />
        </div>
    )
}

export default Layout