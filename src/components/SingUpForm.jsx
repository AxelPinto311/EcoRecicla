import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/RegisterLoginForm.css';
import axios from 'axios';

function SignUpForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    console.log('Datos a enviar:', { fullName, email, password });

    // --- EJEMPLO DE LLAMADA AL BACKEND (descomentar y adaptar) ---
    /*
    try {
      // Reemplaza '/api/register' con la URL de tu endpoint de registro
      const response = await axios.post('/api/register', {
        nombreCompleto: fullName, // Asegúrate que los nombres coincidan con lo que espera tu backend
        correoElectronico: email,
        contrasena: password,
      });

      console.log('Respuesta del servidor:', response.data);
      setLoading(false);

      // Si el registro es exitoso, puedes redirigir al usuario
      // Por ejemplo, a la página de inicio de sesión o a un dashboard
      alert('¡Registro exitoso!'); // O mostrar un mensaje mejor
      navigate('/login'); // Redirige a la página de login (asegúrate que la ruta exista)

    } catch (err) {
      setLoading(false);
      console.error('Error en el registro:', err);
      // Intenta obtener un mensaje de error específico del backend si está disponible
      setError(err.response?.data?.message || 'Ocurrió un error al registrarse. Inténtalo de nuevo.');
    }
    */

    // --- FIN EJEMPLO BACKEND ---

    // Simulación de carga (sin backend aún)
     setTimeout(() => {
       setLoading(false);
       // alert('Simulación: Registro enviado'); // Comenta esto si usas el backend
     }, 1500);
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
            minLength="6"
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>

        <p className="login-link">
          ¿Ya tienes una cuenta?{' '}
          {/* Para navegar a la ruta de inicio de sesión */}
          <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}

export default SignUpForm;