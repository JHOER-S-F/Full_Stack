const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const pool = require('../config/db');
const jwtConfig = require('../config/jwtConfig');

// Función para registrar un nuevo usuario
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, email, password } = req.body;

    try {
        const [existingUser] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: 'El correo ya está registrado' });
        }

        const hashedPassword = bcrypt.hashSync(password, 8);
        const [result] = await pool.query('INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)', [nombre, email, hashedPassword]);

        const token = jwt.sign({ id: result.insertId }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

        res.status(201).json({ auth: true, token });
    } catch (err) {
        console.error(err); // Agregar logs para depuración
        res.status(500).json({ message: 'Error en el servidor', error: 'No se pudo registrar el usuario' });
    }
};

// Función para iniciar sesión
exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body; // Cambiado 'correo' a 'email'

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

        const token = jwt.sign({ id: user.id }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
        res.status(200).json({ auth: true, token });
    } catch (err) {
        console.error(err); // Agregar logs para depuración
        res.status(500).json({ message: 'Error en el servidor', error: 'No se pudo iniciar sesión' });
    }
};
