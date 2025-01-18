import React from "react";
import './style/layout.css';
import App from './componentes/App.jsx';
import ListaGasto from './componentes/ListaGastos.jsx';
import GastosCategoria from './componentes/GastosCategoria.jsx';
import AuthPage from './componentes/AuthPage.jsx';
import NuevoSaldo from './componentes/Nuevosaldo.jsx';
import { Route, Routes } from 'react-router-dom';
import RutaPrivada from "./componentes/RutaPrivada.jsx";

const Layout = () => {
  return (
    <div className="layout-container">
      <Routes className="invisible">
        <Route path="/login" element={<AuthPage />} />
        <Route path="/registro" element={<AuthPage />} />
        
        <Route path="/categorias" element={
          <RutaPrivada>
            <GastosCategoria />
          </RutaPrivada>
        } />
        
        <Route path="/lista" element={
          <RutaPrivada>
            <ListaGasto />
          </RutaPrivada>
        } />

        <Route path="/perfil" element={
          <RutaPrivada>
            <NuevoSaldo />
          </RutaPrivada>
        } />
        
        <Route path="/"  element={
          <RutaPrivada >
            <App />
          </RutaPrivada>
        } />
      </Routes>
    </div>
  );
};

export default Layout;
