import { useNavigate } from "react-router-dom";
import "./FixerCarrusel.css"
import FixerCard from "./fixerCard";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

function FixerCarrusel() {
    const [fixers, setFixers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const fetchTopFixers = async () => {
        try{
          const {data} = await api.get('/fixers/')
          const listaFixers = data.results || data
          setFixers(listaFixers.slice(0, 10))

        } catch (error) {
          console.error("Error cargando carrusel:", error)
        } finally {
          setLoading(false)
        }
      }
      fetchTopFixers()
    }, [])

    if (loading) return <div className="loading-carousel">Cargando destacados...</div>
    if (fixers.length === 0) return null

    return (
        <section className="fixer-section">
            <h2 className="fixers-title">Fixers Destacados</h2>
            
            <div className="fixer-scroll">
              {fixers.map((fixer) => (
                <div key={fixer.id} style={{ minWidth: '250px' }}>
                  <FixerCard fixer={fixer} />
                </div>
              ))}
            </div>
        </section>
    )
    
}

export default FixerCarrusel