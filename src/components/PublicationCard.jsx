import React from 'react';
import { Link } from 'react-router-dom';

function PublicationCard({ id, image, title, materialInfo, price }) {
  return (
    <Link to={`/publications/${id}`} className="text-decoration-none">
      <div className="card publication-card h-100">
        <img src={image} className="card-img-top publication-card-img" alt={title} />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title publication-card-title">{title}</h5>
          <p className="card-text tipo_material_pubs">{materialInfo}</p>
          <p className="card-text precio_card_pubs mt-auto">{price}</p>
        </div>
      </div>
    </Link>
  );
}

export default PublicationCard;