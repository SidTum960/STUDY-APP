const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horarioController');
const { scheduleGenerationLimiter } = require('../middleware/rateLimiter');

router.post('/generar-horario/:fecha', scheduleGenerationLimiter, horarioController.generarHorarioDiario);
router.get('/horario/:fecha', horarioController.obtenerHorarioDiario);
router.get('/horarios', horarioController.obtenerHorariosRango);

module.exports = router;
