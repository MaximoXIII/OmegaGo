import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ChatIndividual.css';

const ChatIndividual = () => {
    const { id } = useParams(); // chat_id
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const token = localStorage.getItem('token');

    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const [receptorId, setReceptorId] = useState(null);
    const [nombreReceptor, setNombreReceptor] = useState('');

    // 1) Traer datos del chat (incluye ids y nombres)
    useEffect(() => {
        obtenerDatosChat();
    }, [id]);

    // 2) Cuando cambia receptorId, cargar mensajes
    useEffect(() => {
        if (receptorId) {
            fetchMensajes();
        }
    }, [receptorId]);

    const obtenerDatosChat = async () => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/chats/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const chat = res.data;
            const yo = usuario.id;

            // Determinar quién es receptor y su nombre
            const otherId = yo === chat.usuario1_id ? chat.usuario2_id : chat.usuario1_id;
            const otherName = yo === chat.usuario1_id ? chat.nombre_usuario2 : chat.nombre_usuario1;

            setReceptorId(otherId);
            setNombreReceptor(otherName);
        } catch (error) {
            console.error('❌ Error al obtener info del chat:', error);
        }
    };

    const fetchMensajes = async () => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/mensajes/${receptorId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMensajes(res.data);
            setTimeout(() => {
                scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (error) {
            console.error('❌ Error al cargar mensajes:', error);
        }
    };

    const enviarMensaje = async (e) => {
        e.preventDefault();

        if (!nuevoMensaje.trim() || !usuario?.id || !receptorId) {
            console.warn('⚠️ Faltan campos obligatorios para enviar el mensaje');
            return;
        }

        try {
            await axios.post(
                'http://localhost:5000/api/mensajes',
                {
                    emisor_id: usuario.id,
                    receptor_id: receptorId,
                    mensaje: nuevoMensaje,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setNuevoMensaje('');
            fetchMensajes();
        } catch (error) {
            console.error('❌ Error al enviar mensaje:', error);
        }
    };

    return (
        <div className="menu-page">
            <header className="menu-header">
                <h2>Chat con {nombreReceptor || '...'}</h2>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                    <button className="volver-menu" onClick={() => navigate('/menu')}>
                        ← Volver al menú
                    </button>
                    <button className="volver-menu" onClick={() => navigate('/chats')}>
                        ← Volver a mis chats
                    </button>
                    <button className="volver-menu" onClick={() => navigate(`/reportar-chat/${id}`)}>
                        Reportar este chat
                    </button>
                </div>
            </header>

            <main className="menu-main">
                <section className="productos-section">
                    <div className="mensajes-container">
                        {mensajes.map((msg) => {
                            const fecha = new Date(msg.fecha_envio);
                            const hora = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                            const dia = fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

                            return (
                                <div
                                    key={msg.id}
                                    className={`mensaje ${msg.emisor_id === usuario.id ? 'propio' : 'ajeno'}`}
                                >
                                    <div>{msg.mensaje}</div>
                                    <div className="mensaje-fecha">{`${dia} ${hora}`}</div>
                                </div>
                            );
                        })}
                        <div ref={scrollRef} />
                    </div>

                    <form onSubmit={enviarMensaje} className="form-mensaje">
                        <input
                            type="text"
                            placeholder="Escribe un mensaje..."
                            value={nuevoMensaje}
                            onChange={(e) => setNuevoMensaje(e.target.value)}
                        />
                        <button type="submit">Enviar</button>
                    </form>
                </section>
            </main>
        </div>
    );
};

export default ChatIndividual;