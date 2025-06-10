import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NewPublicationForm.css';

function NewPublicationForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    material: '',
    images: [],
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState([]);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: files
    }));

    // Crear previsualizaciones
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreview(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Aquí iría la lógica de envío al backend
      navigate('/my-publications');
    } catch {
      setError('Error al crear la publicación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-publication-container">
      <form className="new-publication-form" onSubmit={handleSubmit}>
        <h2>Crear Nueva Publicación</h2>
        
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="title">Título</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Precio</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="material">Material</label>
          <select
            id="material"
            name="material"
            value={formData.material}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccionar material</option>
            <option value="papel">Papel</option>
            <option value="carton">Cartón</option>
            <option value="plastico">Plástico</option>
            <option value="vidrio">Vidrio</option>
            <option value="metal">Metal</option>
            <option value="electronicos">Electrónicos</option>
            <option value="organicos">Orgánicos</option>
            <option value="textiles">Textiles</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="images">Imágenes</label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleImageChange}
            multiple
            accept="image/*"
            required
          />
          <div className="image-preview">
            {preview.map((url, index) => (
              <img key={index} src={url} alt={`Preview ${index + 1}`} />
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="location">Ubicación</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Publicando...' : 'Crear Publicación'}
        </button>
      </form>
    </div>
  );
}

export default NewPublicationForm;