import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Importa useLocation
import { FaThLarge, FaListAlt, FaUser, FaHome } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import NuevoSaldo from "./Nuevosaldo.jsx"; // Importamos el componente
import "../style/header.css";
import logo from "../imagenes/logo.png";

const Header = () => {
  const [mostrarDesplegable, setMostrarDesplegable] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Obtiene la ruta actual

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  // Verifica si la ruta actual coincide con la ruta del enlace
  const isActive = (path) => location.pathname === path;

  // Agregamos una clase 'active' para "Perfil" cuando el desplegable esté visible
  const isPerfilActive = () => mostrarDesplegable;

  return (
    <header className="header">
      <img src={logo} className="logito" alt="Logo" />
      <nav className="header-nav">
        <div className="header-container-opciones">
          <Link
            to="/"
            className={`header-link ${isActive("/") ? "active" : ""}`}
          >
            <FaHome className="header-link-icon" /> Home
          </Link>
          <Link
            to="/categorias"
            className={`header-link ${isActive("/categorias") ? "active" : ""}`}
          >
            <FaThLarge className="header-link-icon" /> Categorías
          </Link>
          <Link
            to="/lista"
            className={`header-link ${isActive("/lista") ? "active" : ""}`}
          >
            <FaListAlt className="header-link-icon" /> Lista de Gastos
          </Link>
          <div
            className={`header-perfil-container ${isPerfilActive() ? "active" : ""}`}
          >
            <button
              className="header-link"
              onClick={() => setMostrarDesplegable(!mostrarDesplegable)}
            >
              <FaUser className="header-link-icon" /> Perfil
            </button>
            {mostrarDesplegable && (
              <div className="header-desplegable">
                <NuevoSaldo />
                <Link to="/idioma" className="header-desplegable-opcion">
                  Idioma
                </Link>
                <Link to="/moneda" className="header-desplegable-opcion">
                  Moneda
                </Link>
                <button
                  className="header-desplegable-opcion"
                  onClick={cerrarSesion}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <div>
        <p>Nombre de usuario</p>
      </div>
    </header>
  );
};

export default Header;
