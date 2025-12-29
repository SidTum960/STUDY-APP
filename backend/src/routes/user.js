const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { writeLimiter } = require('../middleware/rateLimiter');

router.post('/', writeLimiter, userController.configurarUsuario);
router.get('/', userController.obtenerUsuario);

module.exports = router;
