import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";

import Error404 from "./components/Error/Error404";
import Login from "./components/Login/Login";
import Registro from "./components/Registro/Registro";
import Menu from "./components/Menu/Menu";
import Perfil from "./components/Perfil/Perfil";
import MisProductos from "./components/MisProductos/MisProductos";
import Publicaciones from "./components/Publicaciones/Publicaciones";
import Chats from "./components/Chats/Chats";
import ChatIndividual from "./components/Chats/ChatIndividual";
import ReportarChat from "./components/Chats/ReportarChat";
import ReportesAdmin from "./components/Admin/ReportesAdmin";
import ReportarProducto from './components/Chats/ReportarProducto';

function App() {
    useEffect(() => {
        axios.get("/api/productos")
            .then(res => console.log("✅ Conectado al backend:", res.data))
            .catch(err => console.error("❌ Error al conectar con backend:", err.message));
    }, []);

    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/mis-productos" element={<MisProductos />} />
            <Route path="/publicaciones" element={<Publicaciones />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/chats/:id" element={<ChatIndividual />} />
            <Route path="/reportar-chat/:chatId" element={<ReportarChat />} />
            <Route path="/reportes" element={<ReportesAdmin />} />
            <Route path="/reportar-producto/:productoId" element={<ReportarProducto />} />
            <Route path="*" element={<Error404 />} />
        </Routes>
    );
}

export default App;



