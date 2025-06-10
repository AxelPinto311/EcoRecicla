import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/MyPosts.css';

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/posts/my-posts`);
        setPosts(response.data);
      } catch (err) {
        setError('Error al cargar las publicaciones');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  const handleDeletePost = async (postId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/posts/${postId}`);
        setPosts(posts.filter(post => post.id !== postId));
      } catch {
        setError('Error al eliminar la publicación');
      }
    }
  };

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.status === filter);

  if (loading) return <div className="loading">Cargando publicaciones...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="my-posts-container">
      <div className="my-posts-header">
        <h2>Mis Publicaciones</h2>
        <Link to="/new-publication" className="new-post-button">
          + Nueva Publicación
        </Link>
      </div>

      <div className="filter-buttons">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todas
        </button>
        <button 
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Activas
        </button>
        <button 
          className={`filter-btn ${filter === 'sold' ? 'active' : ''}`}
          onClick={() => setFilter('sold')}
        >
          Vendidas
        </button>
      </div>

      <div className="posts-grid">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <div key={post.id} className="post-card">
              <img src={post.imageUrl} alt={post.title} />
              <div className="post-content">
                <h3>{post.title}</h3>
                <p className="price">${post.price}</p>
                <p className="status">Estado: {post.status === 'active' ? 'Activa' : 'Vendida'}</p>
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
          <p className="no-posts">No tienes publicaciones {filter !== 'all' ? 'en esta categoría' : ''}</p>
        )}
      </div>
    </div>
  );
}

export default MyPosts;