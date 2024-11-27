import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.css';
import Layout from './Layout';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contextos/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <React.StrictMode>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </React.StrictMode>
  </AuthProvider>
);

