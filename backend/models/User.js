const mysql = require('mysql2/promise');
const pool = require('../config/db'); // Asumiendo que tienes una configuración de la base de datos en ../config/db
const bcrypt = require('bcryptjs');

const User = {};

// Crear un nuevo usuario
User.create = async (nombre, correo, password) => {
    try {
        const hashedPassword = bcrypt.hashSync(password, 8); // Hash de la contraseña
        const [result] = await pool.query('INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)', [nombre, correo, hashedPassword]);
        return result.insertId; // Retorna el ID del nuevo usuario
    } catch (error) {
        throw error;
    }
};

// Obtener todos los usuarios
User.getAll = async () => {
    try {
        const [rows] = await pool.query('SELECT id, nombre, correo FROM usuarios');
        return rows;
    } catch (error) {
        throw error;
    }
};

// Obtener un usuario por correo
User.findByEmail = async (correo) => {
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        return rows[0]; // Retorna el primer usuario encontrado
    } catch (error) {
        throw error;
    }
};

// Obtener un usuario por ID
User.findById = async (id) => {
    try {
        const [rows] = await pool.query('SELECT id, nombre, correo FROM usuarios WHERE id = ?', [id]);
        return rows[0]; // Retorna el usuario encontrado
    } catch (error) {
        throw error;
    }
};

// Actualizar un usuario
User.update = async (id, nombre, correo, password) => {
    try {
        const hashedPassword = bcrypt.hashSync(password, 8);
        await pool.query('UPDATE usuarios SET nombre = ?, correo = ?, password = ? WHERE id = ?', [nombre, correo, hashedPassword, id]);
        return id; // Retorna el ID del usuario actualizado
    } catch (error) {
        throw error;
    }
};

// Eliminar un usuario
User.delete = async (id) => {
    try {
        await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
        return id; // Retorna el ID del usuario eliminado
    } catch (error) {
        throw error;
    }
};

module.exports = User;
