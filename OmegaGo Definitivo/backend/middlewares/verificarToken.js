const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware para verificar un token JWT.
 * Se puede usar opcionalmente con { adminOnly: true } para proteger rutas solo para admins.
 */
const verificarToken = (opciones = {}) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"

        if (!token) {
            return res.status(401).json({ mensaje: 'Token no proporcionado.' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Guardar en la request los datos del token
            req.usuarioId = decoded.id;
            req.usuario = decoded;

            // Si la ruta requiere admin y el usuario no lo es
            if (opciones.adminOnly && decoded.rol !== 'admin') {
                return res.status(403).json({ mensaje: 'Acceso solo para administradores.' });
            }

            next(); // Token válido → continúa
        } catch (err) {
            console.error('❌ Token inválido:', err);
            return res.status(403).json({ mensaje: 'Token inválido o expirado.' });
        }
    };
};

module.exports = verificarToken;


