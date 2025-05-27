// src/components/LoginForm.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/RegisterLoginForm.css';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx'; // <-- Importa useAuth

// axios.defaults.withCredentials = true; // Esto ya debería estar configurado globalmente o aquí una vez.

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Para el mensaje de éxito
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // <-- Obtén la función login del contexto

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    console.log('Datos de login a enviar:', { email, password });

    try {
      const response = await axios.post(`${apiBaseUrl}/auth/login`, {
        email: email,
        password: password,
      });

      console.log('Respuesta del servidor (login):', response);
      
      await login(email, password); // Llama a la función login del contexto
                                    // Pasamos email y password por si el contexto los necesita

      setLoading(false);
      setSuccessMessage('¡Bienvenido de nuevo! Redirigiendo...'); // Mensaje amigable

      // Redirige después de un breve momento para que el usuario vea el mensaje
      setTimeout(() => {
        navigate('/publications');
      }, 1500); // Espera 1.5 segundos

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

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleLoginSubmit}>
        <h2>Iniciar Sesión</h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>} {/* Muestra mensaje de éxito */}
        
        {/* ... (inputs de email y password sin cambios) ... */}
         <div className="form-group">
           <label htmlFor="login-email">Correo electrónico</label>
           <input
             type="email"
             id="login-email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             placeholder="usuario@ejemplo.com"
             required
             disabled={loading} // Deshabilita inputs durante la carga
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
             disabled={loading} // Deshabilita inputs durante la carga
           />
         </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Iniciando...' : 'Iniciar Sesión'}
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