const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarios.controller');
const verificarToken = require('../middlewares/verificarToken');

//  Registro de nuevo usuario

router.post('/registro', usuarioController.registrarUsuario);

// Login (devuelve token + usuario)

router.post('/login', usuarioController.loginUsuario);

//  Obtener perfil del usuario autenticado

router.get('/perfil/:id', verificarToken(), (req, res, next) => {

    // Seguridad adicional: evitar acceso a otros perfiles

    if (req.params.id !== req.usuarioId.toString()) {
        return res.status(403).json({ mensaje: 'No tienes permiso para acceder a este perfil.' });
    }
    next();
}, usuarioController.obtenerPerfil);

//  Actualizar perfil del usuario

router.put('/perfil/:id', verificarToken(), (req, res, next) => {
    if (req.params.id !== req.usuarioId.toString()) {
        return res.status(403).json({ mensaje: 'No puedes editar otro perfil.' });
    }
    next();
}, usuarioController.actualizarPerfil);

//  Eliminar usuario autenticado

router.delete('/perfil/:id', verificarToken(), (req, res, next) => {
    if (req.params.id !== req.usuarioId.toString()) {
        return res.status(403).json({ mensaje: 'No puedes eliminar otra cuenta.' });
    }
    next();
}, usuarioController.eliminarUsuario);

module.exports = router;



