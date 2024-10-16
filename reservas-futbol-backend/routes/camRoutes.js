// camRoutes.js
const express = require('express');
const router = express.Router();
const { sendContactMessage } = require('../controllers/camController'); // Asegúrate de que la ruta es correcta

// Ruta para el envío de mensajes de contacto
router.post('/contact', sendContactMessage); // Aquí utilizamos la función directamente

module.exports = router;
