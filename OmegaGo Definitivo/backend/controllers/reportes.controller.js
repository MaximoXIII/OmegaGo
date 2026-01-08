const reportesModel = require('../models/reportes.model');
const db = require('../config/db');

// Crear un nuevo reporte
exports.crearReporte = async (req, res) => {
    try {
        const { motivo, producto_id, chat_id, usuario_reportado_id } = req.body;
        const usuario_id = req.usuario.id;

        let usuarioReportadoIdFinal = usuario_reportado_id;

        // Si viene chat_id, obtener el usuario_reportado desde la tabla de chats
        if (chat_id && !usuarioReportadoIdFinal) {
            const [chatResult] = await db.query('SELECT * FROM chats WHERE id = ?', [chat_id]);
            if (!chatResult.length) return res.status(404).json({ mensaje: 'Chat no encontrado.' });

            const chat = chatResult[0];
            usuarioReportadoIdFinal = chat.usuario1_id === usuario_id ? chat.usuario2_id : chat.usuario1_id;
        }

        // Si viene producto_id pero NO viene usuario_reportado_id, búscalo
        if (producto_id && !usuarioReportadoIdFinal) {
            const [productoResult] = await db.query('SELECT usuario_id FROM productos WHERE id = ?', [producto_id]);
            if (!productoResult.length) return res.status(404).json({ mensaje: 'Producto no encontrado.' });

            usuarioReportadoIdFinal = productoResult[0].usuario_id;
        }

        if (!motivo || !usuarioReportadoIdFinal) {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' });
        }

        const id = await reportesModel.crear({
            motivo,
            producto_id: producto_id || null,
            chat_id: chat_id || null,
            usuario_id,
            usuario_reportado_id: usuarioReportadoIdFinal,
        });

        res.status(201).json({ mensaje: 'Reporte creado correctamente.', id });
    } catch (error) {
        console.error('Error al crear reporte:', error);
        res.status(500).json({ mensaje: 'Error al crear el reporte.' });
    }
};

// Obtener todos los reportes (solo admin)
exports.obtenerTodos = async (req, res) => {
    try {
        if (req.usuario.rol !== 'admin') {
            return res.status(403).json({ mensaje: 'Acceso no autorizado.' });
        }

        const reportes = await reportesModel.obtenerTodos();
        res.status(200).json(reportes);
    } catch (error) {
        console.error('Error al obtener reportes:', error);
        res.status(500).json({ mensaje: 'Error al obtener los reportes.' });
    }
};

// Eliminar un reporte (admin)
exports.eliminarReporte = async (req, res) => {
    try {
        if (req.usuario.rol !== 'admin') {
            return res.status(403).json({ mensaje: 'Acceso no autorizado.' });
        }

        const { id } = req.params;
        await reportesModel.eliminar(id);
        res.status(200).json({ mensaje: 'Reporte eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar reporte:', error);
        res.status(500).json({ mensaje: 'Error al eliminar el reporte.' });
    }
};

// Obtener reportes hacia un usuario específico (admin o el mismo usuario)
exports.obtenerPorUsuario = async (req, res) => {
    try {
        const { usuario_id } = req.params;

        if (req.usuario.rol !== 'admin' && parseInt(usuario_id) !== req.usuario.id) {
            return res.status(403).json({ mensaje: 'No tienes permiso para ver estos reportes.' });
        }

        const reportes = await reportesModel.obtenerPorUsuario(usuario_id);
        res.status(200).json(reportes);
    } catch (error) {
        console.error('Error al obtener reportes del usuario:', error);
        res.status(500).json({ mensaje: 'Error al obtener los reportes.' });
    }
};

// Obtener reportes hacia un usuario reportado (solo admin)
exports.obtenerPorUsuarioReportado = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.usuario.rol !== 'admin') {
            return res.status(403).json({ mensaje: 'No autorizado.' });
        }

        const reportes = await reportesModel.obtenerPorUsuarioReportado(id);
        res.status(200).json(reportes);
    } catch (error) {
        console.error('Error al obtener reportes por usuario reportado:', error);
        res.status(500).json({ mensaje: 'Error interno al obtener reportes.' });
    }
};

