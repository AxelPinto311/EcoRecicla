import React, { useState, useEffect } from 'react';
import '../styles/ReciclaPage.css';
<Route path="/recicla" element={<ReciclaPage />} />
function ReciclaPage() {
  return (
    <div className="recicla-main-content">
      <h1 className="mb-4">Aprender a Reciclar</h1>

      <section className="mb-4">
        <p>
          Reciclar es el proceso mediante el cual transformamos residuos en nuevos productos o materias primas.
          Esto permite reducir la contaminación, ahorrar recursos naturales y disminuir la cantidad de basura que generamos diariamente.
        </p>
        <p>
          Reciclar no solo ayuda al planeta, sino que también promueve una vida más consciente y sostenible.
          Si querés comenzar a reciclar pero no sabés por dónde empezar, esta guía está pensada para vos.
        </p>
      </section>

      <section className="mb-4">
        <h2>¿Cómo Separar los Residuos?</h2>
        <ol>
          <li>
            <strong>Usá 3 tachos o bolsas de distinto color:</strong>
            <ul>
              <li><strong>Secos reciclables (verde/azul):</strong> papel, cartón, plástico limpio, vidrio, metales.</li>
              <li><strong>Húmedos u orgánicos (negro):</strong> restos de comida, yerba, cáscaras.</li>
              <li><strong>No reciclables (rojo):</strong> pañales, colillas, toallitas, cartón sucio.</li>
            </ul>
          </li>
          <li><strong>Limpiá los reciclables</strong> antes de tirarlos. Ejemplo: enjuagá una botella de yogur.</li>
          <li><strong>Compactá</strong> todo lo posible: plegá cajas, aplastá botellas, etc.</li>
        </ol>
      </section>

      <section className="mb-4">
        <h2>¿Qué NO se recicla?</h2>
        <ul>
          <li>Papel o cartón sucios con comida o grasa.</li>
          <li>Vidrios rotos o espejos.</li>
          <li>Bolsas metalizadas (como las de snacks).</li>
          <li>Pañales, toallitas, elementos de higiene personal.</li>
        </ul>
      </section>

      <section className="mb-4">
        <h2>¿Qué SÍ se recicla?</h2>
        <ul>
          <li>Botellas y tapitas de plástico.</li>
          <li>Cartón y papel limpio.</li>
          <li>Latas de aluminio.</li>
          <li>Frascos y botellas de vidrio.</li>
          <li>Envases de tetra pak (limpios y secos).</li>
        </ul>
      </section>

      <section className="mb-4">
        <h2>Tips para Reciclar Mejor</h2>
        <ul>
          <li>Colocá carteles o colores en cada tacho.</li>
          <li>Participá en campañas barriales.</li>
          <li>Llevá los reciclables a puntos verdes.</li>
          <li>Reutilizá antes de desechar.</li>
        </ul>
      </section>

      <section className="highlight-box">
        <h3>🌍 ¡Sumate al cambio!</h3>
        <p>Cada pequeño gesto cuenta. Separar tus residuos es el primer paso hacia un futuro más limpio.</p>
      </section>
    </div>
  );
}

export default ReciclaPage;
