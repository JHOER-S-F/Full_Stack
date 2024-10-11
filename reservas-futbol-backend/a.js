require('dotenv').config(); // Cargar las variables de entorno desde .env

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares

app.use(cors({
    origin: 'http://localhost:8080', // Cambia esto al origen de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(bodyParser.json());

// Conexión a la base de datos (usando un pool de conexiones)
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'reservas_futbol',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Clave secreta para JWT
const jwtSecret = process.env.JWT_SECRET || 'tu_secreto_para_jwt';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Token requerido' });

    jwt.verify(token.replace('Bearer ', ''), jwtSecret, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token inválido o expirado' });
        req.userId = decoded.id;
        next();
    });
};

// Rutas

// Obtener todas las canchas
app.get('/canchas', async (req, res) => {
    const clienteId = req.query.cliente_id; // Obtener el cliente_id de la consulta
    try {
        let query = 'SELECT * FROM canchas';
        const params = [];

        if (clienteId) {
            query += ' WHERE cliente_id = ?'; // Filtrar las canchas por cliente_id
            params.push(clienteId);
        }

        const [results] = await pool.query(query, params);
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener las canchas', error: err.message });
    }
});

// Obtener todos los clientes
app.get('/clientes', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM clientes');
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los clientes', error: err.message });
    }
});

// Reservar cancha
app.post('/reservas', async (req, res) => {
    const { cancha_id, fecha, hora_inicio, hora_fin, nombre_cliente } = req.body;

    // Validar la reserva
    if (!cancha_id || !fecha || !hora_inicio || !hora_fin || !nombre_cliente) {
        return res.status(400).json({ message: 'Todos los campos son requeridos para la reserva' });
    }

    const reserva = { cancha_id, fecha, hora_inicio, hora_fin, nombre_cliente };

    try {
        const [results] = await pool.query('INSERT INTO reservas SET ?', reserva);
        res.status(201).json({ id: results.insertId, ...reserva });
    } catch (err) {
        res.status(500).json({ message: 'Error al reservar la cancha', error: err.message });
    }
});

// Ruta de inicio de sesión
app.post('/api/login',
    body('email').isEmail().withMessage('Correo inválido'),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const [results] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [email]);
            if (results.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const user = results[0];
            const passwordIsValid = bcrypt.compareSync(password, user.password);
            if (!passwordIsValid) {
                return res.status(401).json({ auth: false, token: null, message: 'Contraseña incorrecta' });
            }

            const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: jwtExpiresIn });
            res.status(200).json({ auth: true, token });
        } catch (err) {
            res.status(500).json({ message: 'Error en el servidor', error: err.message });
        }
    }
);

// Ruta protegida
app.get('/api/protected', verifyToken, async (req, res) => {
    try {
        const [results] = await pool.query('SELECT id, nombre, correo FROM usuarios WHERE id = ?', [req.userId]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = results[0];
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor', error: err.message });
    }
});

// Ruta de registro de usuarios
app.post('/api/register',
    body('correo').isEmail().withMessage('Correo inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('nombre').notEmpty().withMessage('El nombre es requerido'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { correo, password, nombre } = req.body;

        try {
            const [existingUser] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
            if (existingUser.length > 0) {
                return res.status(409).json({ message: 'El correo ya está registrado' });
            }

            const hashedPassword = bcrypt.hashSync(password, 8);
            const [result] = await pool.query('INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)', [nombre, correo, hashedPassword]);

            const token = jwt.sign({ id: result.insertId }, jwtSecret, { expiresIn: jwtExpiresIn });

            res.status(201).json({ auth: true, token });
        } catch (err) {
            res.status(500).json({ message: 'Error en el servidor', error: err.message });
        }
    }
);

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error global:', err);
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
