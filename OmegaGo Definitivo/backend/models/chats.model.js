const db = require('../config/db');

// Obtener todos los chats de un usuario (últimos mensajes por contacto)
exports.obtenerChatsPorUsuario = (usuarioId, callback) => {
    const query = `
        SELECT 
            u.id AS contacto_id,
            u.nombre AS contacto_nombre,
            m.mensaje,
            m.fecha_envio
        FROM mensajes m
        JOIN (
            SELECT 
                LEAST(emisor_id, receptor_id) AS user1,
                GREATEST(emisor_id, receptor_id) AS user2,
                MAX(id) AS max_id
            FROM mensajes
            GROUP BY user1, user2
        ) sub ON (
            (LEAST(m.emisor_id, m.receptor_id) = sub.user1 AND 
             GREATEST(m.emisor_id, m.receptor_id) = sub.user2 AND 
             m.id = sub.max_id)
        )
        JOIN usuarios u ON u.id = 
            CASE 
                WHEN m.emisor_id = ? THEN m.receptor_id 
                ELSE m.emisor_id 
            END
        WHERE ? IN (m.emisor_id, m.receptor_id)
        ORDER BY m.fecha_envio DESC;
    `;

    db.query(query, [usuarioId, usuarioId], callback);
};

// Crear nuevo chat (entre dos usuarios)
exports.crearChat = async ({ usuario1_id, usuario2_id }) => {
    const sql = `
        INSERT INTO chats (usuario1_id, usuario2_id)
        VALUES (?, ?)
    `;
    const [result] = await db.query(sql, [usuario1_id, usuario2_id]);
    return result.insertId;
};

// Verificar si ya existe un chat entre dos usuarios
exports.existeChat = async (usuario1_id, usuario2_id) => {
    const sql = `
        SELECT * FROM chats 
        WHERE 
            (usuario1_id = ? AND usuario2_id = ?) OR 
            (usuario1_id = ? AND usuario2_id = ?)
    `;
    const [rows] = await db.query(sql, [usuario1_id, usuario2_id, usuario2_id, usuario1_id]);
    return rows[0] || null;
};

// Obtener todos los chats del usuario incluyendo nombres de ambos participantes
exports.obtenerChatsPorUsuario = async (usuario_id) => {
    const sql = `
        SELECT 
            c.*, 
            u1.nombre AS nombre_usuario1, 
            u2.nombre AS nombre_usuario2
        FROM chats c
        JOIN usuarios u1 ON u1.id = c.usuario1_id
        JOIN usuarios u2 ON u2.id = c.usuario2_id
        WHERE c.usuario1_id = ? OR c.usuario2_id = ?
        ORDER BY c.creado_en DESC
    `;
    const [rows] = await db.query(sql, [usuario_id, usuario_id]);
    return rows;
};

// Obtener chat por ID, incluyendo nombres de los usuarios
exports.obtenerPorId = async (id) => {
    const sql = `
        SELECT 
            c.*, 
            u1.nombre AS nombre_usuario1, 
            u2.nombre AS nombre_usuario2
        FROM chats c
        JOIN usuarios u1 ON c.usuario1_id = u1.id
        JOIN usuarios u2 ON c.usuario2_id = u2.id
        WHERE c.id = ?
    `;
    const [rows] = await db.query(sql, [id]);
    return rows[0] || null;
};
