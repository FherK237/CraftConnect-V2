import { useEffect, useState } from 'react'
import InputGroup from '../../components/ui/InputGroup'
import { getMyProfile, updateMyProfile } from '../../services/fixer.service'
import './FixerProfileEditor.css'
import { Link } from 'react-router-dom'
import api from '../../services/api'

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
  const [previewImage, setPreviewImage] = useState(null); // Para ver la foto nueva antes de subirla

  const [selectedFile, setSelectedFile ] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile()
        setJobsList(data.jobs)

        setFormData({
          firstname: data.professional.firstname || 'asdsad',
          lastname: data.professional.lastname || '',
          phone: data.professional.phone || '',
          description: data.professional.description || '',
          experience_years: data.professional.experience_years || '',
          job_id: data.professional.job_id || ''
        })

        if (data.professional.picture) {
          setPreviewImage(`http://localhost:3001/${data.professional.picture}`);
        }

        setLoading(false);

      } catch (error) {
        console.error("Error cargando perfil", error);
        setLoading(false);
      }
    }
    fetchProfile()
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    try{
      const dataToSend = new FormData()

      dataToSend.append('firstname', formData.firstname)
      dataToSend.append('lastname', formData.lastname)
      dataToSend.append('phone', formData.phone)
      dataToSend.append('description', formData.description)
      dataToSend.append('job_id', formData.job_id)

      if (selectedFile) {
        dataToSend.append('image_user', selectedFile)
      }

      await updateMyProfile(dataToSend)
      alert('perfil actualizado correctamente')

    } catch(error) {
      alert("Error al actualizar", error)
    }


    if (loading) return <p>Cargando datos...</p>;
  }

  return (
    <>
    <div>
      <div>
        <h2>Editar mi informacion</h2>
        <Link to={`/profile/${"me"}`}>
          Ver Perfil Público
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          {previewImage && (
            <img src={previewImage} alt="Perfil"/>
          )}
          <br />
          <input type="file" onChange={handleFileChange} />
        </div>

        <div>
        <InputGroup label='Nombre' name='firstname' value={formData.firstname} onChange={handleChange}/>
        <InputGroup label='Apellido'name='lastname' value={formData.lastname} onChange={handleChange}/>
        </div>

        <InputGroup label='Numero Telefonico' name='phone' value={formData.phone} onChange={handleChange}/>

        <div>
          <label>¿Cuál es tu oficio?</label>
          <select name="job_id" value={formData.job_id} onChange={handleChange}>
            <option value="">Selecciona una especialidad</option>
            {jobsList.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Sobre mí Biografía</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange}
            rows="4"
            placeholder="Cuenta a tus clientes tu experiencia..."
          />
        </div>

        <button type="submit">
          Guardar Cambios
        </button>
      </form>
    </div>
    </>

    // <>
    //   <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
    //   <h2 style={{ textAlign: 'center' }}>Editar Perfil Profesional</h2>
    //     <form onSubmit={handleSubmit}>
    //       <InputGroup label='Nombre' name='firstname' value={formData.firstname} onChange={handleChange}/>
    //       <InputGroup label='Apellido'name='lastname' value={formData.lastname} onChange={handleChange}/>
    //       <InputGroup label='Numero Telefonico' name='phone' value={formData.phone} onChange={handleChange}/>

    //       <div style={{ marginBottom: '15px' }}>
    //         <label style={{display: 'block', fontWeight: 'bold'}}>Oficio Principal</label>
    //         <select 
    //           name="job_id"
    //           value={formData.job_id}
    //           onChange={handleChange}
    //           style={{ width: '100%', padding: '10px' }}
    //         >
    //           <option value="">Selecciona tu especialidad</option>
    //           {jobsList.map(job => (
    //             <option key={job.id} value={job.id}>{job.title}</option>
    //           ))}
    //         </select>
    //       </div>

    //       <div style={{ marginBottom: '20px' }}>
    //         <label style={{display: 'block', fontWeight: 'bold'}} >Foto de perfil</label>
    //         <input type="file" onChange={handleFileChange}/>
    //       </div>

    //       <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none' }}>
    //         Guardar Cambios
    //       </button>
    //     </form>
    //   </div>
    //   {/* <Footer/> */}
    // </>
    
  )
}

export default FixerProfileEditor
