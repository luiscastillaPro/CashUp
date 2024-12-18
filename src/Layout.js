import React from "react";
import './style/layout.css';
import App from './componentes/App.jsx';
import EditarGasto from './componentes/EditarGasto.jsx';
import ListaGasto from './componentes/ListaGastos.jsx';
import GastosCategoria from './componentes/GastosCategoria.jsx';
import AuthPage from './componentes/AuthPage.jsx'; // Importamos el componente AuthPage
import NuevoSaldo from './componentes/Nuevosaldo.jsx';
import { Route, Routes } from 'react-router-dom';
import RutaPrivada from "./componentes/RutaPrivada.jsx";

const Layout = () => {
  return (
    <div className="layout-container">
      <Routes>
        {/* Ruta para el login y el registro, usando el componente AuthPage */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/registro" element={<AuthPage />} />
        
        {/* Rutas privadas que requieren autenticación */}
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
        
        <Route path="/editar/:id" element={
          <RutaPrivada>
            <EditarGasto />
          </RutaPrivada>
        } />

        <Route path="/perfil" element={
          <RutaPrivada>
            <NuevoSaldo />
          </RutaPrivada>
        } />
        
        <Route path="/" element={
          <RutaPrivada>
            <App />
          </RutaPrivada>
        } />
      </Routes>
    </div>
  );
};

export default Layout;
