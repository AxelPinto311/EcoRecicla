import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import '../styles/HomePage.css';

function AboutUsSection() {
  return (
    <section className="section_sobre_nosotros_hero" id="nosotros">
      <div className="sobre_nosotros_container_hero">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="sobre_nosotros_text_container_hero">
                <FontAwesomeIcon icon={faUsers} />
                <h3>Sobre Nosotros</h3>
                <p>
                  Somos un equipo comprometido con el medio ambiente y la sostenibilidad. Nuestra misión es hacer del reciclaje una práctica cotidiana y accesible para todos.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="sobre_nosotros_info_container_hero">
                <h4>Nuestra misión</h4>
                <p>
                  Facilitar y promover el reciclaje responsable en nuestra comunidad, proporcionando herramientas y conocimientos para un futuro más sostenible.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="sobre_nosotros_info_container_hero">
                <h4>Nuestra visión</h4>
                <p>
                  Ser líderes en la transformación hacia una sociedad más consciente y comprometida con el cuidado del medio ambiente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUsSection;