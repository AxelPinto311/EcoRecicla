import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/RegisterLoginForm.css';
import axios from 'axios';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    // --- LLAMADA AL BACKEND PARA LOGIN (Descomentar y adaptar) ---
    console.log('Datos de login:', { email, password });
    /*
    try {
      // Reemplazar '/api/login' con endpoint de login
      const response = await axios.post('/api/login', {
        correoElectronico: email,
        contrasena: password,
      });

      console.log('Respuesta del servidor (login):', response.data);
      setLoading(false);

      // Aquí podrías guardar el token de autenticación recibido del backend
      // Ejemplo: localStorage.setItem('authToken', response.data.token);

      // Redirige al usuario a su dashboard o página principal
      alert('¡Inicio de sesión exitoso!');
      navigate('/dashboard');

    } catch (err) {
      setLoading(false);
      console.error('Error en el inicio de sesión:', err);
      setError(err.response?.data?.message || 'Correo electrónico o contraseña incorrectos.');
    }
    */
    // --- FIN EJEMPLO BACKEND ---

     // Simulación de carga (sin el backend aún)
     setTimeout(() => {
       setLoading(false);
       // alert('Simulación: Login enviado'); // Comenta esto si usas el backend
     }, 1500);
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleLoginSubmit}>
        <h2>Iniciar Sesión</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="login-email">Correo electrónico</label>
          <input
            type="email"
            id="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@ejemplo.com"
            required
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
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>

        <p className="login-link">
          ¿No tienes una cuenta?{' '}
          <Link to="/signup">Regístrate</Link> {/* Enlace a la página de registro */}
        </p>
      </form>
    </div>
  );
}

export default LoginForm;