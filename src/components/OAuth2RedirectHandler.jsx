import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleRedirect = async () => {
      // Verificar si hay error en los parámetros de la URL
      const error = searchParams.get('error');
      
      if (error) {
        console.error('Error en OAuth:', error);
        setError(error);
        setTimeout(() => navigate('/login', { replace: true }), 3000);
        return;
      }

      try {
        await checkAuth();
        navigate('/publications', { replace: true });
      } catch (err) {
        console.error('Error durante la redirección OAuth:', err);
        setError('Error durante la autenticación');
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };

    handleRedirect();
  }, [navigate, checkAuth, searchParams]);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ textAlign: 'center' }}>
        {error ? (
          <div style={{ color: 'red', marginBottom: '1rem' }}>
            <p>Error: {error}</p>
            <p>Redirigiendo al login...</p>
          </div>
        ) : (
          <>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p style={{ marginTop: '1rem' }}>Procesando inicio de sesión...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuth2RedirectHandler;