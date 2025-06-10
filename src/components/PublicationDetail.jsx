import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import '../styles/PublicationDetail.css';

function PublicationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [publication, setPublication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/publications/${id}`);
        setPublication(response.data);
      } catch {
        setError('Error al cargar la publicación');
      } finally {
        setLoading(false);
      }
    };

    fetchPublication();
  }, [id]);

  if (loading) return <div className="loading">Cargando publicación...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!publication) return <div className="not-found">Publicación no encontrada</div>;

  return (
    <div className="publication-detail-container">
      <div className="publication-detail">
        <div className="images-section">
          <div className="main-image">
            <img 
              src={publication.images[activeImage]} 
              alt={publication.title} 
            />
          </div>
          <div className="thumbnail-list">
            {publication.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={activeImage === index ? 'active' : ''}
                onClick={() => setActiveImage(index)}
              />
            ))}
          </div>
        </div>

        <div className="info-section">
          <h1>{publication.title}</h1>
          <div className="price-tag">${publication.price}</div>
          
          <div className="material-tag">
            Material: {publication.material}
          </div>

          <div className="description">
            <h3>Descripción</h3>
            <p>{publication.description}</p>
          </div>

          <div className="location">
            <h3>Ubicación</h3>
            <p>{publication.location}</p>
          </div>

          <div className="seller-info">
            <h3>Vendedor</h3>
            <p>{publication.seller.name}</p>
            {user?.id !== publication.seller.id && (
              <button className="contact-button">
                Contactar al vendedor
              </button>
            )}
          </div>

          {user?.id === publication.seller.id && (
            <div className="owner-actions">
              <Link to={`/edit-publication/${id}`} className="edit-button">
                Editar publicación
              </Link>
              <button className="delete-button">
                Eliminar publicación
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PublicationDetail;