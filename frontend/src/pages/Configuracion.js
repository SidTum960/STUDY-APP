import React, { useState, useEffect } from 'react';
import { getUsuario, updateUsuario, getDiasEspeciales, createDiaEspecial, deleteDiaEspecial } from '../services/api';

function Configuracion() {
  const [usuario, setUsuario] = useState({ horas_sueno: 8 });
  const [diasEspeciales, setDiasEspeciales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showDiaForm, setShowDiaForm] = useState(false);
  
  const [diaData, setDiaData] = useState({
    fecha: '',
    tipo: 'ocio_total'
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [userRes, diasRes] = await Promise.all([
        getUsuario().catch(() => ({ data: { horas_sueno: 8 } })),
        getDiasEspeciales()
      ]);
      setUsuario(userRes.data);
      setDiasEspeciales(diasRes.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar configuración');
      setLoading(false);
    }
  };

  const handleUpdateUsuario = async (e) => {
    e.preventDefault();
    try {
      await updateUsuario(usuario);
      setSuccess('Configuración guardada exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Error al guardar configuración');
    }
  };

  const handleAddDia = async (e) => {
    e.preventDefault();
    try {
      await createDiaEspecial(diaData);
      setShowDiaForm(false);
      setDiaData({ fecha: '', tipo: 'ocio_total' });
      cargarDatos();
    } catch (err) {
      setError('Error al agregar día especial');
    }
  };

  const handleDeleteDia = async (id) => {
    if (window.confirm('¿Eliminar este día especial?')) {
      try {
        await deleteDiaEspecial(id);
        cargarDatos();
      } catch (err) {
        setError('Error al eliminar día especial');
      }
    }
  };

  if (loading) return <div className="container"><div className="loading">Cargando...</div></div>;

  return (
    <div className="container">
      <h1>Configuración</h1>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="card">
        <h2>Configuración de Usuario</h2>
        <form onSubmit={handleUpdateUsuario}>
          <div className="form-group">
            <label>Horas de Sueño</label>
            <input
              type="number"
              value={usuario.horas_sueno}
              onChange={(e) => setUsuario({...usuario, horas_sueno: Number(e.target.value)})}
              min="4"
              max="12"
              step="0.5"
            />
          </div>
          <button type="submit" className="btn btn-primary">Guardar Configuración</button>
        </form>
      </div>

      <div className="card">
        <h2>Días Especiales</h2>
        <button className="btn btn-primary" onClick={() => setShowDiaForm(!showDiaForm)}>
          {showDiaForm ? 'Cancelar' : 'Agregar Día Especial'}
        </button>

        {showDiaForm && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <form onSubmit={handleAddDia}>
              <div className="form-group">
                <label>Fecha</label>
                <input
                  type="date"
                  value={diaData.fecha}
                  onChange={(e) => setDiaData({...diaData, fecha: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Tipo</label>
                <select
                  value={diaData.tipo}
                  onChange={(e) => setDiaData({...diaData, tipo: e.target.value})}
                >
                  <option value="ocio_total">Ocio Total</option>
                  <option value="trabajo_limitado">Trabajo Limitado</option>
                  <option value="dia_negro">Día Negro</option>
                </select>
              </div>
              
              <button type="submit" className="btn btn-primary">Agregar</button>
            </form>
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          {diasEspeciales.length === 0 ? (
            <p>No hay días especiales configurados</p>
          ) : (
            diasEspeciales.map((dia) => (
              <div 
                key={dia._id} 
                style={{ 
                  padding: '10px', 
                  marginBottom: '10px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <strong>{new Date(dia.fecha).toLocaleDateString()}</strong>
                  <span style={{ marginLeft: '10px', color: '#666' }}>{dia.tipo}</span>
                </div>
                <button className="btn btn-danger" onClick={() => handleDeleteDia(dia._id)}>
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card">
        <h2>Información del Sistema</h2>
        <p>
          El sistema calcula prioridades basándose en:
        </p>
        <ul>
          <li><strong>Créditos:</strong> Mayor peso base para materias con más créditos</li>
          <li><strong>Dificultad:</strong> Factor exponencial que aumenta la prioridad</li>
          <li><strong>Evaluaciones:</strong> Multiplicador que crece según proximidad temporal</li>
          <li><strong>Estado de clase:</strong> Mayor prioridad después de ver una clase</li>
        </ul>
        <p style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff9c4', borderRadius: '4px' }}>
          <strong>Nota:</strong> El sistema es completamente determinista y no modela fatiga ni preferencias personales.
        </p>
      </div>
    </div>
  );
}

export default Configuracion;
