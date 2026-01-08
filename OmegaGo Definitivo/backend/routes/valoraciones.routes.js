const express = require('express');
const router = express.Router();
const valoracionesController = require('../controllers/valoraciones.controller');
const verificarToken = require('../middlewares/verificarToken');

// Crear valoración (logueado)
router.post('/', verificarToken(), valoracionesController.crearValoracion);

// Obtener valoraciones de un producto
router.get('/producto/:productoId', valoracionesController.obtenerPorProducto);

router.get("/:productoId/:usuarioId", verificarToken, valoracionesController.verificarValoracion);

// Eliminar valoración (usuario o admin)
router.delete('/:id', verificarToken(), valoracionesController.eliminarValoracion);

module.exports = router;
