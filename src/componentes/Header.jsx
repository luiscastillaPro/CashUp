import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaThLarge, FaListAlt, FaUser, FaHome, FaGem } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig"; // Importamos Firestore
import { doc, getDoc } from "firebase/firestore"; // Funciones para obtener datos de Firestore
import NuevoSaldo from "./Nuevosaldo.jsx";
import "../style/header.css";
import logo from "../imagenes/logo.png";

const Header = () => {
  const [mostrarDesplegable, setMostrarDesplegable] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false); // Estado para el menú hamburguesa
  const [nombreUsuario, setNombreUsuario] = useState(""); // Estado para el nombre de usuario
  const navigate = useNavigate();
  const location = useLocation();

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      navigate("/login");
      localStorage.removeItem("nombreUsuario"); // Limpia el nombre de usuario al cerrar sesión
    } catch (error) {
      console.log(error);
    }
  };

  // Verifica si la ruta actual coincide con la ruta del enlace
  const isActive = (path) => location.pathname === path;

  // Obtener el nombre de usuario desde Firestore o localStorage cuando el usuario se autentica
  useEffect(() => {
    const obtenerNombreUsuario = async () => {
      const usuarioEnLocalStorage = localStorage.getItem("nombreUsuario");
      if (usuarioEnLocalStorage) {
        setNombreUsuario(usuarioEnLocalStorage);
      } else if (auth.currentUser) {
        const docRef = doc(db, "usuarios", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const nombre = docSnap.data().nombreUsuario;
          setNombreUsuario(nombre);
          localStorage.setItem("nombreUsuario", nombre);
        }
      }
    };

    obtenerNombreUsuario();
  }, []);

  return (
    <header className="header">
      <img src={logo} className="logito" alt="Logo" />
      <button
        className="hamburguesa"
        aria-label="Abrir menú"
        onClick={() => setMenuAbierto(!menuAbierto)}
      >
        ☰
      </button>
      <nav className={`header-nav ${menuAbierto ? "active" : ""}`}>
        <div className="header-container-opciones">
          <Link
            to="/"
            className={`header-link ${isActive("/") ? "active" : ""}`}
            onClick={() => setMenuAbierto(false)}
          >
            <FaHome className="header-link-icon" /> Home
          </Link>
          <Link
            to="/categorias"
            className={`header-link ${isActive("/categorias") ? "active" : ""}`}
            onClick={() => setMenuAbierto(false)}
          >
            <FaThLarge className="header-link-icon" /> Categorías
          </Link>
          <Link
            to="/lista"
            className={`header-link ${isActive("/lista") ? "active" : ""}`}
            onClick={() => setMenuAbierto(false)}
          >
            <FaListAlt className="header-link-icon" /> Lista de Gastos
          </Link>
          <div
            className={`header-perfil-container ${
              mostrarDesplegable ? "active" : ""
            }`}
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
                <button
                  className="header-desplegable-opcion nuevo-valor"
                  onClick={cerrarSesion}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <p className="header-saludo">
        <FaGem className="header-diamante-icon" />{" "}
        {nombreUsuario ? `${nombreUsuario}` : "Cargando..."}
      </p>
    </header>
  );
};

export default Header;
