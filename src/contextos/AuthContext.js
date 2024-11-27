import React, { useContext, useEffect, useState } from "react";
import {auth} from '../firebase/firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";

const AuthContext =  React.createContext();

const useAuth = () => {
    return useContext(AuthContext);
}

const AuthProvider = ({children}) => {
    const [usuario, setUsuario] = useState();
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cancelarSuscripcion = onAuthStateChanged(auth,(usuario) => {
            setUsuario(usuario);
            setCargando(false);
        });

        return cancelarSuscripcion;
    },[]);

    return (
        <AuthContext.Provider value={{usuario}}>
            {!cargando && children}
        </AuthContext.Provider>
    );
}

export  {AuthProvider, AuthContext, useAuth};