import React, { useState } from "react";
import Login from "./Login";
import Registro from "./Registro";
import "../style/auth.css";
import cartera from "../imagenes/cartera.png";
import logologin from "../imagenes/logologin.png";

const AuthPage = () => {
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const handleMostrarRegistro = () => setMostrarRegistro(true);
  const handleMostrarLogin = () => setMostrarRegistro(false);

  return (
    <div className="auth-container">
      <div
        className={`auth-form login-contenttin ${mostrarRegistro ? "flipped-back" : "flipped-front"}`}
      >
        <div className="card login-front">
          <Login onMostrarRegistro={handleMostrarRegistro} />
        </div>
        <div className="card login-back">
          <div>
            <h2 className="unete">Bienvenido a tu billetera de confianza</h2>
            <p className="mensajito-registrico">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore officia labore eius magni odit quibusdam consequatur nemo molestias sint, quos doloremque dicta qui doloribus laborum recusandae reiciendis ad! Amet, ipsam.
            </p>
            <div className="image-container">
              <img src={cartera} alt="Cartera" className="cartera-image" />
            </div>
          </div>
        </div>
      </div>
      <div
        className={`auth-form register-contenttin ${mostrarRegistro ? "flipped-front" : "flipped-back"}`}
      >
        <div className="card register-front">
          <Registro onMostrarLogin={handleMostrarLogin} />
        </div>
        <div className="card register-back">
          <div>
            <h2 >Únete a nuestra comunidad</h2>
            <p className="mensajito-registrico-p">
              No necesitas ser un experto para permanecer, todos aprendemos dia a dia, en los grupos compartimos experiencias ofertas,y ayudamos a resolver problemas cotidianos.
            </p>
            <div className="image-container-login">
              <img src={logologin} alt="Carteralogin" className="cartera-image" />
            </div>
            <p className="segundo-texto">
              <span className="star-icon">⭐</span> Crea una cuenta y empieza a ahorrar con confianza.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
