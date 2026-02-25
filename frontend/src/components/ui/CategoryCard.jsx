import React from 'react'
import { Link } from 'react-router-dom'
import './CategoryCard.css'

const CategoryCard = ({ category }) => {
  
  return (
    <div className='category-card'>
      <div className='category-container'>
        <h2 className='category-title'>{category.title}</h2>
        <h3 className='category-description'>{category.description}</h3>
        <Link to={`/search?job_id=${category.id}`} className="btn-explore">
          Explorar
        </Link>
      </div>
      
    </div>
    
  )
}

export default CategoryCard
