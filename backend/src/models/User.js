const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  horas_sueno: {
    type: Number,
    required: true,
    default: 8
  },
  configuracion_excepciones: {
    type: Object,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
