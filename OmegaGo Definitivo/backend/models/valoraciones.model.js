const db = require("../config/db");

const valoracionesModel = {
    insertar: async ({ comentario, producto_id, puntuacion, usuario_id }) => {
        const [existente] = await db.query(
            "SELECT id FROM valoraciones WHERE producto_id = ? AND usuario_id = ?",
            [producto_id, usuario_id]
        );
        if (existente.length > 0) {
            throw new Error("Ya has valorado este producto");
        }

        const [result] = await db.query(
            `INSERT INTO valoraciones (comentario, producto_id, puntuacion, usuario_id)
       VALUES (?, ?, ?, ?)`,
            [comentario, producto_id, puntuacion, usuario_id]
        );
        return result.insertId;
    },

    obtenerPorProducto: async (productoId) => {
        const [rows] = await db.query(
            `SELECT v.*, u.nombre AS nombre_usuario
       FROM valoraciones v
       JOIN usuarios u ON v.usuario_id = u.id
       WHERE v.producto_id = ?
       ORDER BY v.fecha_valoracion DESC`,
            [productoId]
        );
        return rows;
    },

    obtenerPorProductoYUsuario: async (productoId, usuarioId) => {
        const [rows] = await db.query(
            `SELECT v.*, u.nombre AS nombre_usuario
       FROM valoraciones v
       JOIN usuarios u ON v.usuario_id = u.id
       WHERE v.producto_id = ? AND v.usuario_id = ?`,
            [productoId, usuarioId]
        );
        return rows.length > 0 ? rows[0] : null;
    },

    obtenerPorId: async (id) => {
        const [rows] = await db.query("SELECT * FROM valoraciones WHERE id = ?", [id]);
        return rows[0];
    },

    eliminar: async (id) => {
        await db.query("DELETE FROM valoraciones WHERE id = ?", [id]);
    },
};


valoracionesModel.existeValoracion = async (productoId, usuarioId) => {
    const [rows] = await db.query(
        `SELECT * FROM valoraciones WHERE producto_id = ? AND usuario_id = ?`,
        [productoId, usuarioId]
    );
    return rows[0] || null;
};

module.exports = valoracionesModel;
