// backend/models/Cliente.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Asegúrate de que esta ruta sea correcta

const Cliente = sequelize.define('Cliente', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Cada correo debe ser único
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: 'clientes', // Nombre de la tabla en la base de datos
    timestamps: true, // Agrega las columnas createdAt y updatedAt
});

// Exportar el modelo para utilizarlo en otras partes de la aplicación
module.exports = Cliente;
