const express = require('express');
const router = express.Router();
const diaEspecialController = require('../controllers/diaEspecialController');
const { writeLimiter } = require('../middleware/rateLimiter');

router.post('/', writeLimiter, diaEspecialController.crearDiaEspecial);
router.get('/', diaEspecialController.obtenerDiasEspeciales);
router.get('/:id', diaEspecialController.obtenerDiaEspecial);
router.put('/:id', writeLimiter, diaEspecialController.actualizarDiaEspecial);
router.delete('/:id', writeLimiter, diaEspecialController.eliminarDiaEspecial);

module.exports = router;
