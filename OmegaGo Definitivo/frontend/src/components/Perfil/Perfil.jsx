import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Perfil.css";

const Perfil = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [form, setForm] = useState({
        nombre: "",
        email: "",
        password: "",
        dni: "",
        fecha_nacimiento: "",
        fecha_registro: ""
    });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("usuario"));
        if (!storedUser) {
            navigate("/");
        } else {
            setUsuario(storedUser);
            setForm({
                nombre: storedUser.nombre,
                email: storedUser.email,
                password: "",
                dni: storedUser.dni,
                fecha_nacimiento: storedUser.fecha_nacimiento,
                fecha_registro: storedUser.fecha_registro,
            });
        }
    }, [navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formToSend = {
            ...form,
            fecha_nacimiento: new Date(form.fecha_nacimiento).toISOString(),
            fecha_registro: new Date(form.fecha_registro).toISOString(),
        };

        try {
            await axios.put(`http://localhost:5000/api/usuarios/perfil/${usuario.id}`, formToSend, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            const updatedUser = { ...usuario, nombre: form.nombre, email: form.email };
            localStorage.setItem("usuario", JSON.stringify(updatedUser));

            alert("Perfil actualizado correctamente.");
            navigate("/menu");
            window.location.reload();
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
            alert("Hubo un error al actualizar el perfil.");
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.")) return;

        try {
            await axios.delete(`http://localhost:5000/api/usuarios/perfil/${usuario.id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            localStorage.clear();
            alert("Cuenta eliminada correctamente.");
            navigate("/");
        } catch (error) {
            console.error("Error al eliminar cuenta:", error);
            alert("Hubo un error al eliminar la cuenta.");
        }
    };

    if (!usuario) return <p>Cargando perfil...</p>;

    return (
        <div className="perfil-page">
            <button type="button" onClick={() => navigate("/menu")} style={{ marginBottom: "1rem" }}>
                ← Volver al menú
            </button>
            <h2>Editar Perfil</h2>
            <form onSubmit={handleSubmit}>
                <label>Nombre de Usuario:</label>
                <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                />

                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                />

                <label>Nueva Contraseña (opcional):</label>
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                />

                <label>DNI:</label>
                <input type="text" name="dni" value={form.dni} readOnly />

                <label>Fecha de Nacimiento:</label>
                <input type="text" name="fecha_nacimiento" value={new Date(form.fecha_nacimiento).toLocaleDateString()} readOnly />
                <input type="hidden" name="fecha_nacimiento" value={form.fecha_nacimiento} />

                <label>Fecha de Registro:</label>
                <input type="text" name="fecha_registro" value={new Date(form.fecha_registro).toLocaleDateString()} readOnly />
                <input type="hidden" name="fecha_registro" value={form.fecha_registro} />

                <button type="submit">Guardar Cambios</button>
                <button type="button" onClick={handleDeleteAccount} style={{ backgroundColor: '#ff4d4f', marginTop: '0.5rem' }}>
                    Eliminar Cuenta
                </button>
            </form>
        </div>
    );
};

export default Perfil;

