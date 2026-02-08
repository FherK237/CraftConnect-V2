import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { viwProfileFixer } from '../../services/public.service'
import api from '../../services/api'

function FixerPublicProfile() {
  const { id } = useParams()
  const [ fixer, setFixer] = useState(null)
  const [loading, setLoading] = useState(true)

  
  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const { data } = await api.get(`/fixers/${id}`)
        setFixer(data.profile)
        setLoading(false)
      } catch (error) {
        console.error("Error cargando perfil", error);
        setLoading(false);
      }
    }
    fetchPublicData()
  }, [id])
  

  if (loading) return <div>Cargando perfil...</div>
  if (!fixer) return <div>Este Fixer no existe.</div>

  const imageUrl = fixer.picture 
      ? `http://localhost:3001/${fixer.picture}` 
      : "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            
      {/* CABECERA DEL PERFIL */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '30px' }}>
        <img 
          src={imageUrl} 
          alt={fixer.firstname} 
          style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
          // Evita que la imagen se rompa si la URL está mal
          onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
        />
        <div>
            <h1>{fixer.firstname} {fixer.lastname}</h1>
            {/* Accedemos al Job relacionado */}
            <h3 style={{ color: '#007bff' }}>
              {fixer.job ? fixer.job.title : 'Oficio sin definir'}
            </h3>

            {fixer.is_verified && (
            <span style={{ background: '#d4edda', color: '#155724', padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>
              ✅ Verificado
            </span>
          )}
        </div>
      </div>

      {/* DESCRIPCIÓN */}
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
        <h3>Sobre mí</h3>
        <p>{fixer.description || "Este Fixer no ha agregado una descripción aún."}</p>
                
        <p><strong>Experiencia:</strong> {fixer.experience_years} años</p>
      </div>

      {/* BOTÓN DE ACCIÓN (PRÓXIMAMENTE) */}
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button style={{ padding: '15px 30px', fontSize: '1.2rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            📅 Solicitar Servicio
        </button>
      </div>
    </div>
  )
}

export default FixerPublicProfile
