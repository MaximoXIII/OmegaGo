import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Menu.css";

const MostrarValoraciones = ({ productoId }) => {
    const [valoraciones, setValoraciones] = useState([]);
    const [esAutor, setEsAutor] = useState(false);
    const token = localStorage.getItem("token");
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    useEffect(() => {
        fetchValoraciones();
    }, [productoId]);

    const fetchValoraciones = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/valoraciones/producto/${productoId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.length > 0 && usuario) {
                const autor = res.data.find(v => v.usuario_id === usuario.id);
                if (autor) setEsAutor(true);
            }

            // Mostrar solo una valoración por usuario (la más reciente)
            const unicas = [];

            res.data.forEach((val) => {
                const yaExiste = unicas.find((v) => v.usuario_id === val.usuario_id);
                if (!yaExiste) {
                    unicas.push(val);
                } else {
                    const fechaActual = new Date(val.fecha_valoracion);
                    const fechaGuardada = new Date(yaExiste.fecha_valoracion);
                    if (fechaActual > fechaGuardada) {
                        const index = unicas.findIndex((v) => v.usuario_id === val.usuario_id);
                        unicas[index] = val;
                    }
                }
            });

            setValoraciones(unicas); 

        } catch (error) {
            console.error("Error al cargar valoraciones:", error);
        }
    };

    const eliminarValoracion = async (id) => {
        if (!window.confirm("¿Eliminar esta valoración?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/valoraciones/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchValoraciones();
        } catch (error) {
            console.error("Error al eliminar valoración:", error);
        }
    };

    const calcularMedia = () => {
        if (valoraciones.length === 0) return 0;
        const total = valoraciones.reduce((sum, v) => sum + v.puntuacion, 0);
        return (total / valoraciones.length).toFixed(1);
    };

    return (
        <div className="valoraciones-section">
            <h4>Valoraciones ({valoraciones.length})</h4>
            <p>Media: {calcularMedia()} ⭐</p>

            {valoraciones.map((val) => (
                <div key={val.id} className="valoracion-card">
                    <p><strong>{val.nombre_usuario}</strong> - {new Date(val.fecha_valoracion).toLocaleDateString()}</p>
                    <p>{"★".repeat(val.puntuacion)}{"☆".repeat(5 - val.puntuacion)}</p>
                    {val.comentario && <p>{val.comentario}</p>}

                    {(usuario?.rol === 'admin') && (
                        <button className="reportar-btn" onClick={() => eliminarValoracion(val.id)}>
                            Eliminar
                        </button>
                    )}
                </div>
            ))}

            {valoraciones.length === 0 && <p>No hay valoraciones todavía.</p>}
        </div>
    );
};

export default MostrarValoraciones;

