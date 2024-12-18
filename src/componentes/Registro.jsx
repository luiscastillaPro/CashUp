import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import "../style/registro.css";
import logo from "../imagenes/logo.png";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Registro = ({ onMostrarLogin }) => {
    const navigate = useNavigate();
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [confirPassword, setConfirPassword] = useState('');
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);
    const [aceptaTerminos, setAceptaTerminos] = useState(false);

    const handleChange = (e) => {
        switch (e.target.name) {
            case 'email':
                setCorreo(e.target.value);
                break;
            case 'password':
                setPassword(e.target.value);
                break;
            case 'confirm-password':
                setConfirPassword(e.target.value);
                break;
            case 'nombre-usuario':
                setNombreUsuario(e.target.value);
                break;
            case 'terminos':
                setAceptaTerminos(e.target.checked);
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirPassword) {
            console.log('Las contraseñas no son iguales');
            return;
        }

        if (!aceptaTerminos) {
            console.log('Debe aceptar los términos y condiciones');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, correo, password);
            console.log("Usuario registrado:", userCredential.user);

            await setDoc(doc(db, "usuarios", userCredential.user.uid), {
                nombreUsuario: nombreUsuario,
                email: correo,
            });

            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="registro-wrapper-container">
            <div className="registro-container">
                <div className="login-header">
                    <img src={logo} alt="Logo" className="login-logo" />
                </div>
                <form className="registro-form" onSubmit={handleSubmit}>
                    <div className="registro-form-group">
                        <label htmlFor="nombre-usuario" className="registro-label">Nombre de Usuario</label>
                        <div className="input-wrapper">
                            <FaUser className="input-icon" />
                            <input
                                type="text"
                                id="nombre-usuario"
                                name="nombre-usuario"
                                value={nombreUsuario}
                                onChange={handleChange}
                                placeholder="Ingresa tu nombre de usuario"
                                className="registro-input"
                                required
                            />
                        </div>
                    </div>
                    <div className="registro-form-group">
                        <label htmlFor="email" className="registro-label">Correo Electrónico</label>
                        <div className="input-wrapper">
                            <FaEnvelope className="input-icon" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={correo}
                                onChange={handleChange}
                                placeholder="Ingresa tu correo"
                                className="registro-input"
                                required
                            />
                        </div>
                    </div>
                    <div className="registro-form-group">
                        <label htmlFor="password" className="registro-label">Contraseña</label>
                        <div className="input-wrapper">
                            <FaLock className="input-icon" />
                            <input
                                type={mostrarPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={password}
                                onChange={handleChange}
                                placeholder="Crea una contraseña"
                                className="registro-input"
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
                    <div className="registro-form-group">
                        <label htmlFor="confirm-password" className="registro-label">Confirmar Contraseña</label>
                        <div className="input-wrapper">
                            <FaLock className="input-icon" />
                            <input
                                type={mostrarConfirmPassword ? "text" : "password"}
                                id="confirm-password"
                                name="confirm-password"
                                value={confirPassword}
                                onChange={handleChange}
                                placeholder="Confirma tu contraseña"
                                className="registro-input"
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setMostrarConfirmPassword(!mostrarConfirmPassword)}
                            >
                                {mostrarConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    <div className="registro-form-group registro-terminos">
                        <input
                            type="checkbox"
                            id="terminos"
                            name="terminos"
                            checked={aceptaTerminos}
                            onChange={handleChange}
                        />
                        <label htmlFor="terminos">
                            Aceptar términos y condiciones.
                        </label>
                    </div>
                    <button type="submit" className="registro-boton-enviar">Registrarse</button>
                    <p className="registro-iniciar-sesion">
                        Ya tienes una cuenta?{" "}
                        <strong onClick={onMostrarLogin} className="registro-iniciar-enlace">
                            INICIAR
                        </strong>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Registro;
