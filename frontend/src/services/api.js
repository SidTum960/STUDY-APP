import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Materias
export const getMaterias = () => api.get('/materias');
export const getMateria = (id) => api.get(`/materias/${id}`);
export const createMateria = (data) => api.post('/materias', data);
export const updateMateria = (id, data) => api.put(`/materias/${id}`, data);
export const deleteMateria = (id) => api.delete(`/materias/${id}`);
export const addEvaluacion = (id, data) => api.post(`/materias/${id}/evaluaciones`, data);

// Días especiales
export const getDiasEspeciales = () => api.get('/dias-especiales');
export const createDiaEspecial = (data) => api.post('/dias-especiales', data);
export const deleteDiaEspecial = (id) => api.delete(`/dias-especiales/${id}`);

// Horarios
export const generarHorario = (fecha) => api.post(`/generar-horario/${encodeURIComponent(fecha)}`);
export const getHorario = (fecha) => api.get(`/horario/${encodeURIComponent(fecha)}`);
export const getHorariosRango = (fechaInicio, fechaFin) => 
  api.get(`/horarios?fechaInicio=${encodeURIComponent(fechaInicio)}&fechaFin=${encodeURIComponent(fechaFin)}`);

// Usuario
export const getUsuario = () => api.get('/user');
export const updateUsuario = (data) => api.post('/user', data);

export default api;
