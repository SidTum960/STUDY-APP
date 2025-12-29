import React, { useState } from 'react';
import { getHorariosRango } from '../services/api';

function VistaSemanal() {
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0]);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCargarSemana = async () => {
    setLoading(true);
    setError(null);
    
    const inicio = new Date(fechaInicio);
    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + 6); // 7 días

    try {
      const response = await getHorariosRango(
        inicio.toISOString().split('T')[0],
        fin.toISOString().split('T')[0]
      );
      setHorarios(response.data);
    } catch (err) {
      setError('Error al cargar horarios');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Vista Semanal</h1>
      
      <div className="card">
        <div className="form-group">
          <label>Inicio de Semana</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>
        
        <button className="btn btn-primary" onClick={handleCargarSemana} disabled={loading}>
          {loading ? 'Cargando...' : 'Cargar Semana'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {horarios.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          {horarios.map((horario) => (
            <div key={horario._id} className="card">
              <h3>
                {new Date(horario.fecha).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </h3>
              
              {horario.resumen && (
                <div style={{ fontSize: '14px', color: '#666' }}>
                  <span>Clases: {horario.resumen.clases} | </span>
                  <span>Estudio: {horario.resumen.estudio_total} | </span>
                  <span>Libre: {horario.resumen.tiempo_libre}</span>
                </div>
              )}
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                gap: '5px',
                marginTop: '10px' 
              }}>
                {horario.bloques
                  .filter(b => b.tipo !== 'sueño' && b.tipo !== 'negro')
                  .map((bloque, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        padding: '5px', 
                        fontSize: '12px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '3px'
                      }}
                    >
                      <div><strong>{bloque.hora_inicio}</strong></div>
                      <div>{bloque.tipo}</div>
                      {bloque.materia_nombre && <div><em>{bloque.materia_nombre}</em></div>}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VistaSemanal;
