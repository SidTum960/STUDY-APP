const express = require('express');
const router = express.Router();
const materiaController = require('../controllers/materiaController');
const { writeLimiter } = require('../middleware/rateLimiter');

router.post('/', writeLimiter, materiaController.crearMateria);
router.get('/', materiaController.obtenerMaterias);
router.get('/:id', materiaController.obtenerMateria);
router.put('/:id', writeLimiter, materiaController.actualizarMateria);
router.delete('/:id', writeLimiter, materiaController.eliminarMateria);
router.post('/:id/evaluaciones', writeLimiter, materiaController.agregarEvaluacion);

module.exports = router;
