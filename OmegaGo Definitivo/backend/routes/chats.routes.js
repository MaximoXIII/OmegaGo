const express = require('express');
const router = express.Router();
const chatsController = require('../controllers/chats.controller');
const verificarToken = require('../middlewares/verificarToken');

// Crear chat
router.post('/', verificarToken(), chatsController.crearChat);

// Obtener todos los chats del usuario
router.get('/', verificarToken(), chatsController.obtenerMisChats);

// Obtener chat por ID
router.get('/:id', verificarToken(), chatsController.obtenerPorId);

module.exports = router;