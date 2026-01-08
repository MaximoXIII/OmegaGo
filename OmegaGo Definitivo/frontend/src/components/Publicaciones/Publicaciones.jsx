import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Menu/Menu.css";

const Publicaciones = () => {
    const navigate = useNavigate();
    const [publicaciones, setPublicaciones] = useState([]);

    useEffect(() => {
        const obtenerMisPublicaciones = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/publicaciones/usuario/mis-publicaciones", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setPublicaciones(res.data);
            } catch (error) {
                console.error("Error al cargar publicaciones:", error);
            }
        };
        obtenerMisPublicaciones();
    }, []);

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta publicación?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/publicaciones/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setPublicaciones(publicaciones.filter(p => p.id !== id));
        } catch (error) {
            console.error("Error al eliminar publicación:", error);
        }
    };

    return (
        <div className="menu-page">
            <button onClick={() => navigate("/menu")} style={{ margin: "1rem" }}>
                ← Volver al menú
            </button>
            <h2 style={{ textAlign: "center" }}>Mis Publicaciones</h2>
            <div className="publicaciones-list">
                {publicaciones.length === 0 && <p style={{ textAlign: "center" }}>No has publicado nada aún.</p>}
                {publicaciones.map(post => (
                    <div key={post.id} className="publicacion-card">
                        <h3>Publicación</h3>
                        <p>{post.contenido}</p>
                        <span>{new Date(post.fecha_creacion).toLocaleDateString()}</span>
                        <button onClick={() => handleEliminar(post.id)}>Eliminar</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Publicaciones;
