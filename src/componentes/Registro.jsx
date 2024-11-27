import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig"; 
import { useNavigate } from "react-router-dom";
import '../style/registro.css';

const Registro = () => {
    const navigate = useNavigate();
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [confirPassword, setConfirPassword] = useState('');

    const handleChange = (e) => {
        switch(e.target.name){
            case 'email':
                setCorreo(e.target.value);
                break;
            case 'password':
                setPassword(e.target.value);
                break;
            case 'confirm-password':
                setConfirPassword(e.target.value);
                break;
            default:
                break;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirPassword) {
            console.log('las contraseñas no son iguales');
            return;
        }

        try{
            const userCredential = await createUserWithEmailAndPassword(auth, correo, password);
            console.log("Usuario registrado:", userCredential.user);
            navigate("/login");
        } catch(error) {
            console.log(error);
        }
    }
    
    return (
        <div className="registro-container">
            <div className="registro-header">
                <h1 className="registro-titulo">Registrarse</h1>
                <button
                    className="registro-boton-inicio"
                    onClick={() => navigate('/login')}
                >
                    Iniciar Sesión
                </button>
            </div>
            <form className="registro-form" onSubmit={handleSubmit}>
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
                        placeholder="Crea una contraseña"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirm-password">Confirmar Contraseña</label>
                    <input
                        type="password"
                        id="confirm-password"
                        name="confirm-password"
                        value={confirPassword}
                        onChange={handleChange}
                        placeholder="Confirma tu contraseña"
                        required
                    />
                </div>
                <button type="submit" className="registro-boton-enviar">
                    Registrarse
                </button>
            </form>
        </div>
    );
}

export default Registro;