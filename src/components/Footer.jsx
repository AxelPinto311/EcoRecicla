import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLocationDot, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer id="contacto">
      <section className="contactanos_section">
        <div className="contactanos_container">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="contactanos_text_container">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <h3>Contáctanos</h3>
                  <p>
                    ¿Tienes preguntas o sugerencias? Estamos aquí para ayudarte. No dudes en ponerte en <br />
                    contacto con nuestro equipo.
                  </p>
                </div>
              </div>
            </div>
            <div className="row info_contacto_row">
              <div className="col-md-4">
                <div className="info_contacto_container">
                  <FontAwesomeIcon icon={faLocationDot} />
                  <p className="info_title">Ubicación</p>
                  <p>Catamarca 219, Ciudad de Mendoza</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="info_contacto_container">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <p className="info_title">Email</p>
                  <p>ecorecicla@gmail.com</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="info_contacto_container">
                  <FontAwesomeIcon icon={faUserGroup} />
                  <p className="info_title">Redes Sociales</p>
                  <p>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>,{' '}
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}

export default Footer;