// models/usuarios.model.js

const db = require('../config/db');

// Obtener un usuario por ID
exports.obtenerPorId = async (id) => {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    return rows[0] || null;
};

//Obtener un usuario por email

exports.obtenerPorEmail = async (email) => {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows[0] || null;
};

// Verificar si un DNI o NIE ya existe

exports.obtenerPorDNI = async (dni) => {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE dni = ?', [dni]);
    return rows[0] || null;
};

// Insertar un nuevo usuario
 
exports.insertar = async (nombre, email, password, dni, fecha_nacimiento) => {
    const sql = 'INSERT INTO usuarios (nombre, email, password, dni, fecha_nacimiento) VALUES (?, ?, ?, ?, ?)';
    const [result] = await db.query(sql, [nombre, email, password, dni, fecha_nacimiento]);
    return result.insertId;
};

// Actualizar datos de un usuario
 
exports.actualizar = async (id, datos) => {
    const { nombre, email, fecha_nacimiento } = datos;
    const sql = 'UPDATE usuarios SET nombre = ?, email = ?, fecha_nacimiento = ? WHERE id = ?';
    await db.query(sql, [nombre, email, fecha_nacimiento, id]);
};

// Eliminar un usuario
 
exports.eliminar = async (id) => {
    await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
};


