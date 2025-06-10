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
import MyPosts from './components/MyPosts';
import PublicationDetail from './components/PublicationDetail';
import { useAuth } from './hooks/useAuth.jsx';
import './App.css';

// Componente principal de la aplicación
function App() {
  const location = useLocation();

  // Oculta header y footer en login y registro
  const noHeaderFooterRoutes = ['/login', '/signup'];
  const showHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname);

  return (
    <div className="App">
      {showHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Rutas protegidas solo para usuarios autenticados */}
        <Route element={<ProtectedRoute />}>
          <Route path="/publications" element={<PublicationsPage />} />
          <Route path="/publications/:id" element={<PublicationDetail />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/create-branch" element={<CreateBranchForm />} />
          <Route path="/new-publication" element={<NewPublicationForm />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {showHeaderFooter && <Footer />}
    </div>
  );
}

export default App;