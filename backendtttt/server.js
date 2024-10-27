require('dotenv').config(); // Cargar variables de entorno desde .env

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
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
    origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json()); // Para procesar JSON en las solicitudes

// Rutas de API
app.use('/api/auth', authRoutes); // Rutas para autenticación
app.use('/api/reservas', verifyToken, reservaRoutes); // Rutas protegidas de reservas
app.use('/api/cam', camRoutes); // Rutas para mensajes de contacto

// Sirviendo el frontend en producción
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
    });
}

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error global:', err);
    if (err instanceof ValidationError) {
        return res.status(400).json({ message: 'Error de validación', errors: err.array() });
    }
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
