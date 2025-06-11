import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import '../styles/MyPosts.css';
import Swal from 'sweetalert2';

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPosts = async () => {
      if (!isAuthenticated) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/product/findByUser/${user.id}`,
          { 
            withCredentials: true,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );

        setPosts(response.data);
        setError('');
      } catch (err) {
        console.error('Error al cargar las publicaciones:', err);
        if (err.response?.status === 401) {
          navigate('/login', { replace: true });
        } else {
          setError('Error al cargar las publicaciones');
        }
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.id) {
      loadPosts();
    }
  }, [isAuthenticated, user, navigate]);

  const handleDeletePost = async (postId) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará tu publicación de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/product/delete/${postId}`, {
          withCredentials: true,
        });

        setPosts(posts.filter(post => post.id !== postId));

        Swal.fire({
          title: 'Eliminado',
          text: 'Tu publicación ha sido eliminada correctamente.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error('Error al eliminar la publicación:', err);
        setError('Error al eliminar la publicación');
        Swal.fire('Error', 'No se pudo eliminar la publicación.', 'error');
      }
    }
  };


  // Renderizado del componente
  if (loading) {
    return (
      <div className="my-posts-container">
        <div className="text-center mt-5">Cargando publicaciones...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-posts-container">
        <div className="text-center mt-5 text-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="my-posts-container">
      <div className="my-posts-header">
        <h2>Mis Publicaciones</h2>
        <Link to="/new-publication" className="new-post-button">
          + Nueva Publicación
        </Link>
      </div>

      <div className="posts-grid">
        {posts && posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="post-card">
              <img 
                src={post.images?.[0]?.url || '/placeholder-image.jpg'} 
                alt={post.name}
                className="card-img-top" 
              />
              <div className="post-content">
                <h3>{post.name}</h3>
                <p className="price">${post.price}</p>
                <p className="material-info">
                  Material: {post.categories?.[0]?.name || 'No especificado'}
                </p>
                <div className="post-actions">
                  <Link to={`/edit-post/${post.id}`} className="edit-button">
                    Editar
                  </Link>
                  <button 
                    onClick={() => handleDeletePost(post.id)}
                    className="delete-button"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center w-100">
            <p>No tienes publicaciones aún.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPosts;