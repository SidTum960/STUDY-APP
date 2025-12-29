const HorarioDiario = require('../models/HorarioDiario');
const Materia = require('../models/Materia');
const DiaEspecial = require('../models/DiaEspecial');
const User = require('../models/User');
const { generarHorario } = require('../utils/scheduleGenerator');

// Generar horario para una fecha específica
exports.generarHorarioDiario = async (req, res) => {
  try {
    const fecha = new Date(req.params.fecha);
    fecha.setHours(0, 0, 0, 0);
    
    // Obtener datos necesarios
    const materias = await Materia.find();
    const diasEspeciales = await DiaEspecial.find();
    const usuario = await User.findOne() || { horas_sueno: 8 };
    
    // Generar el horario
    const horarioData = await generarHorario(fecha, materias, diasEspeciales, usuario);
    
    // Actualizar materias que tuvieron clase hoy
    const clasesHoy = horarioData.bloques.filter(b => b.tipo === 'clase');
    for (const clase of clasesHoy) {
      if (clase.materia) {
        await Materia.findByIdAndUpdate(clase.materia, {
          estado_clase: 'clase_vista',
          fecha_ultima_clase: fecha
        });
      }
    }
    
    // Guardar o actualizar el horario
    let horario = await HorarioDiario.findOne({ fecha });
    if (horario) {
      horario.bloques = horarioData.bloques;
      horario.resumen = horarioData.resumen;
      await horario.save();
    } else {
      horario = new HorarioDiario(horarioData);
      await horario.save();
    }
    
    res.status(201).json(horario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener horario de una fecha específica
exports.obtenerHorarioDiario = async (req, res) => {
  try {
    const fecha = new Date(req.params.fecha);
    fecha.setHours(0, 0, 0, 0);
    
    const horario = await HorarioDiario.findOne({ fecha }).populate('bloques.materia');
    
    if (!horario) {
      return res.status(404).json({ error: 'Horario no encontrado para esta fecha' });
    }
    
    res.json(horario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener horarios de un rango de fechas
exports.obtenerHorariosRango = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    
    const horarios = await HorarioDiario.find({
      fecha: {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin)
      }
    }).sort({ fecha: 1 });
    
    res.json(horarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
