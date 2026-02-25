import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../../services/api'
import FixerCard from '../../components/ui/fixerCard'
import './FixerList.css'


function FixerList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [fixers, setFixers ] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading ] = useState(true)
  const [error, setError] = useState(null)

  const urlJobId = searchParams.get('job_id') || ''
  const urlSearchTerm = searchParams.get('search') || ''

  //Estado local para los inputs del formulario (lo que el usuario está escribiendo)
  const [localSearch, setLocalSearch] = useState(urlSearchTerm)
  const [localJobsId, setLocalJobId] = useState(urlJobId)
  //Si el usuario llega desde el Home dándole clic a un oficio, sincronizamos los inputs

  useEffect (() => {
    setLocalSearch(urlSearchTerm)
    setLocalJobId(urlJobId)
  }, [urlSearchTerm, urlJobId])

  //Traer la lista de oficios para rellenar el <select>
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/jobs/')
        const list = data.jobs || data.results || []
        setJobs(list)
      } catch (error) {
        console.error("Error cargando oficios:", error)
      }
    }
    fetchJobs()
  }, [])

  //Traer los Fixers cada vez que la URL cambie
  useEffect(() => {
    const fetchFixers = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = {}
        if (urlJobId) params.job_id = urlJobId
        if (urlSearchTerm) params.search = urlSearchTerm

        const response = await api.get('/fixers/', {params})
        const dataFixers = response.data.results || response.data || []

        setFixers(Array.isArray(dataFixers) ? dataFixers : [])
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setFixers([/*lista vacia */])
        } else {
          setError('Hubo un error al cargar los fixers')
        }
        
      } finally {
        setLoading(false)
      }
    }
    fetchFixers()
  }, [urlJobId, urlSearchTerm])

  //Al presionar "Buscar", actualizamos la URL
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const newParams = new URLSearchParams()

    if (localSearch) newParams.set('search', localSearch)
    if (localJobsId) newParams.set('job_id', localJobsId)

      setSearchParams(newParams)
  }

  const clearFilters = () => {
    setLocalSearch('')
    setLocalJobId('')
    setSearchParams(new URLSearchParams())
  }

  return (
    <div className="search-page-wrapper">
      <section className="search-header-section">
        <div className="search-header-content">
          <h1 className="search-main-title">Encuentra al fixer ideal</h1>
          <p className="search-subtitle">Buscar por nombre o filtrar por oficio.</p>

          <form onSubmit={handleSearchSubmit} className="search-form-bar">
            <div className="search-input-group">
              <span className="material-icons-outlined search-icon">search</span>
              <input 
                type="text"
                placeholder='Juan Perez, reparacion de tuberias...'
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="search-text-input"
              />
            </div>

            <div className="search-select-group">
              <span className="material-icons-outlined search-icon">work_outline</span>
              <select
                value={localJobsId}
                onChange={(e) => setLocalJobId(e.target.value)}
                className="search-select-input"
              >

                <option value='' >Cualquier oficio</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>{job.title}</option>
                  ))}
              </select>
            </div>

            <button type='submit' className="btn-search-submit">
              Buscar
            </button>
          </form>

          {(urlJobId || urlSearchTerm) && (
            <button onClick={clearFilters} className="btn-clear-filters">
              <span className="material-icons-outlined" style={{ fontSize: '16px' }}>close</span>
              Limpiar Filtros
            </button>
          )}
        </div>
      </section>

      <main className="search-results-container">
        <div className="results-header">
          <h2>
            {fixers.length > 0
            ? `Fixers Disponibles (${fixers.length})`
            : `Resultados de busqueda`}
          </h2>
        </div>

        {loading && (
          <div className="loading-state">
            <span className="material-icons-outlined spinner">hourglass_empty</span>
              <p>Buscando a los mejores profesionales...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <span className="material-icons-outlined">error_outline</span>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && fixers.length === 0 && (
          <div className="empty-state">
            <span className="material-icons-outlined empty-icon">plumbing</span>
            <h3>No encontramos profesionales con estos filtros</h3>
            <p>Intenta buscar otro oficio, borrar algunas palabras o limpiar filtros.</p>
            <button onClick={clearFilters} className="btn-empty-clear">Ver todos los Fixers</button>
          </div>
        )}

        {!loading && !error && fixers.length > 0 && (
          <div className="fixers-grid">
            {fixers.map(fixer => (
              <FixerCard key={fixer.id} fixer={fixer}/>
            ))}
          </div>
        )}
      </main>
      
      {/* {loading && <p>Cargando fixers...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && fixers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3>No encontramos profesionales con estos filtros.</h3>
          <p>Intenta buscar otro oficio o ampliar tu zona.</p>
        </div>
      )}

      <div style={gridStyle}>
          {fixers.map(fixer => (
            <FixerCard key={fixer.id} fixer={fixer}/>
          ))}
      </div> */}
    </div>
  )
}

export default FixerList
