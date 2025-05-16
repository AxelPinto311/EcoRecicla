import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

function HeroSection() {
  return (
    <section className="section_titulo_hero">
      <div className="titulo_hero_content">
        <div className="container">
          <div className="row">
            <div className="col-md-12 container-col-texto-hero">
              <div className="texto_titulo_container_hero">
                <h2>Juntos por un mundo más limpio</h2>
                <p className="text_unete_hero">
                  Únete a nuestra comunidad y aprende a reciclar de manera efectiva. Cada pequeña acción cuenta para crear un futuro sostenible.
                </p>
                <Link className="a_btn_regristrar_hero" to="/signup">
                  <button className="btn btn-primary btn_registrar_hero">
                    Regístrate Ahora
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="row cards_info_hero">
            <div className="col-md-4">
              <div className="cuadros_container_hero">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Aprende a reciclar</h5>
                    <p className="card-text">
                      Descubre técnicas efectivas para separar y reciclar diferentes materiales.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="cuadros_container_hero">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Gana Puntos</h5>
                    <p className="card-text">
                      Obtén recompensas por tus acciones sostenibles y contribuye al medio ambiente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="cuadros_container_hero">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Compra y Vende</h5>
                    <p className="card-text">
                      Publica tus productos reciclables en nuestra web, vende y recicla.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;