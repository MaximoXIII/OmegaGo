import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ChatIndividual.css";

const ReportarProducto = () => {
    const { productoId } = useParams();
    const navigate = useNavigate();
    const [motivo, setMotivo] = useState("");
    const [nombreUsuario, setNombreUsuario] = useState("");
    const token = localStorage.getItem("token");
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    useEffect(() => {
        const obtenerProducto = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/productos/${productoId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setNombreUsuario(res.data.nombre_usuario || "Usuario desconocido");
            } catch (error) {
                console.error("Error al cargar producto:", error);
                setNombreUsuario("Usuario desconocido");
            }
        };
        obtenerProducto();
    }, [productoId, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/reportes", {
                motivo,
                producto_id: productoId,
                usuario_id: usuario.id,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Reporte enviado correctamente.");
            navigate("/menu");
        } catch (error) {
            console.error("Error al enviar reporte:", error);
            alert("No se pudo enviar el reporte.");
        }
    };

    return (
        <div className="menu-page">
            <header className="menu-header">
                <h2>Reportar producto</h2>
                <p>Estás reportando un producto del usuario: <strong>{nombreUsuario}</strong></p>
                <button className="volver-menu" onClick={() => navigate("/menu")}>← Volver al menú</button>
            </header>

            <main className="menu-main">
                <section className="productos-section">
                    <form onSubmit={handleSubmit}>
                        <label>Motivo del reporte:</label>
                        <textarea
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            required
                            placeholder="Escribe el motivo del reporte..."
                        />
                        <button type="submit">Enviar Reporte</button>
                    </form>
                </section>
            </main>
        </div>
    );
};

export default ReportarProducto;
