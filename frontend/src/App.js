import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Materias from './pages/Materias';
import HorarioDiario from './pages/HorarioDiario';
import VistaSemanal from './pages/VistaSemanal';
import Configuracion from './pages/Configuracion';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/materias" element={<Materias />} />
          <Route path="/horario" element={<HorarioDiario />} />
          <Route path="/semanal" element={<VistaSemanal />} />
          <Route path="/configuracion" element={<Configuracion />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
