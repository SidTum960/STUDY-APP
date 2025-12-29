import React, { useState, useEffect } from 'react';
import { getMaterias, createMateria, deleteMateria, addEvaluacion } from '../services/api';

function Materias() {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEvalForm, setShowEvalForm] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    creditos: 3,
    dificultad_percibida: 1,
    horarios_clase: []
  });
  
  const [evalData, setEvalData] = useState({
    tipo: 'examen',
    fecha: '',
    multiplicador: 3
  });

  useEffect(() => {
    cargarMaterias();
  }, []);

  const cargarMaterias = async () => {
    try {
      const response = await getMaterias();
      setMaterias(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar materias');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMateria(formData);
      setShowForm(false);
      setFormData({ nombre: '', creditos: 3, dificultad_percibida: 1, horarios_clase: [] });
      cargarMaterias();
    } catch (err) {
      setError('Error al crear materia');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta materia?')) {
      try {
        await deleteMateria(id);
        cargarMaterias();
      } catch (err) {
        setError('Error al eliminar materia');
      }
    }
  };

  const handleAddEval = async (materiaId) => {
    try {
      await addEvaluacion(materiaId, evalData);
      setShowEvalForm(null);
      setEvalData({ tipo: 'examen', fecha: '', multiplicador: 3 });
      cargarMaterias();
    } catch (err) {
      setError('Error al agregar evaluación');
    }
  };

  if (loading) return <div className="container"><div className="loading">Cargando...</div></div>;
  if (error) return <div className="container"><div className="error">{error}</div></div>;

  return (
    <div className="container">
      <h1>Gestión de Materias</h1>
      
      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancelar' : 'Agregar Materia'}
      </button>

      {showForm && (
        <div className="card" style={{ marginTop: '20px' }}>
          <h2>Nueva Materia</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Créditos</label>
              <input
                type="number"
                value={formData.creditos}
                onChange={(e) => setFormData({...formData, creditos: Number(e.target.value)})}
                min="1"
                max="6"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Dificultad Percibida (0-3)</label>
              <input
                type="number"
                value={formData.dificultad_percibida}
                onChange={(e) => setFormData({...formData, dificultad_percibida: Number(e.target.value)})}
                min="0"
                max="3"
                step="0.1"
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary">Crear Materia</button>
          </form>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        {materias.map((materia) => (
          <div key={materia._id} className="card">
            <h3>{materia.nombre}</h3>
            <p>
              <strong>Créditos:</strong> {materia.creditos} | 
              <strong> Dificultad:</strong> {materia.dificultad_percibida} | 
              <strong> Estado:</strong> {materia.estado_clase}
            </p>
            
            {materia.evaluaciones && materia.evaluaciones.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <strong>Evaluaciones:</strong>
                <ul>
                  {materia.evaluaciones.map((eval, idx) => (
                    <li key={idx}>
                      {eval.tipo} - {new Date(eval.fecha).toLocaleDateString()} 
                      {eval.activa ? ' (Activa)' : ' (Inactiva)'}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div style={{ marginTop: '10px' }}>
              <button 
                className="btn btn-secondary" 
                style={{ marginRight: '10px' }}
                onClick={() => setShowEvalForm(showEvalForm === materia._id ? null : materia._id)}
              >
                Agregar Evaluación
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(materia._id)}>
                Eliminar
              </button>
            </div>

            {showEvalForm === materia._id && (
              <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                <h4>Nueva Evaluación</h4>
                <div className="form-group">
                  <label>Tipo</label>
                  <select
                    value={evalData.tipo}
                    onChange={(e) => {
                      const tipo = e.target.value;
                      let mult = 3;
                      if (tipo === 'quiz') mult = 2;
                      if (tipo === 'proyecto_largo') mult = 1.5;
                      setEvalData({...evalData, tipo, multiplicador: mult});
                    }}
                  >
                    <option value="examen">Examen</option>
                    <option value="quiz">Quiz</option>
                    <option value="proyecto_largo">Proyecto Largo</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Fecha</label>
                  <input
                    type="date"
                    value={evalData.fecha}
                    onChange={(e) => setEvalData({...evalData, fecha: e.target.value})}
                    required
                  />
                </div>
                
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleAddEval(materia._id)}
                >
                  Agregar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Materias;
