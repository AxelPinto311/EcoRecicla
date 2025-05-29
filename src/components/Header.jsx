// src/components/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../hooks/useAuth.jsx';
import '../styles/Header.css';

function Header() {
  const { isAuthenticated, user, logoutContext } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Aquí podrías manejar la búsqueda
    console.log('Buscando:', searchTerm);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  // Alterna el menú en mobile
  const handleNavCollapse = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  const handleLogout = async () => {
    setIsUserDropdownOpen(false);
    setIsNavCollapsed(true);
    await logoutContext();
    navigate('/login');
  };

  const userNameToDisplay = user?.username || user?.name || user?.email?.split('@')[0] || "Usuario";

  return (
    <header id="app-header">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand ecorecicla_log" to={isAuthenticated ? "/publications" : "/"}
            onClick={() => setIsNavCollapsed(true)}>
            EcoRecicla
          </Link>

          {isAuthenticated && (
            <div className="buscador_container">
              <form onSubmit={handleSearchSubmit} className="input-group">
                <span className="input-group-text" id="basic-addon1">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Busca materiales reciclables"
                  aria-label="Buscar materiales reciclables"
                  aria-describedby="basic-addon1"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </form>
            </div>
          )}

          <button
            className="navbar-toggler"
            type="button"
            onClick={handleNavCollapse}
            aria-controls="navbarScroll"
            aria-expanded={!isNavCollapsed}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className={`collapse navbar-collapse ul_container ${!isNavCollapsed ? 'show' : ''}`}
            id="navbarScroll"
          >
            {isAuthenticated ? (
              // Navbar para usuarios autenticados
              <ul className="navbar-nav mb-2 mb-lg-0 ms-auto">
                <li className="nav-item">
                  <Link className="nav-link btn-like btn-publicaciones" to="/publications" onClick={() => setIsNavCollapsed(true)}>
                    Publicaciones
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link btn-like btn-mapa" to="/#mapa_verde_section" onClick={() => setIsNavCollapsed(true)}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> Mapa
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link btn-like btn-nueva-publicacion" to="/new-publication" onClick={() => setIsNavCollapsed(true)}>
                    + Nueva Publicación
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link btn-like btn-contacto" to="/#contacto" onClick={() => setIsNavCollapsed(true)}>
                    Contacto
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <button
                    className="btn dropdown-toggle btn_name_user"
                    type="button"
                    onClick={toggleUserDropdown}
                    aria-expanded={isUserDropdownOpen}
                  >
                    {userNameToDisplay}
                  </button>
                  <ul className={`dropdown-menu ${isUserDropdownOpen ? 'show' : ''}`}>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Cerrar sesión
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>
            ) : (
              // Navbar para usuarios no autenticados
              <ul className="navbar-nav mb-2 mb-lg-0 ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/#mapa_verde_section" onClick={() => setIsNavCollapsed(true)}>
                    Mapa
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/#nosotros" onClick={() => setIsNavCollapsed(true)}>
                    Nosotros
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/#contacto" onClick={() => setIsNavCollapsed(true)}>
                    Contacto
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={() => setIsNavCollapsed(true)}>
                    <button className="btn btn_iniciar_sesion">
                      Iniciar sesión
                    </button>
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;