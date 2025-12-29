const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Demasiadas solicitudes desde esta IP, por favor intente de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiter for schedule generation (more expensive operation)
const scheduleGenerationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 schedule generations per windowMs
  message: 'Límite de generación de horarios alcanzado, por favor intente de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiter for write operations (POST, PUT, DELETE)
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 write operations per windowMs
  message: 'Límite de operaciones de escritura alcanzado, por favor intente de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  scheduleGenerationLimiter,
  writeLimiter
};
