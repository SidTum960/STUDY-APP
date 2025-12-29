const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horarioController');

router.post('/generar-horario/:fecha', horarioController.generarHorarioDiario);
router.get('/horario/:fecha', horarioController.obtenerHorarioDiario);
router.get('/horarios', horarioController.obtenerHorariosRango);

module.exports = router;
