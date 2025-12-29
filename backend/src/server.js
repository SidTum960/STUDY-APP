require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const { apiLimiter } = require('./middleware/rateLimiter');

// Importar rutas
const materiasRoutes = require('./routes/materias');
const diasEspecialesRoutes = require('./routes/dias-especiales');
const horariosRoutes = require('./routes/horarios');
const userRoutes = require('./routes/user');

// Conectar a la base de datos
connectDB();

// Inicializar Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Rutas
app.use('/api/materias', materiasRoutes);
app.use('/api/dias-especiales', diasEspecialesRoutes);
app.use('/api', horariosRoutes);
app.use('/api/user', userRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Planificador Académico API funcionando' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

// Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;
