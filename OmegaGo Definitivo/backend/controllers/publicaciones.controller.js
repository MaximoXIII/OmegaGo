const publicacionesModel = require('../models/publicaciones.model');

// Crear publicación
exports.crearPublicacion = async (req, res) => {
    try {
        const { contenido } = req.body;
        const usuario_id = req.usuario.id;

        if (!contenido) {
            return res.status(400).json({ mensaje: 'El contenido es obligatorio.' });
        }

        const id = await publicacionesModel.crear({ contenido, usuario_id });
        res.status(201).json({ mensaje: 'Publicación creada correctamente.', id });
    } catch (error) {
        console.error('Error al crear publicación:', error);
        res.status(500).json({ mensaje: 'Error al crear la publicación.' });
    }
};

// Obtener todas las publicaciones
exports.obtenerTodas = async (req, res) => {
    try {
        const publicaciones = await publicacionesModel.obtenerTodas();
        res.status(200).json(publicaciones);
    } catch (error) {
        console.error('Error al obtener publicaciones:', error);
        res.status(500).json({ mensaje: 'Error al obtener las publicaciones.' });
    }
};

// Obtener publicación por ID
exports.obtenerPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const publicacion = await publicacionesModel.obtenerPorId(id);

        if (!publicacion) {
            return res.status(404).json({ mensaje: 'Publicación no encontrada.' });
        }

        res.status(200).json(publicacion);
    } catch (error) {
        console.error('Error al obtener publicación:', error);
        res.status(500).json({ mensaje: 'Error al obtener la publicación.' });
    }
};

// Eliminar publicación (solo dueño o admin)
exports.eliminarPublicacion = async (req, res) => {
    try {
        const { id } = req.params;
        const publicacion = await publicacionesModel.obtenerPorId(id);

        if (!publicacion) {
            return res.status(404).json({ mensaje: 'Publicación no encontrada.' });
        }

        if (publicacion.usuario_id !== req.usuario.id && req.usuario.rol !== 'admin') {
            return res.status(403).json({ mensaje: 'No autorizado para eliminar esta publicación.' });
        }

        await publicacionesModel.eliminar(id);
        res.status(200).json({ mensaje: 'Publicación eliminada correctamente.' });
    } catch (error) {
        console.error('Error al eliminar publicación:', error);
        res.status(500).json({ mensaje: 'Error al eliminar la publicación.' });
    }
};

// Obtener publicaciones del usuario logueado
exports.obtenerMisPublicaciones = async (req, res) => {
    try {
        const usuario_id = req.usuario.id;
        const publicaciones = await publicacionesModel.obtenerPorUsuario(usuario_id);
        res.status(200).json(publicaciones);
    } catch (error) {
        console.error('Error al obtener publicaciones del usuario:', error);
        res.status(500).json({ mensaje: 'Error al obtener tus publicaciones.' });
    }
};

