import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFoundPage.css';

function NotFoundPage() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Página no encontrada</h2>
        <p>
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        {/* Enlace para volver al inicio, estilizado como botón */}
        <Link to="/" className="home-link-button">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;