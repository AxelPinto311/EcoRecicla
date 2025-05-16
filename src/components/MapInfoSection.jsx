import React from 'react';
import '../styles/HomePage.css';
import { Link } from 'react-router-dom';

function MapInfoSection() {
  const mapUrl = "https://www.google.com/maps/d/u/0/embed?mid=17bvpw8C9KIEINzFvucwolpgPLekBpTXF&ehbc=2E312F&ll=-32.8794403661246%2C-68.92507834999999&z=11";

  return (
    <section className="mapa_verde_section_hero" id="mapa_verde_section">
      <div className="mapa_verde_container_hero inner_content">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="mapa_verde_text_container_hero">
                <h3>Puntos Verdes de Reciclaje</h3>
                <p>
                  Encuentra los puntos de reciclaje más cercanos a tu ubicación. Contribuye al medio ambiente
                  <br />
                  reciclando de manera responsable.
                </p>
              </div>
              <div className="mapa_iframe_container_hero">
                <iframe
                  className="mapa_iframe_hero"
                  src={mapUrl}
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa de Puntos Verdes"
                ></iframe>
              </div>
              <div className="mapa_verde_btn_container_hero">
                {/* Si es una ruta interna de React: */}
                <Link to="/mapa-completo" className="btn btn_mapa_completo_hero">
                     Ver Mapa Completo
                </Link>
                {/* Si es un link externo o una funcionalidad diferente:
                <button className="btn btn_mapa_completo_hero">Ver Mapa Completo</button>
                */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MapInfoSection;