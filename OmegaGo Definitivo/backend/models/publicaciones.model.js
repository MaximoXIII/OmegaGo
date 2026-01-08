const db = require('../config/db');

// Obtener todas las publicaciones
exports.obtenerTodas = async () => {
    const [rows] = await db.query(`
        SELECT p.*, u.nombre AS usuario_nombre
        FROM publicaciones p
        JOIN usuarios u ON p.usuario_id = u.id
        ORDER BY p.fecha_creacion DESC
    `);
    return rows;
};

// Obtener publicación por ID
exports.obtenerPorId = async (id) => {
    const [rows] = await db.query('SELECT * FROM publicaciones WHERE id = ?', [id]);
    return rows[0] || null;
};

// Crear nueva publicación
exports.crear = async ({ contenido, usuario_id }) => {
    const sql = `
    INSERT INTO publicaciones (contenido, usuario_id)
    VALUES (?, ?)
  `;
    const [result] = await db.query(sql, [contenido, usuario_id]);
    return result.insertId;
};

// Eliminar publicación
exports.eliminar = async (id) => {
    await db.query('DELETE FROM publicaciones WHERE id = ?', [id]);
};

// Obtener publicaciones de un usuario
exports.obtenerPorUsuario = async (usuario_id) => {
    const [rows] = await db.query('SELECT * FROM publicaciones WHERE usuario_id = ? ORDER BY fecha_creacion DESC', [usuario_id]);
    return rows;
};
