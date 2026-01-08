// routes/publicaciones.routes.js
const express = require('express');
const router = express.Router();
const publicacionesController = require('../controllers/publicaciones.controller');
const verificarToken = require('../middlewares/verificarToken');

// Obtener todas las publicaciones (público)
router.get('/', publicacionesController.obtenerTodas);

// Obtener publicaciones del usuario autenticado
router.get('/usuario/mis-publicaciones', verificarToken(), publicacionesController.obtenerMisPublicaciones);

// Obtener publicación por ID (público)
router.get('/:id', publicacionesController.obtenerPorId);

// Crear publicación (requiere login)
router.post('/', verificarToken(), publicacionesController.crearPublicacion);

// Eliminar publicación (solo dueño o admin)
router.delete('/:id', verificarToken(), publicacionesController.eliminarPublicacion);

module.exports = router;
