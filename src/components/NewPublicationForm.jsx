import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/NewPublicationForm.css';

const CATEGORIES = {
  PAPEL: 'PAPEL',
  CARTON: 'CARTON',
  PLASTICO: 'PLASTICO',
  VIDRIO: 'VIDRIO',
  METAL: 'METAL',
  ELECTRONICO: 'ELECTRONICO',
  ORGANICO: 'ORGANICO',
  TEXTIL: 'TEXTIL',
  OTRO: 'OTRO'
};

function NewPublicationForm() {
  const { user, isAuthenticated, checkAuth, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      if (!isAuthenticated || !user) {
        await checkAuth();
        if (!user) {
          navigate('/login');
        }
      }
    };
    verifyAuth();
  }, [isAuthenticated, user, navigate, checkAuth]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    contact: '',
    material: ''
  });

  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    data.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: data
    });

    const result = await response.json();
    return result.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLoading) return;

      if (!user || !user.id) {
        toast.error("Debes iniciar sesión para crear una publicación");
        return;
      }

      const imageUrls = [];

      for (const file of selectedFiles) {
        const url = await uploadToCloudinary(file);
        if (!url) throw new Error('Fallo al subir una imagen');
        imageUrls.push({ url });
      }

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        user_id: user.id,
        categoriesNames: [formData.material],
        contact: formData.contact.trim(),
        images: imageUrls
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/product/create`,
        productData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (response.data && response.data.id) {
        toast.success("¡Publicación creada exitosamente!");
        setTimeout(() => navigate('/my-posts'), 3000);
        return;
      }

      throw new Error('La respuesta del servidor no contiene el ID del producto');
    } catch (err) {
      console.error('Error completo:', err);
      let errorMessage = 'Error al crear la publicación';

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !user.id) {
    return (
      <div className="new-publication-container">
        <div className="error-message">
          Debes iniciar sesión para crear una publicación
        </div>
      </div>
    );
  }

  return (
    <div className="new-publication-container">
      <form className="new-publication-form" onSubmit={handleSubmit}>
        <h2>Crear Nueva Publicación</h2>

        <div className="form-group">
          <label htmlFor="name">Título</label>
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
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label htmlFor="images">Imágenes</label>
          <input
            type="file"
            id="images"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          <div className="image-preview">
            {imagePreviews.map((src, index) => (
              <img key={index} src={src} alt={`preview-${index}`} />
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="contact">Contacto</label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
            required
            placeholder="Número de teléfono"
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
            {Object.values(CATEGORIES).map(category => (
              <option key={category} value={category}>
                {category.charAt(0) + category.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
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
