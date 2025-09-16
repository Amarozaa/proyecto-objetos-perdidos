import React from 'react';
import { Link } from 'react-router-dom';

const Inicio: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>Página de inicio</h1>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>
            <Link to="/listado">Ir al listado de objetos perdidos</Link>
          </li>
          <li>
            <Link to="/formulario">Ir al formulario de publicación</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Inicio;
