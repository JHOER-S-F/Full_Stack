const mysql = require('mysql2/promise');
const pool = require('../config/db'); // Asumiendo que tienes una configuración de la base de datos en ../config/db

const Reserva = {};

// Crear una nueva reserva
Reserva.create = async (cancha_id, fecha, hora_inicio, hora_fin, nombre_cliente) => {
    try {
        const reserva = { cancha_id, fecha, hora_inicio, hora_fin, nombre_cliente };
        const [result] = await pool.query('INSERT INTO reservas SET ?', reserva);
        return result.insertId; // Retorna el ID de la nueva reserva
    } catch (error) {
        throw error;
    }
};

// Obtener todas las reservas
Reserva.getAll = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM reservas');
        return rows;
    } catch (error) {
        throw error;
    }
};

// Obtener reservas por cancha
Reserva.findByCanchaId = async (cancha_id) => {
    try {
        const [rows] = await pool.query('SELECT * FROM reservas WHERE cancha_id = ?', [cancha_id]);
        return rows;
    } catch (error) {
        throw error;
    }
};

// Verificar si hay conflicto de horarios en la reserva
Reserva.checkConflicts = async (cancha_id, fecha, hora_inicio, hora_fin) => {
    try {
        const [rows] = await pool.query(`
            SELECT * FROM reservas 
            WHERE cancha_id = ? 
            AND fecha = ? 
            AND ((hora_inicio BETWEEN ? AND ?) OR (hora_fin BETWEEN ? AND ?))
        `, [cancha_id, fecha, hora_inicio, hora_fin, hora_inicio, hora_fin]);
        return rows;
    } catch (error) {
        throw error;
    }
};

module.exports = Reserva;
