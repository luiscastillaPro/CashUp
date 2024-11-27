import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaThLarge, FaListAlt, FaUser } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";
import { auth } from '../firebase/firebaseConfig';
import NuevoSaldo from "./Nuevosaldo.jsx"; // Importamos el componente
import '../style/header.css';

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
            <nav className="header-nav">
                <div className="header-container-opciones">
                    <Link to="/categorias" className="header-link">
                        <FaThLarge className="header-link-icon" /> Categorías
                    </Link>
                    <Link to="/lista" className="header-link">
                        <FaListAlt className="header-link-icon" /> Lista de Gastos
                    </Link>
                    {/* Opción de perfil con desplegable */}
                    <div className="header-perfil-container">
                        <button
                            className="header-link"
                            onClick={() => setMostrarDesplegable(!mostrarDesplegable)}
                        >
                            <FaUser className="header-link-icon" /> Perfil
                        </button>
                        {mostrarDesplegable && (
                            <div className="header-desplegable">
                                {/* Aquí va el componente NuevoSaldo */}
                                <NuevoSaldo />
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            <div className="header-cont-cerrar">
                <button className="cerrar-sesion-btn" onClick={cerrarSesion}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
            </div>
        </header>
    );
};

export default Header;
