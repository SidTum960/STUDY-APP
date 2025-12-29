import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="nav">
      <Link to="/">Inicio</Link>
      <Link to="/materias">Materias</Link>
      <Link to="/horario">Horario Diario</Link>
      <Link to="/semanal">Vista Semanal</Link>
      <Link to="/configuracion">Configuración</Link>
    </nav>
  );
}

export default Navigation;
