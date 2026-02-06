import CategoriasCarrusel from "../components/ui/CategoriasCarrusel"
import FixerCarrusel from "../components/ui/FixerCarrusel"
import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom"
import './HomePage.css'


function HomePage() {

const { user, isAuthenticated } = useAuth()

    return (
        <>
            <section style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--card-bg' }}>
                <h1 className="logo-text">CraftConnect</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--navbar-text)' }}>
                Conectando manos expertas con soluciones reales.
                </p>
            </section>

            <CategoriasCarrusel/>

            <hr style={{ margin: '20px', border: 'none', borderTop: '1px solid #eee' }}/>

            <FixerCarrusel/>
            
            <hr style={{ margin: '20px', border: 'none', borderTop: '1px solid #eee' }}/>

            <CategoriasCarrusel/>

            <hr style={{ margin: '20px', border: 'none', borderTop: '1px solid #eee' }}/>

            <FixerCarrusel/>
            
        </>
    )
}

export default HomePage