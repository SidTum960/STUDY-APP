const User = require('../models/User');

// Crear o actualizar usuario
exports.configurarUsuario = async (req, res) => {
  try {
    let usuario = await User.findOne();
    
    if (usuario) {
      usuario.horas_sueno = req.body.horas_sueno || usuario.horas_sueno;
      usuario.configuracion_excepciones = req.body.configuracion_excepciones || usuario.configuracion_excepciones;
      await usuario.save();
    } else {
      usuario = new User(req.body);
      await usuario.save();
    }
    
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener configuración de usuario
exports.obtenerUsuario = async (req, res) => {
  try {
    const usuario = await User.findOne();
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no configurado' });
    }
    
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
