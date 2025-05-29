// src/components/LoginForm.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/RegisterLoginForm.css';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth.jsx';

const GoogleIcon = () => (
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ marginRight: '10px', verticalAlign: 'middle', width: '20px', height: '20px' }}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginContext } = useAuth();

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Envía el formulario de inicio de sesión
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      await axios.post(`${apiBaseUrl}/auth/login`, {
        email: email,
        password: password,
      });

      loginContext({ username: email.split('@')[0], email: email });

      setLoading(false);
      setSuccessMessage('¡Bienvenido de nuevo! Redirigiendo...');

      setTimeout(() => {
        navigate('/publications');
      }, 1500);

    } catch (err) {
      setLoading(false);
      console.error('Error en el inicio de sesión:', err);
      if (err.response) {
        setError(err.response.data?.message || err.response.data?.error || 'Correo electrónico o contraseña incorrectos.');
      } else if (err.request) {
        setError('No se pudo conectar al servidor. Inténtalo más tarde.');
      } else {
        setError('Ocurrió un error inesperado.');
      }
    }
  };

  // Login con Google
  const handleGoogleLogin = () => {
    window.location.href = `${apiBaseUrl}/oauth2/authorization/google`;
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleLoginSubmit}>
        <div className="back-to-home-link">
          <Link to="/">&larr; Volver al Inicio</Link>
        </div>

        <h2>Iniciar Sesión</h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        
        <div className="form-group">
          <label htmlFor="login-email">Correo electrónico</label>
          <input
            type="email"
            id="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@ejemplo.com"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="login-password">Contraseña</label>
          <input
            type="password"
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>

        <div className="or-separator">
          <span className="or-text">o</span>
        </div>

        <button
          type="button"
          className="google-login-button"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <GoogleIcon />
          Continuar con Google
        </button>

        <p className="login-link">
          ¿No tienes una cuenta?{' '}
          <Link to="/signup">Regístrate</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;