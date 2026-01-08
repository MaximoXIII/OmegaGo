const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportes.controller');
const verificarToken = require('../middlewares/verificarToken');

//  Crear un reporte (requiere autenticación)
router.post('/', verificarToken(), reportesController.crearReporte);

//  Obtener todos los reportes (solo admin)
router.get('/', verificarToken('admin'), reportesController.obtenerTodos);

//  Obtener reportes por usuario reportado (opcional, para uso interno/admin)
router.get('/usuario/:id', verificarToken('admin'), reportesController.obtenerPorUsuarioReportado);

//  Eliminar un reporte por ID (solo admin)
router.delete('/:id', verificarToken('admin'), reportesController.eliminarReporte);

module.exports = router;






