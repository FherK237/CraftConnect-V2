import './CategoriasCarrusel.css'

const categorias = [
    { id: 1, name: "Plomería", icon: "🚰" },
    { id: 2, name: "Electricidad", icon: "⚡" },
    { id: 3, name: "Carpintería", icon: "🪚" },
    { id: 4, name: "Limpieza", icon: "🧹" },
    { id: 5, name: "Pintura", icon: "🎨" },
    { id: 6, name: "Jardinería", icon: "🌿" },
    { id: 7, name: "Albañilería", icon: "🧱" },
    { id: 8, name: "Mecánica", icon: "🔧" },
    
]

function CategoriasCarrusel() {
    return (
        <section className="categories-container">
            <h2 className="categories-title">¿Qúe necesitas arreglar hoy?</h2>

            <div className="categories-scroll">
                {categorias.map((cat) => (
                    <div key={cat.id} className="category-card">
                        <div className="category-icon">{cat.icon}</div>
                        <span className="category-name">{cat.name}</span>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default CategoriasCarrusel