const mongoose = require('mongoose');

const diaEspecialSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    required: true
  },
  tipo: {
    type: String,
    enum: ['ocio_total', 'trabajo_limitado', 'dia_negro'],
    required: true
  },
  reglas: {
    type: Object,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('DiaEspecial', diaEspecialSchema);
