import React, { useState, useEffect } from 'react';
import FilterButtons from '../components/FilterButtons';
import PublicationCard from '../components/PublicationCard';
import { productService } from '../services/productService';
import '../styles/PublicationsPage.css';

function PublicationsPage() {
  const [allPublications, setAllPublications] = useState([]); // todos los productos originales
  const [publications, setPublications] = useState([]); // productos filtrados
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    fetchAllPublications();
  }, []);

  const fetchAllPublications = async () => {
    try {
      setLoading(true);
      const products = await productService.getAllProducts();
      setAllPublications(products);
      setPublications(products);
      setError('');
    } catch (err) {
      console.error('Error al cargar publicaciones:', err);
      setError('Error al cargar las publicaciones');
      setAllPublications([]);
      setPublications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newActiveFilters) => {
    setActiveFilters(newActiveFilters);

    if (newActiveFilters.length === 0) {
      // Si no hay filtros, mostramos todos
      setPublications(allPublications);
      setError('');
      return;
    }

    // Filtrado local
    const filtered = allPublications.filter((pub) => {
      const categoryNames = pub.categories?.map((cat) => cat.name.trim().toUpperCase()) || [];
      return newActiveFilters.some((filter) =>
        categoryNames.includes(filter.trim().toUpperCase())
      );
    });

    if (filtered.length === 0) {
      setError('No se encontraron publicaciones con los filtros seleccionados.');
      setPublications([]);
    } else {
      setError('');
      setPublications(filtered);
    }
  };

  if (loading) {
    return (
      <div className="publications-main-content">
        <div className="container">
          <div className="text-center mt-5">Cargando publicaciones...</div>
        </div>
      </div>
    );
  }

  if (error && publications.length === 0) {
    return (
      <div className="publications-main-content">
        <div className="container">
          <div className="text-center mt-5 text-danger">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <main className="publications-main-content">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <FilterButtons onFilterChange={handleFilterChange} />
          </div>
        </div>
        <div className="row gy-4">
          {publications.length > 0 ? (
            publications.map((pub) => (
              <div className="col-lg-3 col-md-4 col-sm-6" key={pub.id}>
                <PublicationCard
                  id={pub.id}
                  image={pub.images?.[0]?.url || '/placeholder-image.jpg'}
                  title={pub.name}
                  materialInfo={`Material: ${pub.categories?.[0]?.name || 'No especificado'}`}
                  price={`$${pub.price}`}
                />
              </div>
            ))
          ) : (
            <div className="col-12">
              <p className="text-center mt-4">
                No se encontraron publicaciones{activeFilters.length > 0 ? ' con los filtros seleccionados' : ''}.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default PublicationsPage;
