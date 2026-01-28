import { useEffect, useState } from 'react'
import InputGroup from '../../components/ui/InputGroup'
import { getFixerProfile, updateFixerProfile } from '../../services/fixer.service'
import './FixerProfileEditor.css'
import { Link } from 'react-router-dom'
import Footer from '../../components/layout/Footer'

function FixerProfileEditor() {
  const [loading, setLoading] = useState(true)
  const [ jobsList, setJobsList] = useState([])

  const [formData, setFormData ] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    birthdate:'',
    company_name: '',
    description: '',
    experience_years: '',
    job_id:'',
    picture: ''
  })

  const [selectedFile, setSelectedFile ] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getFixerProfile()

        setJobsList(data.jobs)

        setFormData({
          firstname: data.professional.firstname || 'asdsad',
          lastname: data.professional.lastname || '',
          phone: data.professional.phone || '',
          description: data.professional.description || '',
          experience_years: data.professional.experience_years || '',
          job_id: data.professional.job_id || ''
        })

        setLoading(false)

      } catch (error) {
        console.log('Error al cargar perfil', error)
      }
    }
    loadData()
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e) => {
    setSelectedFile(
      e.target.files[0]
    )
  }

  const handleSubmit = async () => {
    e.preventDefault()

    try{
      const dataToSend = new FormData()

      Object.keys(formData).forEach(key => {
        dataToSend.append(key, formData[key])
      })

      if (selectedFile) {
        dataToSend.append('image_user', selectedFile)
      }

      await updateFixerProfile(dataToSend)
      alert('perfil actualizado correctamente')

    } catch(error) {
      alert("Error al actualizar", error)
    }
    if (loading) return <p>Cargando datos...</p>;
  }

  return (
    <>
      <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>Editar Perfil Profesional</h2>
        <form onSubmit={handleSubmit}>
          <InputGroup label='Nombre' name='firstname' value={formData.firstname} onChange={handleChange}/>
          <InputGroup label='Apellido'name='lastname' value={formData.lastname} onChange={handleChange}/>
          <InputGroup label='Numero Telefonico' name='phone' value={formData.phone} onChange={handleChange}/>

          <div style={{ marginBottom: '15px' }}>
            <label style={{display: 'block', fontWeight: 'bold'}}>Oficio Principal</label>
            <select 
              name="job_id"
              value={formData.job_id}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px' }}
            >
              <option value="">Selecciona tu especialidad</option>
              {jobsList.map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{display: 'block', fontWeight: 'bold'}} >Foto de perfil</label>
            <input type="file" onChange={handleFileChange}/>
          </div>

          <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none' }}>
            Guardar Cambios
          </button>
        </form>
      </div>
      {/* <Footer/> */}
    </>
    
  )
}

export default FixerProfileEditor
