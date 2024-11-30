import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig"; 
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore"; // Importamos Firestore
import '../style/registro.css';

const Registro = () => {
    const navigate = useNavigate();
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [confirPassword, setConfirPassword] = useState('');
    const [nombreUsuario, setNombreUsuario] = useState(''); // Agregamos el estado para el nombre de usuario

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
            case 'nombre-usuario':
                setNombreUsuario(e.target.value); // Actualizamos el nombre de usuario
                break;
            default:
                break;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirPassword) {
            console.log('Las contraseñas no son iguales');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, correo, password);
            console.log("Usuario registrado:", userCredential.user);

            // Guardar el nombre de usuario en Firestore
            await setDoc(doc(db, "usuarios", userCredential.user.uid), {
                nombreUsuario: nombreUsuario,
                email: correo,
            });

            navigate("/login");
        } catch (error) {
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
                    <label htmlFor="nombre-usuario">Nombre de Usuario</label>
                    <input
                        type="text"
                        id="nombre-usuario"
                        name="nombre-usuario"
                        value={nombreUsuario}
                        onChange={handleChange}
                        placeholder="Ingresa tu nombre de usuario"
                        required
                    />
                </div>
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
