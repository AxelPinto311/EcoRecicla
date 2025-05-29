// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Configura axios para enviar cookies en cada petición
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica si hay sesión activa al montar el componente
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/auth/me`);
        if (response.data) {
          setIsAuthenticated(true);
          setUser(response.data);
        }
      } catch (error) {
        console.log('AuthContext: No hay sesión activa o error al verificar:', error.response?.data || error.message);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    verifyAuth();
  }, []);

  // Actualiza el estado al iniciar sesión
  const loginContext = (userDataFromLogin) => {
    setIsAuthenticated(true);
    setUser(userDataFromLogin);
  };

  // Limpia el estado al cerrar sesión
  const logoutContext = async () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  if (isLoading) {
    return <div>Verificando sesión...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loginContext, logoutContext, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// El hook useAuth se moverá a su propio archivo.