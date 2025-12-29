const express = require('express');
const router = express.Router();
const diaEspecialController = require('../controllers/diaEspecialController');

router.post('/', diaEspecialController.crearDiaEspecial);
router.get('/', diaEspecialController.obtenerDiasEspeciales);
router.get('/:id', diaEspecialController.obtenerDiaEspecial);
router.put('/:id', diaEspecialController.actualizarDiaEspecial);
router.delete('/:id', diaEspecialController.eliminarDiaEspecial);

module.exports = router;
