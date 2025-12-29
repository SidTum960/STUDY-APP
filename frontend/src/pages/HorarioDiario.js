import React, { useState } from 'react';
import { generarHorario, getHorario } from '../services/api';
import BloqueHorario from '../components/BloqueHorario';

function HorarioDiario() {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [horario, setHorario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerar = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await generarHorario(fecha);
      setHorario(response.data);
    } catch (err) {
      setError('Error al generar horario: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCargar = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getHorario(fecha);
      setHorario(response.data);
    } catch (err) {
      setError('No hay horario generado para esta fecha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Horario Diario</h1>
      
      <div className="card">
        <div className="form-group">
          <label>Seleccionar Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-primary" onClick={handleGenerar} disabled={loading}>
            {loading ? 'Generando...' : 'Generar Horario'}
          </button>
          <button className="btn btn-secondary" onClick={handleCargar} disabled={loading}>
            Cargar Existente
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {horario && (
        <div className="card">
          <h2>Horario para {new Date(horario.fecha).toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</h2>
          
          {horario.resumen && (
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#e3f2fd', 
              borderRadius: '4px', 
              marginBottom: '20px' 
            }}>
              <h3>Resumen</h3>
              <p>
                <strong>Total de bloques:</strong> {horario.resumen.total_bloques} | 
                <strong> Clases:</strong> {horario.resumen.clases} | 
                <strong> Estudio:</strong> {horario.resumen.estudio_total} | 
                <strong> Tiempo libre:</strong> {horario.resumen.tiempo_libre}
              </p>
              {horario.resumen.mensaje && <p><em>{horario.resumen.mensaje}</em></p>}
            </div>
          )}

          <div className="horario-grid">
            {horario.bloques && horario.bloques.length > 0 ? (
              horario.bloques.map((bloque, index) => (
                <BloqueHorario key={index} bloque={bloque} />
              ))
            ) : (
              <p>No hay bloques programados para este día.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HorarioDiario;
