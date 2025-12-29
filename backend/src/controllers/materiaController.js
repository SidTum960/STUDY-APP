const Materia = require('../models/Materia');

// Crear una nueva materia
exports.crearMateria = async (req, res) => {
  try {
    const materia = new Materia(req.body);
    await materia.save();
    res.status(201).json(materia);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todas las materias
exports.obtenerMaterias = async (req, res) => {
  try {
    const materias = await Materia.find();
    res.json(materias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una materia por ID
exports.obtenerMateria = async (req, res) => {
  try {
    const materia = await Materia.findById(req.params.id);
    if (!materia) {
      return res.status(404).json({ error: 'Materia no encontrada' });
    }
    res.json(materia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una materia
exports.actualizarMateria = async (req, res) => {
  try {
    const materia = await Materia.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!materia) {
      return res.status(404).json({ error: 'Materia no encontrada' });
    }
    res.json(materia);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar una materia
exports.eliminarMateria = async (req, res) => {
  try {
    const materia = await Materia.findByIdAndDelete(req.params.id);
    if (!materia) {
      return res.status(404).json({ error: 'Materia no encontrada' });
    }
    res.json({ mensaje: 'Materia eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Agregar evaluación a una materia
exports.agregarEvaluacion = async (req, res) => {
  try {
    const materia = await Materia.findById(req.params.id);
    if (!materia) {
      return res.status(404).json({ error: 'Materia no encontrada' });
    }
    
    materia.evaluaciones.push(req.body);
    await materia.save();
    res.status(201).json(materia);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
