import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/Header.css';

function Header({ isAuthenticated = false, userName = "Usuario" }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Buscando:', searchTerm);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    console.log('Cerrando sesión');
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand ecorecicla_log" to={isAuthenticated ? "/publications" : "/"}>
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
            data-bs-toggle="collapse"
            data-bs-target="#navbarScroll"
            aria-controls="navbarScroll"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse ul_container" id="navbarScroll">
            {isAuthenticated ? (
              <ul className="navbar-nav mb-2 mb-lg-0 ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/map">
                    <button className="btn boton_ver_mapa">
                      <FontAwesomeIcon icon={faMapMarkerAlt} /> Ver Mapa
                    </button>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/new-publication">
                    <button className="btn boton_nueva_publicacion">
                      + Nueva Publicación
                    </button>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/#contacto">
                    <button className="btn btn_contacto">Contacto</button>
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <button
                    className="btn dropdown-toggle btn_name_user"
                    type="button"
                    onClick={toggleDropdown}
                    aria-expanded={isDropdownOpen}
                  >
                    {userName}
                  </button>
                  {isDropdownOpen && (
                    <ul className="dropdown-menu show">
                      <li>
                        <button className="dropdown-item" onClick={handleLogout}>
                          Cerrar sesión
                        </button>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            ) : (
              <ul className="navbar-nav mb-2 mb-lg-0 ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/#mapa_verde_section">
                    Mapa
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/#nosotros">
                    Nosotros
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/#contacto">
                    Contacto
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
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