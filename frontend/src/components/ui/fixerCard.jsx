import React from 'react'
import { Link } from 'react-router-dom'
import './FixerCard.css'

const FixerCard = ({ fixer }) => {
  const imageUrl = fixer.picture
  ? `http://localhost:3001/${fixer.picture}`
  : "https://cdn-icons-png.flaticon.com/512/149/149071.png"

  const ratingDisplay = fixer.average_rating > 0
    ? `⭐ ${parseFloat(fixer.average_rating).toFixed(1)}` 
    : "Nuevo"

  
  return (
    <div className='fixer-card'>
      <div className='fixer-image-container'>
        <img
          src={imageUrl}
          alt={fixer.firstname}
          className='fixer-image'
          onError={(e) => {e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"}}
        />
      </div>

      <div className='fixer-content'>
        <h3 className='fixer-name'>{fixer.firstname} {fixer.lastname}</h3>
        <p className='fixer-job'>
          {fixer.job ? fixer.job.title : 'No asignado'}
        </p>
        <div className='fixer-stats'>
          <span className='fixer-rating'>{ratingDisplay}</span>
          {fixer.distance_km && (
            <span className='fixer-distance'> a {parseFloat(fixer.distance_km).toFixed(1)} km</span>
          )}
        </div>
        <Link to={`/fixers/${fixer.id}`} className='fixer-button'>
          Ver perfil
        </Link>
      </div>
    </div>
  )
}

export default FixerCard
