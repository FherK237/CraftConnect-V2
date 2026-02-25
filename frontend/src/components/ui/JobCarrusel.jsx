import { useEffect, useState } from 'react'
import './CategoriasCarrusel.css'
import CategoryCard from './CategoryCard'
import api from '../../services/api'

function JobCarrusel() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const {data} = await api.get('/jobs/')
                console.log("Data cruda del backend:", data)

                const listaCat = data.jobs || data.results || [];

                setCategories(listaCat.slice(0, 10))

            } catch (error) {
                console.error("Error al cargar carrusel:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchCategory()
    }, [])

    if (loading) return <div> Cargando oficios...</div>
    if (categories.length === 0) return null

    return (
        <section className="categories-container">
            <h2 className="categories-title">Nuestro Servicios</h2>

            <div className="categories-scroll">
                {categories.map((cat) => (
                    <div key={cat.id} style={{ minWidth: '250px' }}>
                        <CategoryCard category={cat} />
                    </div>
                ))}
            </div>
        </section>
        
    )
}

export default JobCarrusel