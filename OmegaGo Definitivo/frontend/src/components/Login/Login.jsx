import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:5000/api/usuarios/login", {
                email,
                password,
            });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
                navigate("/menu");
            } else {
                setError("Credenciales inválidas");
            }
        } catch (err) {
            setError(err.response?.data?.mensaje || "Error al iniciar sesión");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <img src="/omega-logo.png" alt="OmegaGo Logo" className="logo" />
                    <h2>Bienvenido a OmegaGo</h2>
                    <p className="subtitle">Red Social con Market Place</p>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {error && <p className="error">{error}</p>}
                        <button type="submit" className="button">Entrar</button>
                    </form>
                    <p className="register-link">
                        ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;







