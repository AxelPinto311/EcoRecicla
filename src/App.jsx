import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginFormPage.jsx';
import SignUpPage from './pages/SignUpForm.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* <Route path="/" element={<HomePage />} />  Ruta raíz */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="*" element={<NotFoundPage />} /> {/* Ruta para páginas no encontradas */}
      </Routes>
      {/* Footer */}
    </div>
  );
}

export default App;