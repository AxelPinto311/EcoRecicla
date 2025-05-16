import React, { useState, useEffect } from 'react';
import FilterButtons from '../components/FilterButtons';
import PublicationCard from '../components/PublicationCard';
import '../styles/PublicationsPage.css';
import productImage from '../assets/img/lote_aluminion.png';

// Datos de ejemplo (simulando una API)
const allPublications = [
  { id: 1, title: 'Lata de cerveza', material: 'Aluminio', type: 'Metal', price: '333', image: productImage, category: 'Metal' },
  { id: 2, title: 'Botellas PET', material: 'Plástico PET', type: 'Plástico', price: '250', image: productImage, category: 'Plástico' },
  { id: 3, title: 'Periódicos', material: 'Papel de diario', type: 'Papel', price: '150', image: productImage, category: 'Papel' },
  { id: 4, title: 'Frascos de vidrio', material: 'Vidrio transparente', type: 'Vidrio', price: '400', image: productImage, category: 'Vidrio' },
  { id: 5, title: 'Cajas de cartón', material: 'Cartón corrugado', type: 'Cartón', price: '200', image: productImage, category: 'Cartón' },
  { id: 6, title: 'Teclado viejo', material: 'Componentes electrónicos', type: 'Electrónicos', price: '100', image: productImage, category: 'Electrónicos' },
  { id: 7, title: 'Restos de poda', material: 'Materia orgánica', type: 'Orgánicos', price: '50', image: productImage, category: 'Organicos' },
  { id: 8, title: 'Ropa usada', material: 'Algodón, poliéster', type: 'Textiles', price: '120', image: productImage, category: 'Textiles' },
  { id: 9, title: 'Latas de conserva', material: 'Acero', type: 'Metal', price: '300', image: productImage, category: 'Metal' },
];

function PublicationsPage() {
  const [filteredPublications, setFilteredPublications] = useState(allPublications);
  const [activeFilters, setActiveFilters] = useState([]); // ['Papel', 'Plástico']

  const handleFilterChange = (newActiveFilters) => {
    setActiveFilters(newActiveFilters);
    if (newActiveFilters.length === 0) {
      setFilteredPublications(allPublications);
    } else {
      const filtered = allPublications.filter(pub =>
        newActiveFilters.includes(pub.category)
      );
      setFilteredPublications(filtered);
    }
  };

  return (
    <main className="publications-main-content">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <FilterButtons onFilterChange={handleFilterChange} />
          </div>
        </div>
        <div className="row gy-4">
          {filteredPublications.length > 0 ? (
            filteredPublications.map(pub => (
              <div className="col-lg-3 col-md-4 col-sm-6" key={pub.id}>
                <PublicationCard
                  image={pub.image}
                  title={pub.title}
                  materialInfo={`Tipo de material: ${pub.material}`}
                  price={`Precio $${pub.price}`}
                />
              </div>
            ))
          ) : (
            <div className="col-12">
              <p className="text-center mt-4">No se encontraron publicaciones con los filtros seleccionados.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default PublicationsPage;