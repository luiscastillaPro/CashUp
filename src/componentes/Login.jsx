import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/login.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import logo from "../imagenes/logo.png";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = ({ onMostrarRegistro }) => {
    const navigate = useNavigate();
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [recordarme, setRecordarme] = useState(false);

    useEffect(() => {
        const savedEmail = localStorage.getItem("correo");
        const savedPassword = localStorage.getItem("password");

        if (savedEmail && savedPassword) {
            setCorreo(savedEmail);
            setPassword(savedPassword);
            setRecordarme(true);
        }
    }, []);

    const handleChange = (e) => {
        if (e.target.name === 'email') {
            setCorreo(e.target.value);
        } else if (e.target.name === 'password') {
            setPassword(e.target.value);
        }
    };

    const handleCheckboxChange = () => {
        setRecordarme(!recordarme);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, correo, password);
            console.log("Usuario registrado:", userCredential.user);

            if (recordarme) {
                localStorage.setItem("correo", correo);
                localStorage.setItem("password", password);
            } else {
                localStorage.removeItem("correo");
                localStorage.removeItem("password");
            }

            navigate("/");
        } catch (error) {
            console.log(error);
            alert("Correo o contraseña incorrectos.");
        }
    };

    return (
        <div className="login-wrapper-container">
            <div className="login-container">
                <div className="login-header">
                    <img src={logo} alt="Logo" className="login-logo" />
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-form-group">
                        <label htmlFor="email" className="login-label">Correo Electrónico</label>
                        <div className="input-wrapper">
                            <FaEnvelope className="input-icon" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={correo}
                                onChange={handleChange}
                                placeholder="Ingresa tu correo"
                                className="login-input"
                                required
                            />
                        </div>
                    </div>
                    <div className="login-form-group">
                        <label htmlFor="password" className="login-label">Contraseña</label>
                        <div className="input-wrapper">
                            <FaLock className="input-icon" />
                            <input
                                type={mostrarPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={password}
                                onChange={handleChange}
                                placeholder="Ingresa tu contraseña"
                                className="login-input"
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setMostrarPassword(!mostrarPassword)}
                            >
                                {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    <div className="login-checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={recordarme}
                                onChange={handleCheckboxChange}
                                className="checkbox-input"
                            />
                            Recordarme
                        </label>
                        <a href="/reset-password" className="login-forgot-password-rr">
                            ¿Has olvidado tu contraseña?
                        </a>
                    </div>
                    <button type="submit" className="login-button-submit">
                        Iniciar Sesión
                    </button>
                </form>
                <p className="login-register-text">
                    ¿Aún no te has registrado?{" "}
                    <span onClick={onMostrarRegistro} className="register-link">
                        <strong>REGÍSTRATE</strong>
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
