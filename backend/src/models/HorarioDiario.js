const mongoose = require('mongoose');

const bloqueHorarioSchema = new mongoose.Schema({
  hora_inicio: {
    type: String,
    required: true
  },
  hora_fin: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['sueño', 'clase', 'hora_blanca', 'estudio_blanco', 'estudio_gris', 'libre', 'habito', 'negro'],
    required: true
  },
  materia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Materia'
  },
  materia_nombre: String,
  prioridad_asignada: Number,
  regla_aplicada: String
});

const horarioDiarioSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    required: true,
    unique: true
  },
  bloques: [bloqueHorarioSchema],
  resumen: {
    type: Object,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('HorarioDiario', horarioDiarioSchema);
