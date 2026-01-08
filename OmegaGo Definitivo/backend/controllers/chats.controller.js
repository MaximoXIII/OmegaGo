const chatsModel = require('../models/chats.model');

// Crear chat entre dos usuarios (si no existe)
exports.crearChat = async (req, res) => {
    try {
        const usuario1_id = req.usuario.id;
        const { usuario2_id } = req.body;

        if (!usuario2_id) {
            return res.status(400).json({ mensaje: 'Falta el ID del segundo usuario.' });
        }

        const existente = await chatsModel.existeChat(usuario1_id, usuario2_id);
        if (existente) {
            return res.status(200).json({ mensaje: 'El chat ya existe.', chat: existente });
        }

        const id = await chatsModel.crearChat({ usuario1_id, usuario2_id });
        res.status(201).json({ mensaje: 'Chat creado correctamente.', id });
    } catch (error) {
        console.error('Error al crear chat:', error);
        res.status(500).json({ mensaje: 'Error al crear el chat.' });
    }
};

// Obtener todos los chats del usuario logueado
exports.obtenerMisChats = async (req, res) => {
    try {
        const usuario_id = req.usuario.id;
        const chats = await chatsModel.obtenerChatsPorUsuario(usuario_id);
        res.status(200).json(chats);
    } catch (error) {
        console.error('Error al obtener chats:', error);
        res.status(500).json({ mensaje: 'Error al obtener tus chats.' });
    }
};

// Obtener chat por ID
exports.obtenerPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const chat = await chatsModel.obtenerPorId(id);

        if (!chat) {
            return res.status(404).json({ mensaje: 'Chat no encontrado.' });
        }

        if (chat.usuario1_id !== req.usuario.id && chat.usuario2_id !== req.usuario.id && req.usuario.rol !== 'admin') {
            return res.status(403).json({ mensaje: 'No autorizado para ver este chat.' });
        }

        res.status(200).json(chat);
    } catch (error) {
        console.error('Error al obtener chat:', error);
        res.status(500).json({ mensaje: 'Error al obtener el chat.' });
    }
};