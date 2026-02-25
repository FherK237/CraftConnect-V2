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
        setJobsList(data.jobs || [])

        setFormData({
          firstname: data.professional.firstname || '',
          lastname: data.professional.lastname || '',
          phone: data.professional.phone || '',
          description: data.professional.description || '',
          experience_years: data.professional.experience_years || '',
          job_id: data.professional.job_id || ''
        })

        if (data.professional.picture) {
          setPreviewImage(`http://localhost:3001/${data.professional.picture}`);
        }

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
    const file = e.target.files[0]


    if (file) {
      const MAX_SIZE = 5 * 1024 * 1024

      if (file.size > MAX_SIZE) {
        alert("Esta foto es muy pesada. Por favor elige una menor a 5MB.")
        e.target.value = ""
        return 
      }

      setSelectedFile(file)
      setPreviewImage(URL.createObjectURL(file)) //permite que se visualice la imagen seleccionada antes de darle en guardar//
    }
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
    <div className="editor-container">
      <div className="editor-header">
        <h2 className="editor-title">Editar mi informacion</h2>
        <Link to={`/profile/${"me"}`} className="btn-view-profile">
        <span className="material-icons" style={{ fontSize: '18px' }}>visibility</span>
          Ver Perfil Público
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="editor-form">
        <div className="image-upload-section">
          <div className="image-preview-wrapper">
            {previewImage ? (
              <img src={previewImage} alt="Perfil" className="image-preview"/>
            ) : (
              <div className="image-placeholder">
                <span className="material-icons">person</span>
              </div>
            )}
          </div>
          <label className="file-input-label">
            <span className="material-icons">photo_camera</span>
              Cambiar Foto
            <input type="file" onChange={handleFileChange} className="file-input-hidden" accept="image/*" />
          </label>
        </div>


        <div className="form-row">
          <div className="form-group">
            <InputGroup label='Nombre' name='firstname' value={formData.firstname} onChange={handleChange}/>
          </div>
          <div className="form-group">
            <InputGroup label='Apellido'name='lastname' value={formData.lastname} onChange={handleChange}/>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <InputGroup label='Número Telefónico' name='phone' value={formData.phone} onChange={handleChange}/>
          </div>
          <div className="form-group">
            <label className="custom-label">¿Cuál es tu oficio?</label>
            <div className="select-wrapper">
              <select name="job_id" value={formData.job_id} onChange={handleChange} className="custom-input">
                <option value="">Selecciona una especialidad</option>
                {jobsList.map(job => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
              <span className="material-icons select-icon">expand_more</span>
            </div>
          </div>
        </div>

        <div className="form-group full-width">
          <label className="custom-label">Sobre mí (Biografía)</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange}
            rows="4"
            className="custom-input custom-textarea"
            placeholder="Cuenta a tus clientes tu experiencia, años de trabajo, y por qué deberían contratarte..."
          />
        </div>

        <button type="submit" className="btn-submit-profile">
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
