// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Configura axios para enviar cookies en cada petición
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(() => {
    // Intentar recuperar el usuario del localStorage al iniciar
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/user/me`, {
        withCredentials: true
      });

      if (response.status === 200) {
        const user = {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          proveedor: response.data.proveedor,
        };

        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar autenticación al montar el componente y cuando cambie la URL
  useEffect(() => {
    checkAuth();
  }, []);

  const loginWithGoogle = () => {
    window.location.href = `${apiBaseUrl}/oauth2/authorization/google`;
  };

  const loginContext = async (userData) => {
    try {
      const response = await axios.post(`${apiBaseUrl}/auth/login`, userData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const user = {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          proveedor: response.data.proveedor,
        };

        console.log('Datos del usuario después del login:', user);
        
        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error en login:', error.response?.data || error);
      throw error;
    }
  };

  const logoutContext = async () => {
    try {
      await axios.post(`${apiBaseUrl}/auth/logout`, {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  if (isLoading) {
    return <div>Verificando sesión...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      loginContext, 
      logoutContext,
      loginWithGoogle, 
      isLoading,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// El hook useAuth se moverá a su propio archivo.