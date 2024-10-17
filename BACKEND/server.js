// server.js
require('dotenv').config(); // Cargar variables de entorno desde .env

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { validationResult, ValidationError } = require('express-validator');
const pool = require('./config/db');  // Importar configuración de la base de datos
const authRoutes = require('./routes/authRoutes'); // Rutas de autenticación
const reservaRoutes = require('./routes/reservaRoutes'); // Rutas para reservas
const camRoutes = require('./routes/camRoutes'); // Rutas para mensajes de contacto
const verifyToken = require('./middleware/verifyToken'); // Middleware para verificar token JWT

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:8080', // Cambia esto al origen de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json()); // Para poder procesar JSON en las solicitudes

// Rutas
app.use('/api/auth', authRoutes); // Rutas para autenticación
app.use('/api/reservas', verifyToken, reservaRoutes); // Rutas para reservas protegidas
app.use('/api/cam', camRoutes); // Rutas para mensajes de contacto

// Ruta protegida de ejemplo
app.get('/api/protected', verifyToken, async (req, res) => {
    try {
        const [results] = await pool.query('SELECT id, nombre, correo FROM usuarios WHERE id = ?', [req.userId]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = results[0];
        res.status(200).json({ user });
    } catch (err) {
        console.error('Error en la ruta protegida:', err); // Registro de error
        res.status(500).json({ message: 'Error en el servidor', error: err.message });
    }
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error global:', err); // Registro de error global
    if (err instanceof ValidationError) {
        return res.status(400).json({ message: 'Error de validación', errors: err.array() });
    }
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`); // Mensaje de inicio del servidor
});
