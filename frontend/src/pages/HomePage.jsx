import JobCarrusel from '../components/ui/JobCarrusel'
import FixerCarrusel from "../components/ui/FixerCarrusel"
import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom"
import bannerImage from '../assets/banner.png'
import './HomePage.css'


function HomePage() {
    const { user, isAuthenticated } = useAuth()

    return (
        <div className="home-wrapper">
            
            {/* --- 1. HERO SECTION --- */}
            <section className="hero-section" style={{
                backgroundImage: `var(--gradient-color, linear-gradient(rgba(0, 0, 0, 0.6), rgba(0,0,0,0.6))), url(${bannerImage})`,
            }}>
                <div className="hero-content">
                    <h1 className="logo-text-hero">CraftConnect</h1>
                    <p className="hero-slogan">Conectando manos expertas con soluciones reales.</p>
                    <p className="hero-description">
                        Encuentra a los mejores profesionales para reparar, mejorar o construir tu hogar. Trato directo, sin intermediarios y con total confianza.
                    </p>
                    <div className="hero-actions">
                        {!isAuthenticated ? (
                            <>
                                <Link to="/register" className="btn-primary">Empieza Ahora</Link>
                                <Link to="/login" className="btn-secondary">Iniciar Sesión</Link>
                            </>
                        ) : (
                            <Link to="/directory" className="btn-primary">Explorar Servicios</Link>
                        )}
                    </div>
                </div>
            </section>

            {/* --- 2. ¿QUÉ ES CRAFTCONNECT? --- */}
            <section className="about-section">
                <div className="section-header">
                    <h2>¿Por qué elegir CraftConnect?</h2>
                    <p>Olvídate del estrés de buscar quién repare tu hogar. Nosotros lo hacemos fácil y seguro.</p>
                </div>
                <div className="features-grid">
                    <div className="feature-card">
                        <span className="material-icons-outlined feature-icon">verified_user</span>
                        <h3>Profesionales Verificados</h3>
                        <p>Nuestros fixers pasan por revisiones para garantizar calidad, seguridad y tranquilidad en tu hogar.</p>
                    </div>
                    <div className="feature-card">
                        <span className="material-icons-outlined feature-icon">forum</span>
                        <h3>Contacto Directo</h3>
                        <p>Chatea en tiempo real, acuerda el precio y cierra el trato directamente a través de nuestra plataforma.</p>
                    </div>
                    <div className="feature-card">
                        <span className="material-icons-outlined feature-icon">star_rate</span>
                        <h3>Reseñas Reales</h3>
                        <p>Toma decisiones informadas leyendo las experiencias y calificaciones de otros clientes como tú.</p>
                    </div>
                </div>
            </section>

            {/* --- 3. CÓMO FUNCIONA --- */}
            <section className="how-it-works-section">
                <h2>Tu solución en 3 simples pasos</h2>
                <div className="steps-container">
                    <div className="step-item">
                        <div className="step-number">1</div>
                        <h4>Busca</h4>
                        <p>Encuentra la categoría del servicio que necesitas.</p>
                    </div>
                    <div className="step-item">
                        <div className="step-number">2</div>
                        <h4>Contacta</h4>
                        <p>Habla con el Fixer y acuerden los detalles.</p>
                    </div>
                    <div className="step-item">
                        <div className="step-number">3</div>
                        <h4>Soluciona</h4>
                        <p>Recibe el servicio y califica tu experiencia.</p>
                    </div>
                </div>
            </section>

            {/* --- 4. LOS CARRUSELES (Tus componentes estrella) --- */}
            <section className="explore-section">
                <div className="carousel-wrapper">
                    <h2 className="carousel-title">Servicios más solicitados</h2>
                    <JobCarrusel />
                </div>
                
                <div className="carousel-wrapper">
                    <h2 className="carousel-title">Fixers Destacados</h2>
                    <FixerCarrusel />
                </div>
            </section>

            {/* --- 5. CTA FINAL PARA FIXERS --- */}
            {(!isAuthenticated || user?.role === 'user') && (
                <section className="join-fixer-section">
                    <h2>¿Eres un profesional independiente?</h2>
                    <p>Únete a nuestra red de Fixers, consigue más clientes y aumenta tus ingresos hoy mismo.</p>
                    <Link to="/register-fixer" className="btn-primary btn-large">Convertirme en Fixer</Link>
                </section>
            )}

        </div>
    )
}

export default HomePage





// import CategoriasCarrusel from "../components/ui/CategoriasCarrusel"
// import FixerCarrusel from "../components/ui/FixerCarrusel"
// import { useAuth } from "../context/AuthContext"
// import { Link } from "react-router-dom"
// import './HomePage.css'
// import bannerImage from '../assets/banner.png'
// import JobCarrusel from '../components/ui/JobCarrusel'


// function HomePage() {

// const { user, isAuthenticated } = useAuth()

//     return (
//         <>
//             <section style={{ textAlign: 'center', padding: '15vh 5vh',
//                 backgroundImage:`var(--gradient-color), url(${bannerImage})`,
//                 backgroundSize:'cover',
//                 backgroundPosition:'center',
//                 backgroundRepeat:"no-repeat",
//                 }}>
//                 <h1 className="logo-text">CraftConnect</h1>
//                 <p style={{ fontSize: '1.2rem', color: 'var(--navbar-text)' }}>
//                 Conectando manos expertas con soluciones reales.
//                 </p>
//             </section>
//             <section className="general-categories-container">
//                 <JobCarrusel/>
//             </section>
//             <FixerCarrusel/>
//             <JobCarrusel/>
//             <FixerCarrusel/>
            
//         </>
//     )
// }

// export default HomePage