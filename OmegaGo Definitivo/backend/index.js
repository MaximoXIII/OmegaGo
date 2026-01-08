require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});


// Rutas
const usuariosRoutes = require('./routes/usuarios.routes');
const productosRoutes = require('./routes/productos.routes');
const valoracionesRoutes = require('./routes/valoraciones.routes');
const publicacionesRoutes = require('./routes/publicaciones.routes');
const chatsRoutes = require('./routes/chats.routes');
const mensajesRoutes = require('./routes/mensajes.routes');
const reportesRoutes = require('./routes/reportes.routes');

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/valoraciones', valoracionesRoutes);
app.use('/api/publicaciones', publicacionesRoutes);
app.use('/api/chats', chatsRoutes);
app.use('/api/mensajes', mensajesRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/uploads', express.static('public/uploads'));


// Servidor
app.listen(port, () => {
    console.log(`✅ Servidor backend corriendo en http://localhost:${port}`);
});


