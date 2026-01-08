import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Chats.css';

const Chats = () => {
    const [chats, setChats] = useState([]);
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('usuario'));
        if (!storedUser) return navigate('/login');
        setUsuario(storedUser);
        fetchChats();
    }, [navigate]);

    const fetchChats = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/chats', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setChats(res.data);
        } catch (error) {
            console.error('Error al cargar los chats:', error);
        }
    };

    const irAlChat = (chatId) => {
        navigate(`/chats/${chatId}`);
    };

    const volverAlMenu = () => {
        navigate('/menu');
    };

    const obtenerNombreReceptor = (chat) => {
        if (!usuario) return '';
        return chat.usuario1_id === usuario.id ? chat.nombre_usuario2 : chat.nombre_usuario1;
    };

    return (
        <div className="menu-page">
            <header className="menu-header">
                <img src="/omega-logo.png" alt="OmegaGo" className="menu-logo" />
                <h2>Mis Chats</h2>
                <button onClick={volverAlMenu} className="volver-menu">← Volver al menú</button>
            </header>

            <main className="menu-main">
                <section className="productos-section">
                    {chats.length === 0 ? (
                        <p>No tienes chats activos todavía.</p>
                    ) : (
                        <div className="publicaciones-list">
                            {chats.map((chat) => (
                                <div key={chat.id} className="publicacion-card">
                                    <p><strong>Chat con:</strong> {obtenerNombreReceptor(chat)}</p>
                                    <button onClick={() => irAlChat(chat.id)}>Entrar</button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Chats;