import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Menu/Menu.css";

const ReportesAdmin = () => {
    const [reportes, setReportes] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchReportes();
    }, []);

    const fetchReportes = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/reportes", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReportes(res.data);
        } catch (error) {
            console.error("Error al cargar reportes:", error);
        }
    };

    const eliminarReporte = async (id) => {
        if (!window.confirm("¿Eliminar este reporte?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/reportes/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchReportes();
        } catch (error) {
            console.error("Error al eliminar reporte:", error);
        }
    };

    return (
        <div className="menu-page">
            <header className="menu-header">
                <h2>Gestión de Reportes</h2>
                <button className="volver-menu" onClick={() => navigate("/menu")}>← Volver al menú</button>
            </header>

            <main className="menu-main">
                <section className="productos-section">
                    {reportes.length === 0 ? (
                        <p>No hay reportes registrados.</p>
                    ) : (
                        <div className="publicaciones-list">
                            {reportes.map((rep) => (
                                <div key={rep.id} className="publicacion-card">
                                    <p><strong>Motivo:</strong> {rep.motivo}</p>
                                    <p><strong>Reportado por:</strong> {rep.nombre_reportador}</p>
                                    <p><strong>Usuario reportado:</strong> {rep.nombre_reportado}</p>
                                    {rep.producto && <p><strong>Producto:</strong> {rep.producto}</p>}
                                    {rep.chat_id && <p><strong>Chat ID:</strong> {rep.chat_id}</p>}
                                    <p><strong>Fecha:</strong> {new Date(rep.fecha_reporte).toLocaleString()}</p>
                                    <button onClick={() => eliminarReporte(rep.id)}>Eliminar Reporte</button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default ReportesAdmin;