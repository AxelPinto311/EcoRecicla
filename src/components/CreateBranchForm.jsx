import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/CreateBranchForm.css';

function CreateBranchForm() {
  const [formData, setState] = useState({
    name: '',
    address: '',
    description: '',
    image: null,
    materialsAccepted: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setState(prev => ({
      ...prev,
      image: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Aquí iría tu lógica de envío al backend
      setSuccessMessage('¡Sucursal creada exitosamente!');
      setTimeout(() => {
        navigate('/my-branches');
      }, 2000);
    } catch {
      setError('Error al crear la sucursal. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-branch-container">
      <form className="create-branch-form" onSubmit={handleSubmit}>
        <h2>Crear Nueva Sucursal</h2>
        
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        
        <div className="form-group">
          <label htmlFor="name">Nombre de la Sucursal</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Dirección</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
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
          <label htmlFor="image">Imagen de la Sucursal</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Creando...' : 'Crear Sucursal'}
        </button>
      </form>
    </div>
  );
}

export default CreateBranchForm;