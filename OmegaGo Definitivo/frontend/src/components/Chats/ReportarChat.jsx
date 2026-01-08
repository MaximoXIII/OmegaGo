import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ChatIndividual.css";

const ReportarChat = () => {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const [motivo, setMotivo] = useState("");
    const [receptorNombre, setReceptorNombre] = useState("");
    const token = localStorage.getItem("token");
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    useEffect(() => {
        const obtenerNombre = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/chats/${chatId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const chat = res.data;
                const nombre = chat.usuario1_id === usuario.id ? chat.nombre_usuario2 : chat.nombre_usuario1;
                setReceptorNombre(nombre);
            } catch (error) {
                console.error("Error al cargar chat:", error);
                setReceptorNombre("Usuario desconocido");
            }
        };
        obtenerNombre();
    }, [chatId, usuario.id, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/reportes", {
                chat_id: chatId,
                motivo,
                usuario_id: usuario.id,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Reporte enviado correctamente.");
            navigate("/chats");
        } catch (error) {
            console.error("Error al enviar reporte:", error);
            alert("No se pudo enviar el reporte.");
        }
    };

    return (
        <div className="menu-page">
            <header className="menu-header">
                <h2>Reportar usuario del chat</h2>
                <p>Estás reportando a: <strong>{receptorNombre}</strong></p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                    <button className="volver-menu" onClick={() => navigate('/menu')}>
                        ← Volver al menú
                    </button>
                    <button className="volver-menu" onClick={() => navigate(`/chats/${chatId}`)}>
                        ← Volver al chat
                    </button>
                </div>
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

export default ReportarChat;

