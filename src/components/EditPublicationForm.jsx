import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
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

function EditPublicationForm() {
  const { id } = useParams(); // producto id desde la URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    contact: '',
    material: '',
  });

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/product/${id}`, {
          withCredentials: true,
        });

        const p = res.data;
        setProduct(p);
        setFormData({
          name: p.name,
          description: p.description,
          price: p.price,
          contact: p.contact,
          material: p.categories?.[0]?.name || '',
        });
      } catch (err) {
        console.error('Error al cargar el producto:', err);
        toast.error('No se pudo cargar el producto');
        navigate('/my-posts');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedProduct = {
        ...product,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        contact: formData.contact,
        categoriesNames: [formData.material],
      };

      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/product/updatePrduct`, // <-- corregir a "updateProduct" si aplica
        updatedProduct,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      );

      toast.success('Producto actualizado exitosamente');
      navigate('/my-posts');
    } catch (err) {
      console.error('Error al actualizar:', err);
      toast.error('Error al actualizar el producto');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !product) {
    return <div className="text-center mt-5">Cargando producto...</div>;
  }

  return (
    <div className="new-publication-container">
      <form className="new-publication-form" onSubmit={handleUpdate}>
        <h2>Editar Publicación</h2>

        <div className="form-group">
          <label htmlFor="name">Título</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Precio</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact">Contacto</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="material">Material</label>
          <select
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
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
}

export default EditPublicationForm;
