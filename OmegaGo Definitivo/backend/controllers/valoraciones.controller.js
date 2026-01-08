const valoracionesModel = require('../models/valoraciones.model');

// Crear una nueva valoración
exports.crearValoracion = async (req, res) => {
    try {
        const { producto_id, puntuacion, comentario } = req.body;
        const usuario_id = req.usuario.id; // Extraído del token

        if (!producto_id || !puntuacion) {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' });
        }

        const nuevaValoracion = {
            producto_id,
            puntuacion,
            comentario,
            usuario_id
        };

        const idInsertado = await valoracionesModel.insertar(nuevaValoracion);
        res.status(201).json({ mensaje: 'Valoración creada correctamente.', id: idInsertado });
    } catch (error) {
        console.error('Error al crear valoración:', error);
        res.status(400).json({ mensaje: error.message });

    }
};

// Obtener valoraciones de un producto
exports.obtenerPorProducto = async (req, res) => {
    try {
        const { productoId } = req.params;
        const valoraciones = await valoracionesModel.obtenerPorProducto(productoId);
        res.status(200).json(valoraciones);
    } catch (error) {
        console.error('Error al obtener valoraciones:', error);
        res.status(500).json({ mensaje: 'Error al obtener las valoraciones.' });
    }
};

exports.verificarValoracion = async (req, res) => {
    const { productoId, usuarioId } = req.params;

    try {
        const valoracion = await valoracionesModel.existeValoracion(productoId, usuarioId);
        if (valoracion) {
            res.json(valoracion); // Devuelve la valoración existente
        } else {
            res.json(null); // No hay valoración aún
        }
    } catch (error) {
        console.error("Error al verificar valoración:", error);
        res.status(500).json({ mensaje: "Error al verificar valoración" });
    }
};


// Eliminar valoración (solo usuario o admin)
exports.eliminarValoracion = async (req, res) => {
    try {
        const { id } = req.params;
        const valoracion = await valoracionesModel.obtenerPorId(id);

        if (!valoracion) {
            return res.status(404).json({ mensaje: 'Valoración no encontrada.' });
        }

        if (valoracion.usuario_id !== req.usuario.id && req.usuario.rol !== 'admin') {
            return res.status(403).json({ mensaje: 'No autorizado para eliminar esta valoración.' });
        }

        await valoracionesModel.eliminar(id);
        res.status(200).json({ mensaje: 'Valoración eliminada correctamente.' });
    } catch (error) {
        console.error('Error al eliminar valoración:', error);
        res.status(500).json({ mensaje: 'Error al eliminar la valoración.' });
    }
};