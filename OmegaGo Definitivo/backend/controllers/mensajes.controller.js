const mensajesModel = require('../models/mensajes.model');

// Enviar mensaje
exports.enviarMensaje = async (req, res) => {
    try {
        const emisor_id = req.usuario.id;
        const { receptor_id, mensaje } = req.body;

        if (!receptor_id || !mensaje) {
            return res.status(400).json({ mensaje: 'Faltan datos obligatorios.' });
        }

        const id = await mensajesModel.enviar({ emisor_id, receptor_id, mensaje });
        res.status(201).json({ mensaje: 'Mensaje enviado correctamente.', id });
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        res.status(500).json({ mensaje: 'Error al enviar mensaje.' });
    }
};

// Obtener conversación entre dos usuarios
exports.obtenerConversacion = async (req, res) => {
    try {
        const usuario1_id = req.usuario.id;
        const { receptor_id } = req.params;

        const mensajes = await mensajesModel.obtenerConversacion(usuario1_id, receptor_id);
        res.status(200).json(mensajes);
    } catch (error) {
        console.error('Error al obtener conversación:', error);
        res.status(500).json({ mensaje: 'Error al obtener la conversación.' });
    }
};

exports.crearMensaje = async (req, res) => {
    const { mensaje, emisor_id, receptor_id } = req.body;

    if (!mensaje || !emisor_id || !receptor_id) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    try {
        await mensajesModel.crear({ mensaje, emisor_id, receptor_id });
        res.status(201).json({ mensaje: "Mensaje enviado correctamente" });
    } catch (error) {
        console.error("Error al enviar mensaje:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};
