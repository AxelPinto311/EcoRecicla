// src/App.jsx
import React from 'react'; // Ya no necesitas useState aquí para auth
import { Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginFormPage.jsx';
import SignUpPage from './pages/SignUpFormPage.jsx'; // Corregido el nombre de import si el archivo se llama SignUpFormPage.jsx
import NotFoundPage from './pages/NotFoundPage.jsx';
import HomePage from './pages/HomePage.jsx';
import PublicationsPage from './pages/PublicationsPage.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { useAuth } from './context/AuthContext.jsx'; // Para lógica condicional si es necesario aquí
import './App.css';

function App() {
  const location = useLocation();
  // El estado de autenticación ahora se maneja en AuthContext
  // const { isAuthenticated } = useAuth(); // Podrías usarlo si App necesita saber directamente

  const noHeaderFooterRoutes = ['/login', '/signup'];
  const showHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname);

  return (
    <div className="App">
      {/* Header ya no necesita isAuthenticated o userName como props, los tomará del contexto */}
      {showHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/publications" element={<PublicationsPage />} />
        <Route path="/login" element={<LoginPage />} /> {/* LoginPage ahora usará el contexto */}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {showHeaderFooter && <Footer />}
    </div>
  );
}

export default App;