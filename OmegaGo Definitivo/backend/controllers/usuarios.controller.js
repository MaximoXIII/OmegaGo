const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarios.model');
require('dotenv').config();

// Valida el formato de un DNI o NIE
 
function validarDNIoNIE(dni) {
    const dniRegex = /^[0-9]{8}[A-Z]$/;
    const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;
    return dniRegex.test(dni) || nieRegex.test(dni);
}

// Registro de nuevo usuario
 
exports.registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password, dni, fecha_nacimiento } = req.body;

        if (!nombre || !email || !password || !dni || !fecha_nacimiento) {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' });
        }

        if (!validarDNIoNIE(dni)) {
            return res.status(400).json({ mensaje: 'DNI o NIE no válido.' });
        }

        const existeDNI = await usuarioModel.obtenerPorDNI(dni);
        if (existeDNI) {
            return res.status(409).json({ mensaje: 'El DNI ya está registrado.' });
        }

        const existeEmail = await usuarioModel.obtenerPorEmail(email);
        if (existeEmail) {
            return res.status(409).json({ mensaje: 'El correo ya está registrado.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const nuevoId = await usuarioModel.insertar(nombre, email, hashedPassword, dni, fecha_nacimiento);

        res.status(201).json({ mensaje: 'Usuario registrado correctamente.', id: nuevoId });

    } catch (error) {
        console.error('❌ Error en registro:', error);
        res.status(500).json({ mensaje: 'Error en el servidor.' });
    }
};

// Login de usuario
 
exports.loginUsuario = async (req, res) => {
    try {
        console.log('Request Body recibido:', req.body);

        // Validar que el body no venga vacío
        if (!req.body || !req.body.email || !req.body.password) {
            return res.status(400).json({ mensaje: 'El cuerpo de la solicitud debe incluir email y password.' });
        }

        const { email, password } = req.body;

        const usuario = await usuarioModel.obtenerPorEmail(email);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
        }

        const passwordCorrecta = await bcrypt.compare(password, usuario.password);
        if (!passwordCorrecta) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta.' });
        }

        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '4h' }
        );

        res.json({ mensaje: 'Login exitoso.', token, usuario });

    } catch (error) {
        console.error('❌ Error en login:', error);
        res.status(500).json({ mensaje: 'Error en el servidor.' });
    }
};


// Obtener perfil del usuario autenticado
 
exports.obtenerPerfil = async (req, res) => {
    try {
        const usuario = await usuarioModel.obtenerPorId(req.params.id);

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
        }

        res.json(usuario);

    } catch (error) {
        console.error('❌ Error al obtener perfil:', error);
        res.status(500).json({ mensaje: 'Error en el servidor.' });
    }
};

// Actualizar perfil
 
exports.actualizarPerfil = async (req, res) => {
    try {
        const id = req.params.id;
        const usuarioExistente = await usuarioModel.obtenerPorId(id);

        if (!usuarioExistente) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
        }

        const { nombre, email, password } = req.body;

        const datosActualizados = {
            nombre: nombre || usuarioExistente.nombre,
            email: email || usuarioExistente.email,
            dni: usuarioExistente.dni,
            fecha_nacimiento: usuarioExistente.fecha_nacimiento,
            fecha_registro: usuarioExistente.fecha_registro,
        };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            datosActualizados.password = hashedPassword;
        } else {
            datosActualizados.password = usuarioExistente.password;
        }

        await usuarioModel.actualizar(id, datosActualizados);

        res.json({ mensaje: 'Perfil actualizado correctamente.' });

    } catch (error) {
        console.error('❌ Error al actualizar perfil:', error);
        res.status(500).json({ mensaje: 'Error en el servidor.' });
    }
};


// Eliminar cuenta de usuario
 
exports.eliminarUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        await usuarioModel.eliminar(id);

        res.json({ mensaje: 'Usuario eliminado correctamente.' });

    } catch (error) {
        console.error('❌ Error al eliminar usuario:', error);
        res.status(500).json({ mensaje: 'Error en el servidor.' });
    }
};


