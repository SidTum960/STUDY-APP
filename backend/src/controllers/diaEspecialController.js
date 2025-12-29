const DiaEspecial = require('../models/DiaEspecial');

// Crear un día especial
exports.crearDiaEspecial = async (req, res) => {
  try {
    const diaEspecial = new DiaEspecial(req.body);
    await diaEspecial.save();
    res.status(201).json(diaEspecial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los días especiales
exports.obtenerDiasEspeciales = async (req, res) => {
  try {
    const diasEspeciales = await DiaEspecial.find();
    res.json(diasEspeciales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un día especial por ID
exports.obtenerDiaEspecial = async (req, res) => {
  try {
    const diaEspecial = await DiaEspecial.findById(req.params.id);
    if (!diaEspecial) {
      return res.status(404).json({ error: 'Día especial no encontrado' });
    }
    res.json(diaEspecial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un día especial
exports.actualizarDiaEspecial = async (req, res) => {
  try {
    const diaEspecial = await DiaEspecial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!diaEspecial) {
      return res.status(404).json({ error: 'Día especial no encontrado' });
    }
    res.json(diaEspecial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un día especial
exports.eliminarDiaEspecial = async (req, res) => {
  try {
    const diaEspecial = await DiaEspecial.findByIdAndDelete(req.params.id);
    if (!diaEspecial) {
      return res.status(404).json({ error: 'Día especial no encontrado' });
    }
    res.json({ mensaje: 'Día especial eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
