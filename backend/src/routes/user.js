const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.configurarUsuario);
router.get('/', userController.obtenerUsuario);

module.exports = router;
