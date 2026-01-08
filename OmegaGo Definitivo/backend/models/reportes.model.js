const db = require('../config/db');

// Crear un nuevo reporte
exports.crear = async ({ motivo, producto_id, usuario_id, usuario_reportado_id }) => {
    const sql = `
        INSERT INTO reportes (motivo, producto_id, usuario_id, usuario_reportado_id)
        VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [motivo, producto_id, usuario_id, usuario_reportado_id]);
    return result.insertId;
};

// Obtener todos los reportes (ordenados por fecha)
exports.obtenerTodos = async () => {
    const [rows] = await db.query(
        `SELECT r.*, u1.nombre AS nombre_reportador, u2.nombre AS nombre_reportado, p.titulo AS producto
         FROM reportes r
         LEFT JOIN usuarios u1 ON r.usuario_id = u1.id
         LEFT JOIN usuarios u2 ON r.usuario_reportado_id = u2.id
         LEFT JOIN productos p ON r.producto_id = p.id
         ORDER BY r.fecha_reporte DESC`
    );
    return rows;
};

// Eliminar reporte por ID
exports.eliminar = async (id) => {
    await db.query('DELETE FROM reportes WHERE id = ?', [id]);
};

// Obtener reportes por usuario reportado (para vista del usuario admin, por ejemplo)
exports.obtenerPorUsuarioReportado = async (usuario_reportado_id) => {
    const [rows] = await db.query('SELECT * FROM reportes WHERE usuario_reportado_id = ?', [usuario_reportado_id]);
    return rows;
};
