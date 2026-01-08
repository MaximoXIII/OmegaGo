const db = require('../config/db');

// Enviar mensaje
exports.enviar = async ({ emisor_id, receptor_id, mensaje }) => {
    const sql = `
        INSERT INTO mensajes (emisor_id, receptor_id, mensaje)
        VALUES (?, ?, ?)
    `;
    const [result] = await db.query(sql, [emisor_id, receptor_id, mensaje]);
    return result.insertId;
};

// Obtener conversación entre dos usuarios
exports.obtenerConversacion = async (usuario1_id, usuario2_id) => {
    const sql = `
        SELECT * FROM mensajes
        WHERE (emisor_id = ? AND receptor_id = ?)
           OR (emisor_id = ? AND receptor_id = ?)
        ORDER BY fecha_envio ASC
    `;
    const [rows] = await db.query(sql, [usuario1_id, usuario2_id, usuario2_id, usuario1_id]);
    return rows;
};

exports.crear = async ({ mensaje, emisor_id, receptor_id }) => {
    const sql = "INSERT INTO mensajes (mensaje, emisor_id, receptor_id) VALUES (?, ?, ?)";
    await db.query(sql, [mensaje, emisor_id, receptor_id]);
};
