// src/App.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginFormPage.jsx';
import SignUpPage from './pages/SignUpFormPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import HomePage from './pages/HomePage.jsx';
import PublicationsPage from './pages/PublicationsPage.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import CreateBranchForm from './components/CreateBranchForm';
import NewPublicationForm from './components/NewPublicationForm';
import EditPublicationForm from './components/EditPublicationForm';
import MyPosts from './components/MyPosts';
import PublicationDetail from './components/PublicationDetail';
import { useAuth } from './hooks/useAuth.jsx';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Componente principal de la aplicación
function App() {
  const location = useLocation();

  // Oculta header y footer en login y registro
  const noHeaderFooterRoutes = ['/login', '/signup', '/oauth2/redirect'];
  const showHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname);

  return (
    <div className="App">
      {showHeaderFooter && <Header />}
      <Routes>
        {/* Ruta de OAuth primero para manejar la redirección */}
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        
        {/* Rutas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        
        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/publications" element={<PublicationsPage />} />
          <Route path="/publications/:id" element={<PublicationDetail />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/edit-post/:id" element={<EditPublicationForm />} />
          <Route path="/create-branch" element={<CreateBranchForm />} />
          <Route path="/new-publication" element={<NewPublicationForm />} />
        </Route>
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {showHeaderFooter && <Footer />}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default App;