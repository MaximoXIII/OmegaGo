const productosModel = require('../models/productos.model');

// Crear producto
exports.crearProducto = async (req, res) => {
    try {
        const { titulo, descripcion, precio, categoria } = req.body;
        const imagen = req.file ? req.file.filename : null;
        const usuario_id = req.usuario.id;

        if (!titulo || !descripcion || !precio || !categoria) {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' });
        }

        const nuevoProducto = {
            titulo,
            descripcion,
            precio,
            categoria,
            imagen,
            usuario_id
        };

        const idInsertado = await productosModel.crearProducto(nuevoProducto);
        res.status(201).json({ mensaje: 'Producto creado correctamente.', id: idInsertado });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ mensaje: 'Error al crear el producto.' });
    }
};

// Obtener todos los productos
exports.obtenerTodos = async (req, res) => {
    try {
        const productos = await productosModel.obtenerTodos();
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ mensaje: 'Error al obtener productos.' });
    }
};

// Obtener productos del usuario logueado
exports.misProductos = async (req, res) => {
    try {
        const usuario_id = req.usuario.id;
        const productos = await productosModel.obtenerPorUsuario(usuario_id);
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener tus productos:', error);
        res.status(500).json({ mensaje: 'Error al obtener tus productos.' });
    }
};

// Obtener producto por ID
exports.obtenerPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await productosModel.obtenerPorId(id);
        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado.' });
        }
        res.status(200).json(producto);
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ mensaje: 'Error al obtener el producto.' });
    }
};

// Eliminar producto
exports.eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await productosModel.obtenerPorId(id);

        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado.' });
        }

        if (producto.usuario_id !== req.usuario.id && req.usuario.rol !== 'admin') {
            return res.status(403).json({ mensaje: 'No autorizado para eliminar este producto.' });
        }

        await productosModel.eliminarProducto(id);
        res.status(200).json({ mensaje: 'Producto eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ mensaje: 'Error al eliminar el producto.' });
    }
};

// Actualizar producto
exports.actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const productoExistente = await productosModel.obtenerPorId(id);

        if (!productoExistente) {
            return res.status(404).json({ mensaje: 'Producto no encontrado.' });
        }

        if (productoExistente.usuario_id !== req.usuario.id && req.usuario.rol !== 'admin') {
            return res.status(403).json({ mensaje: 'No autorizado para editar este producto.' });
        }

        const { titulo, descripcion, precio, categoria } = req.body;
        const imagen = req.file ? req.file.filename : productoExistente.imagen;

        const actualizado = {
            titulo,
            descripcion,
            precio,
            categoria,
            imagen
        };

        await productosModel.actualizarProducto(id, actualizado);
        res.status(200).json({ mensaje: 'Producto actualizado correctamente.' });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ mensaje: 'Error al actualizar el producto.' });
    }
};



