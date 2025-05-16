import React from 'react';

function PublicationCard({ image, title, materialInfo, price }) {
  return (
    <div className="card publication-card h-100">
      <img src={image} className="card-img-top publication-card-img" alt={title} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title publication-card-title">{title}</h5>
        <p className="card-text tipo_material_pubs">{materialInfo}</p>
        <p className="card-text precio_card_pubs mt-auto">{price}</p>
      </div>
    </div>
  );
}

export default PublicationCard;