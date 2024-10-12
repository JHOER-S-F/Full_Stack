const pool = require('../config/db');  // Conexión a la base de datos

// Obtener todas las canchas
exports.getCanchas = async (req, res) => {
    const clienteId = req.query.cliente_id; // Obtener el ID del cliente de los parámetros de consulta

    let query = 'SELECT * FROM canchas';
    let params = [];

    // Si se proporciona un cliente, filtrar canchas por cliente
    if (clienteId) {
        query += ' WHERE cliente_id = ?';
        params.push(clienteId);
    }

    try {
        const [results] = await pool.query('SELECT * FROM canchas');
        res.json(results);
    } catch (err) {
        console.error('Error al obtener las canchas:', err); // Log de error
        res.status(500).json({ message: 'Error al obtener las canchas', error: err.message });
    }
};

// Obtener todos los clientes
exports.getClientes = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM clientes');
        res.json(results);
    } catch (err) {
        console.error('Error al obtener los clientes:', err); // Log de error
        res.status(500).json({ message: 'Error al obtener los clientes', error: err.message });
    }
};

// Realizar una reserva
exports.makeReserva = async (req, res) => {
    const { cancha_id, fecha, hora_inicio, hora_fin, nombre_cliente } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!cancha_id || !fecha || !hora_inicio || !hora_fin || !nombre_cliente) {
        return res.status(400).json({ message: 'Todos los campos son requeridos para la reserva' });
    }

    const reserva = { cancha_id, fecha, hora_inicio, hora_fin, nombre_cliente };

    try {
        // Verificar si la cancha ya está reservada en la fecha y horario
        const [existingReservations] = await pool.query(
            'SELECT * FROM reservas WHERE cancha_id = ? AND fecha = ? AND ((hora_inicio <= ? AND hora_fin > ?) OR (hora_inicio < ? AND hora_fin >= ?))',
            [cancha_id, fecha, hora_fin, hora_inicio, hora_fin, hora_inicio]
        );

        if (existingReservations.length > 0) {
            return res.status(409).json({ message: 'La cancha ya está reservada en este horario.' });
        }

        // Si no hay conflictos, realizar la reserva
        const [results] = await pool.query('INSERT INTO reservas SET ?', reserva);
        res.status(201).json({ id: results.insertId, ...reserva });
    } catch (err) {
        console.error('Error al reservar la cancha:', err); // Log de error
        res.status(500).json({ message: 'Error al reservar la cancha', error: err.message });
    }
};

