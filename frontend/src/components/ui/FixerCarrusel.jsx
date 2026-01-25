import { useNavigate } from "react-router-dom";
import "./FixerCarrusel.css"

const fixers = [
    { id: 101, name: "Juan Pérez", job: "Plomero", rating: 4.8, reviews: 120 },
    { id: 102, name: "Ana López", job: "Electricista", rating: 5.0, reviews: 45 },
    { id: 103, name: "Carlos Ruiz", job: "Carpintero", rating: 4.5, reviews: 30 },
    { id: 104, name: "Maria Diaz", job: "Limpieza", rating: 4.9, reviews: 200 },
    { id: 105, name: "Pedro Gomez", job: "Jardinero", rating: 4.7, reviews: 80 },
    { id: 106, name: "Juan Pérez", job: "Plomero", rating: 4.8, reviews: 120 },
    { id: 107, name: "Ana López", job: "Electricista", rating: 5.0, reviews: 45 },
    { id: 108, name: "Carlos Ruiz", job: "Carpintero", rating: 4.5, reviews: 30 },
    { id: 109, name: "Maria Diaz", job: "Limpieza", rating: 4.9, reviews: 200 },
    { id: 110, name: "Pedro Gomez", job: "Jardinero", rating: 4.7, reviews: 80 },
]

function FixerCarrusel() {
    const navigate = useNavigate()

    return(
        <section className="fixer-section">
            <h2 className="categories-title">Fixers Destacados</h2>
            
            <div className="fixer-scroll">
                {fixers.map((fixer) => (
                    <div key={fixer.id} className="fixer-card">
                        <img 
                        src={`https://i.pravatar.cc/150?u=${fixer.id}`} 
                        alt={fixer.name} 
                        className="fixer-photo"
                    />
                    <h3 className="fixer-name">{fixer.name}</h3>
                    <span className="fixer-job">{fixer.job}</span>

                    <div className="fixer-rating">
                        ★ {fixer.rating} <span style={{color: '#999', fontWeight: 'normal'}}>({fixer.reviews})</span>
                    </div>

                    <button
                        className="btn-profile"
                        onClick={() => navigate(`/fixer/${fixer.id}`)}
                    >
                        Ver Perfil
                    </button>
                    </div>
                    

                ))}
            </div>
        </section>
    )
    
}

export default FixerCarrusel