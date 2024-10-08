const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'reservas_futbol'
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado a la base de datos');
});

// Secret key para JWT
const jwtSecret = 'tu_secreto_para_jwt';

// Middleware para verificar token JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).send('No se proporcionó un token.');

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) return res.status(500).send('Error al autenticar el token.');
        req.userId = decoded.id;
        next();
    });
};

// Rutas

// Obtener todas las canchas
app.get('/canchas', (req, res) => {
    const clienteId = req.query.cliente_id;

    let query = 'SELECT * FROM canchas';
    if (clienteId) {
        query += ' WHERE cliente_id = ?';
    }

    db.query(query, [clienteId], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Obtener todos los clientes
app.get('/clientes', (req, res) => {
    db.query('SELECT * FROM clientes', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Reservar cancha
app.post('/reservas', (req, res) => {
    const { cancha_id, fecha, hora_inicio, hora_fin, nombre_cliente } = req.body;
    const reserva = { cancha_id, fecha, hora_inicio, hora_fin, nombre_cliente };
    db.query('INSERT INTO reservas SET ?', reserva, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ id: results.insertId, ...reserva });
    });
});

// Registro de usuarios (Ruta pública)
app.post('/api/register', (req, res) => {
    const { nombre, correo, password } = req.body;

    db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], (err, results) => {
        if (err) return res.status(500).send('Error en el servidor.');
        if (results.length > 0) return res.status(400).send('El correo ya está registrado.');

        const hashedPassword = bcrypt.hashSync(password, 8);

        const newUser = { nombre, correo, password: hashedPassword };
        db.query('INSERT INTO usuarios SET ?', newUser, (err, result) => {
            if (err) return res.status(500).send('Error al registrar el usuario.');
            res.status(200).send({ message: 'Usuario registrado correctamente' });
        });
    });
});

// Inicio de sesión (Ruta pública)
app.post('/api/login', (req, res) => {
    const { correo, password } = req.body;

    db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], (err, results) => {
        if (err) return res.status(500).send('Error en el servidor.');
        if (results.length === 0) return res.status(404).send('Usuario no encontrado.');

        const user = results[0];

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).send('Contraseña incorrecta.');

        const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });

        res.status(200).send({ auth: true, token });
    });
});

function authMiddleware(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Token requerido' });
  
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Token inválido' });
  
      req.user = decoded;
      next();
    });
  }
  

// Escuchar en el puerto especificado
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
