import React from 'react';

function Home() {
  return (
    <div className="container">
      <div className="card">
        <h1>Planificador Académico Inteligente</h1>
        <p>
          Bienvenido al sistema de planificación académica basado en algoritmos deterministas
          de priorización.
        </p>
        
        <h2>Características</h2>
        <ul>
          <li>Gestión de materias con créditos y dificultad percibida</li>
          <li>Registro de evaluaciones (exámenes, quizzes, proyectos)</li>
          <li>Generación automática de horarios diarios óptimos</li>
          <li>Sistema de priorización basado en múltiples factores</li>
          <li>Configuración de días especiales y horas de sueño</li>
        </ul>

        <h2>Comenzar</h2>
        <p>
          1. Ve a <strong>Materias</strong> para agregar tus cursos<br/>
          2. Configura tus <strong>Evaluaciones</strong> dentro de cada materia<br/>
          3. Ajusta tu <strong>Configuración</strong> (horas de sueño, días especiales)<br/>
          4. Genera tu <strong>Horario Diario</strong> y visualiza la planificación óptima
        </p>

        <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
          <h3>Tipos de Bloques</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div><span style={{ color: '#2196f3' }}>●</span> Sueño</div>
            <div><span style={{ color: '#ff9800' }}>●</span> Clase</div>
            <div><span style={{ color: '#9c27b0' }}>●</span> Hora Blanca (1h obligatoria)</div>
            <div><span style={{ color: '#4caf50' }}>●</span> Estudio Blanco</div>
            <div><span style={{ color: '#8bc34a' }}>●</span> Estudio Gris</div>
            <div><span style={{ color: '#ffeb3b' }}>●</span> Tiempo Libre</div>
            <div><span style={{ color: '#00bcd4' }}>●</span> Hábito</div>
            <div><span style={{ color: '#795548' }}>●</span> Tiempo Negro</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
