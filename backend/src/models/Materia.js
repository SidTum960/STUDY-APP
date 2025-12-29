const mongoose = require('mongoose');

const evaluacionSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['examen', 'quiz', 'proyecto_largo'],
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  activa: {
    type: Boolean,
    default: true
  },
  multiplicador: {
    type: Number,
    required: true
  }
});

const horarioClaseSchema = new mongoose.Schema({
  dia_semana: {
    type: Number, // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    required: true,
    min: 0,
    max: 6
  },
  hora_inicio: {
    type: String, // Formato "HH:MM"
    required: true,
    validate: {
      validator: function(v) {
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: props => `${props.value} no es un formato de hora válido (HH:MM)!`
    }
  },
  hora_fin: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: props => `${props.value} no es un formato de hora válido (HH:MM)!`
    }
  }
});

const materiaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  creditos: {
    type: Number,
    required: true
  },
  dificultad_percibida: {
    type: Number,
    min: 0,
    max: 3,
    required: true
  },
  estado_clase: {
    type: String,
    enum: ['clase_pendiente', 'clase_vista'],
    default: 'clase_pendiente'
  },
  fecha_ultima_clase: {
    type: Date
  },
  horarios_clase: [horarioClaseSchema],
  evaluaciones: [evaluacionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Materia', materiaSchema);
