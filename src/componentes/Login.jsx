import React, { useState } from "react";      
import { useNavigate } from "react-router-dom";
import '../style/login.css';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig"; 

const Login = () => {
    const navigate = useNavigate();
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');

    const handleChange = (e) => {
        if(e.target.name === 'email'){
            setCorreo(e.target.value);
        } else if (e.target.name === 'password'){
            setPassword(e.target.value);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const userCredential = await signInWithEmailAndPassword(auth, correo, password);
            console.log("Usuario registrado:", userCredential.user);
            navigate("/");
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <div className="login-container">
            <div className="login-header">
                <h1 className="login-titulo">Iniciar Sesion</h1>
                <button
                    className="login-boton-inicio"
                    onClick={() => navigate('/registro')}
                >
                    Registrarse
                </button>
            </div>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={correo}
                        onChange={handleChange}
                        placeholder="Ingresa tu correo"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        placeholder="Ingresa tu contraseña"
                        required
                    />
                </div>
                <button type="submit" className="login-boton-enviar">
                    Iniciar Sesion
                </button>
            </form>
        </div>
    );
}

export default Login;