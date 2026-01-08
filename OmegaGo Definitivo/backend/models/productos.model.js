const db = require('../config/db');

const productosModel = {
    // Obtener todos los productos con nombre de usuario
    obtenerTodos: async () => {
        const [rows] = await db.query(`
            SELECT p.*, u.nombre AS nombre_usuario
            FROM productos p
            JOIN usuarios u ON p.usuario_id = u.id
        `);
        return rows;
    },

    // Obtener producto por ID con nombre de usuario
    obtenerPorId: async (id) => {
        const [rows] = await db.query(`
            SELECT p.*, u.nombre AS nombre_usuario
            FROM productos p
            JOIN usuarios u ON p.usuario_id = u.id
            WHERE p.id = ?
        `, [id]);
        return rows[0] || null;
    },

    // Crear un nuevo producto
    crearProducto: async (datos) => {
        const { titulo, descripcion, precio, imagen, categoria, usuario_id } = datos;
        const sql = `
            INSERT INTO productos (titulo, descripcion, precio, imagen, categoria, usuario_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(sql, [titulo, descripcion, precio, imagen, categoria, usuario_id]);
        return result.insertId;
    },

    // Actualizar un producto existente
    actualizarProducto: async (id, datos) => {
        const { titulo, descripcion, precio, imagen, categoria } = datos;
        const sql = `
            UPDATE productos
            SET titulo = ?, descripcion = ?, precio = ?, imagen = ?, categoria = ?
            WHERE id = ?
        `;
        await db.query(sql, [titulo, descripcion, precio, imagen, categoria, id]);
    },

    // Eliminar producto por ID
    eliminarProducto: async (id) => {
        await db.query('DELETE FROM productos WHERE id = ?', [id]);
    },

    // Obtener productos de un usuario específico
    obtenerPorUsuario: async (usuarioId) => {
        const [rows] = await db.query('SELECT * FROM productos WHERE usuario_id = ?', [usuarioId]);
        return rows;
    }
};

module.exports = productosModel;

