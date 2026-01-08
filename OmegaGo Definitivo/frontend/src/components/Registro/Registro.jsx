import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Registro.css";

function Registro() {
    const navigate = useNavigate();
    const [formulario, setFormulario] = useState({
        nombre: "",
        email: "",
        password: "",
        confirmarPassword: "",
        dni: "",
        fecha_nacimiento: ""
    });

    const [error, setError] = useState("");
    const [exito, setExito] = useState(false);

    const validarDNI = (dni) => {
        const dniRegex = /^\d{8}[A-HJ-NP-TV-Z]$/i;
        const nieRegex = /^[XYZ]\d{7}[A-Z]$/i;
        return dniRegex.test(dni) || nieRegex.test(dni);
    };

    const manejarCambio = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setError("");
        setExito(false);

        if (!validarDNI(formulario.dni)) {
            return setError("DNI o NIE inválido.");
        }
        if (formulario.password !== formulario.confirmarPassword) {
            return setError("Las contraseñas no coinciden.");
        }

        try {
            const res = await axios.post("http://localhost:5000/api/usuarios/registro", formulario);
            if (res.status === 201) {
                setExito(true);
                setTimeout(() => navigate("/"), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.mensaje || "Error en el registro.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <img src="/omega-logo.png" alt="Logo" className="logo" />
                <h2>Crear cuenta en OmegaGo</h2>
                <p className="subtitle">Únete a la comunidad</p>

                <form onSubmit={manejarEnvio}>
                    <input type="text" name="nombre" placeholder="Nombre de usuario" required onChange={manejarCambio} />
                    <input type="email" name="email" placeholder="Correo electrónico" required onChange={manejarCambio} />
                    <input type="password" name="password" placeholder="Contraseña" required onChange={manejarCambio} />
                    <input type="password" name="confirmarPassword" placeholder="Confirmar contraseña" required onChange={manejarCambio} />
                    <input type="text" name="dni" placeholder="DNI o NIE" required onChange={manejarCambio} />
                    <input type="date" name="fecha_nacimiento" required onChange={manejarCambio} />
                    <button type="submit" className="button">Registrarse</button>
                </form>

                {error && <p className="error">{error}</p>}
                {exito && <p className="success">Registro exitoso. Redirigiendo...</p>}

                <p className="register-link">
                    ¿Ya tienes cuenta? <Link to="/" className="link">Inicia sesión</Link>
                </p>
            </div>
        </div>
    );
}

export default Registro;


