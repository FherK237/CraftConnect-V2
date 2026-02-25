import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found-wrapper">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">¡Ups! Página no encontrada</h2>
        <p className="not-found-text">
          Parece que la ruta que buscas no existe, fue movida o simplemente te perdiste explorando. 
          Pero no te preocupes, puedes volver a territorio seguro.
        </p>
        <Link to="/home" className="not-found-btn">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}

export default NotFound;