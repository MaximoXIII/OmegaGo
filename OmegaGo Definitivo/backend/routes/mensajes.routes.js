const express = require('express');
const router = express.Router();
const mensajesController = require('../controllers/mensajes.controller');
const verificarToken = require('../middlewares/verificarToken');

// Enviar mensaje
router.post('/', verificarToken(), mensajesController.enviarMensaje);

// Obtener conversación con receptor
router.get('/:receptor_id', verificarToken(), mensajesController.obtenerConversacion);

module.exports = router;