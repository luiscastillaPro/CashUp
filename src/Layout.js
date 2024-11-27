import React from "react";
import './style/layout.css';
import App from './componentes/App.jsx';
import EditarGasto from './componentes/EditarGasto.jsx';
import ListaGasto from './componentes/ListaGastos.jsx';
import GastosCategoria from './componentes/GastosCategoria.jsx';
import Login from './componentes/Login.jsx';
import Registro from './componentes/Registro.jsx';
import NuevoSaldo from './componentes/Nuevosaldo.jsx'; // Importa el nuevo componente NuevoSaldo
import { Route, Routes } from 'react-router-dom';
import RutaPrivada from "./componentes/RutaPrivada.jsx";

const Layout = () => {
  return (
    <div className="layout-container">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        
        {/* Ruta para las categorías, lista de gastos, editar y la app principal, protegidas */}
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

        {/* Ruta para el perfil donde se podrá ver y actualizar el saldo */}
        <Route path="/perfil" element={
          <RutaPrivada>
            <NuevoSaldo />
          </RutaPrivada>
        } />
        
        {/* Ruta principal de la app, protegida */}
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
