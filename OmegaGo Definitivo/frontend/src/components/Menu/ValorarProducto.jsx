import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Menu/Menu.css";

const ValorarProducto = ({ productoId, usuarioProductoId }) => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const token = localStorage.getItem("token");

    const [puntuacion, setPuntuacion] = useState(0);
    const [comentario, setComentario] = useState("");
    const [valoracionExistente, setValoracionExistente] = useState(null);

    useEffect(() => {
        const fetchValoracion = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/valoraciones/${productoId}/${usuario.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data) setValoracionExistente(res.data);
            } catch (error) {
                console.error("No se pudo obtener la valoración del usuario", error);
            }
        };

        if (usuario && usuario.id !== usuarioProductoId) {
            fetchValoracion();
        }
    }, [productoId, usuario.id, usuarioProductoId, token]);

    const enviarValoracion = async () => {
        try {
            await axios.post(
                "http://localhost:5000/api/valoraciones",
                {
                    comentario,
                    puntuacion,
                    producto_id: productoId,
                    usuario_id: usuario.id,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert("¡Gracias por tu valoración!");
            setValoracionExistente({ comentario, puntuacion }); // simular el estado después de valorar
        } catch (error) {
            const mensaje =
                error.response?.data?.mensaje || "Error al enviar la valoración.";
            alert(mensaje);
            console.error(error);
        }
    };

    if (usuario.id === usuarioProductoId) return null; // No mostrar si es su propio producto

    return (
        <div className="valoracion-card">
            {valoracionExistente ? (
                <>
                    <p><strong>Tu valoración:</strong></p>
                    <div>
                        {"★".repeat(valoracionExistente.puntuacion).padEnd(5, "☆")}
                    </div>
                    {valoracionExistente.comentario && (
                        <p style={{ fontStyle: "italic", marginTop: "5px" }}>
                            {valoracionExistente.comentario}
                        </p>
                    )}
                </>
            ) : (
                <>
                    <p><strong>Deja tu valoración:</strong></p>
                    <div>
                        {[1, 2, 3, 4, 5].map((n) => (
                            <span
                                key={n}
                                style={{
                                    cursor: "pointer",
                                    color: n <= puntuacion ? "#ffc107" : "#ccc",
                                    fontSize: "20px",
                                }}
                                onClick={() => setPuntuacion(n)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <textarea
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        placeholder="Escribe un comentario (opcional)"
                        rows={3}
                    />
                    <button onClick={enviarValoracion}>Enviar Valoración</button>
                </>
            )}
        </div>
    );
};

export default ValorarProducto;
