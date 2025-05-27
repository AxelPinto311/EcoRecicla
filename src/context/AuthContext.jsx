// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Para guardar información del usuario, como el nombre/email
  const [loadingAuth, setLoadingAuth] = useState(true); // Para verificar el estado inicial

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Función para verificar si ya hay una sesión activa (ej. al cargar la app)
  // Esto es opcional pero bueno para persistencia. Requiere un endpoint en backend.
  // Por ahora, lo dejaremos simple y el estado se reiniciará al recargar.
  // En un futuro, podrías tener un endpoint /auth/me o /auth/status
  useEffect(() => {
    // Simulación: si hubiera un token o cookie que verificar al inicio
    // Ejemplo:
    // const checkAuthStatus = async () => {
    //   try {
    //     // Suponiendo que tienes un endpoint que devuelve info del usuario si está logueado
    //     const response = await axios.get(`${apiBaseUrl}/auth/verify`); // O /auth/me
    //     if (response.data && response.data.user) {
    //       setIsAuthenticated(true);
    //       setUser(response.data.user); // Asumiendo que el backend devuelve { user: { name: '...', email: '...' } }
    //     }
    //   } catch (error) {
    //     setIsAuthenticated(false);
    //     setUser(null);
    //   } finally {
    //     setLoadingAuth(false);
    //   }
    // };
    // checkAuthStatus();
    setLoadingAuth(false); // Por ahora, solo indicamos que la carga inicial de auth terminó
  }, [apiBaseUrl]);


  const login = async (email, password) => {
    // La llamada a axios.post se hará en LoginForm
    // Aquí solo actualizamos el estado después de un login exitoso
    setIsAuthenticated(true);
    // El backend no devuelve el nombre de usuario directamente en la respuesta de login.
    // Podrías hacer otra llamada para obtener datos del usuario o usar el email.
    setUser({ name: email.split('@')[0], email: email }); // Usamos parte del email como nombre temporal
    // O setUser({ name: "Usuario Autenticado", email: email });
  };

  const logout = async () => {
    // Aquí podrías llamar a un endpoint de logout en tu backend si es necesario
    // ej: await axios.post(`${apiBaseUrl}/auth/logout`);
    // Tu backend ya borra cookies en /auth/delete, pero un logout específico es mejor.
    // Por ahora, solo limpiamos el estado del frontend
    setIsAuthenticated(false);
    setUser(null);
    // Las cookies HttpOnly se borran por el backend o expiran.
    // Si tienes tokens en localStorage, límpialos aquí.
  };

  if (loadingAuth) {
    return <div>Cargando autenticación...</div>; // O un spinner
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};