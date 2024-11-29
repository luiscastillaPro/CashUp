import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaThLarge, FaListAlt, FaUser, FaHome } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";
import { auth } from '../firebase/firebaseConfig';
import NuevoSaldo from "./Nuevosaldo.jsx"; // Importamos el componente
import '../style/header.css';
import logo from '../imagenes/logo.png';

const Header = () => {
    const [mostrarDesplegable, setMostrarDesplegable] = useState(false); // Controla el menú desplegable
    const navigate = useNavigate();

    const cerrarSesion = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <header className="header">
            <img src={logo} className="logito" />
            <nav className="header-nav">
                <div className="header-container-opciones">
                    <Link to="/" className="header-link">
                        <FaHome className="header-link-icon" /> Home
                    </Link>
                    <Link to="/categorias" className="header-link">
                        <FaThLarge className="header-link-icon" /> Categorías
                    </Link>
                    <Link to="/lista" className="header-link">
                        <FaListAlt className="header-link-icon" /> Lista de Gastos
                    </Link>
                    <div className="header-perfil-container">
                        <Link
                            className="header-link"
                            onClick={() => setMostrarDesplegable(!mostrarDesplegable)}
                        >
                            <FaUser className="header-link-icon" /> Perfil
                        </Link>
                        {mostrarDesplegable && (
                            <div className="header-desplegable">
                                <NuevoSaldo />
                            </div>
                        )}
                    </div>
                    <div className="header-cont-cerrar">
                        <button className="header-link" onClick={cerrarSesion}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
