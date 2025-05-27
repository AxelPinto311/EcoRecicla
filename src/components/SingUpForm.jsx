// src/components/SignUpForm.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/RegisterLoginForm.css';
import axios from 'axios';

// Configure axios to send cookies with requests (if not already set globally elsewhere)
// If LoginForm.jsx already set this, it's fine, defaults apply to all axios instances.
// axios.defaults.withCredentials = true;

function SignUpForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    console.log('Datos de registro a enviar:', { name: fullName, email, password });

    try {
      const response = await axios.post(`${apiBaseUrl}/auth/register`, {
        name: fullName, // Your RegisterDTO expects 'name'
        email: email,    // 'email' matches
        password: password // 'password' matches
      });

      console.log('Respuesta del servidor (registro):', response);
      setLoading(false);

      // Similar to login, cookies should be set by the browser on successful registration.
      alert('¡Registro exitoso! Serás redirigido para iniciar sesión.');
      navigate('/login'); // Redirect to login page after successful registration

    } catch (err) {
      setLoading(false);
      console.error('Error en el registro:', err);
      if (err.response) {
        // Error from backend
        setError(err.response.data?.message || err.response.data?.error || 'Ocurrió un error al registrarse.');
      } else if (err.request) {
        // Request was made but no response received
        setError('No se pudo conectar al servidor. Inténtalo más tarde.');
      } else {
        // Something else happened
        setError('Ocurrió un error inesperado.');
      }
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Crear una cuenta</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="fullName">Nombre completo</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Juan Pérez"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@ejemplo.com"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
            minLength="6" // O la validación que tengas en el backend
          />
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
        <p className="login-link">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}

export default SignUpForm;