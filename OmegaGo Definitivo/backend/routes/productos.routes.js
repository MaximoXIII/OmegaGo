const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');
const verificarToken = require('../middlewares/verificarToken');
const upload = require('../middlewares/upload');


// 📌 Obtener todos los productos (público)
router.get('/', productosController.obtenerTodos);

// 📌 Obtener productos del usuario logueado
router.get('/usuario/mis-productos', verificarToken(), productosController.misProductos);

// 📌 Obtener producto por ID (público)
router.get('/:id', productosController.obtenerPorId);

// ✅ Crear producto (solo logueado)
router.post('/', verificarToken(), upload.single('imagen'), productosController.crearProducto);

// ✏️ Actualizar producto (solo dueño o admin)
router.put('/:id', verificarToken(), productosController.actualizarProducto);

// ❌ Eliminar producto (solo dueño o admin)
router.delete('/:id', verificarToken(), productosController.eliminarProducto);

module.exports = router;

