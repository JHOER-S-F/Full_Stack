const express = require('express');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// Ejemplo de ruta protegida
router.get('/reservas', verifyToken, async (req, res) => {
    try {
        // Lógica para obtener reservas
        res.status(200).json({ message: 'Reservas obtenidas' });
    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor', error: err.message });
    }
});

// Otras rutas para manejar reservas

module.exports = router;
