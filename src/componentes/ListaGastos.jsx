import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { db } from '../firebase/firebaseConfig';
import { useAuth } from '../contextos/AuthContext';
import { formatearCantidad } from '../componentes/TotalGastado';
import { format, fromUnixTime } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { collection, onSnapshot, query, orderBy, where, limit, startAfter } from "firebase/firestore";
import '../style/listaGastos.css';
import borrarGasto from "../firebase/borrarGasto";

const ListaGastos = () => {
    const navigate = useNavigate();
    const [gastos, setGastos] = useState([]);
    const { usuario } = useAuth();
    const [ultimoGasto, setUltimoGasto] = useState([]);
    const [cargarMas, setCargarMas] = useState(false);

    const obtenerMasGastos = () => {
        const consulta = query(
            collection(db, 'gastos'),
            where('uidusuario', '==', usuario.uid),
            orderBy('fecha', 'desc'),
            limit(10),
            startAfter(ultimoGasto)
        );

        onSnapshot(consulta, (snapshot) => {
            if (snapshot.docs.length > 0) {
                setUltimoGasto(snapshot.docs[snapshot.docs.length - 1]);
                setGastos(gastos.concat(snapshot.docs.map((gasto) => {
                    return { ...gasto.data(), id: gasto.id }
                })))
            } else {
                setCargarMas(false);
            }
        }, error => { console.log(error) });
    }

    useEffect(() => {
        if (usuario) {
            const consulta = query(
                collection(db, 'gastos'),
                where('uidusuario', '==', usuario.uid),
                orderBy('fecha', 'desc'),
                limit(10)
            );

            const unsuscribe = onSnapshot(
                consulta,
                (snapshot) => {
                    if (snapshot.docs.length > 0) {
                        setUltimoGasto(snapshot.docs[snapshot.docs.length - 1]);
                        setCargarMas(true);
                    } else {
                        setCargarMas(false);
                    }

                    setGastos(snapshot.docs.map((gasto) => ({
                        ...gasto.data(),
                        id: gasto.id
                    })));
                },
                (error) => {
                    console.error("Error al obtener los gastos:", error);
                }
            );

            return unsuscribe;
        }
    }, [usuario]);

    const formatearFecha = (fecha) => {
        return format(fromUnixTime(fecha), "dd 'de' MMMM 'de' yyyy", { locale: es });
    };

    const agruparGastosPorFecha = (gastos) => {
        return gastos.reduce((grupo, gasto) => {
            const fechaFormateada = formatearFecha(gasto.fecha);
            if (!grupo[fechaFormateada]) {
                grupo[fechaFormateada] = [];
            }
            grupo[fechaFormateada].push(gasto);
            return grupo;
        }, {});
    };

    const gastosAgrupados = agruparGastosPorFecha(gastos);

    return (
        <div className="lista-container">
            <div className="lista-navbar">
                <button onClick={() => navigate('/')} className="categoria-button">
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <h1 className="lista-titulo">Gastos por Fecha</h1>
            </div>
            <div className="lista-container-gasto">
                {Object.keys(gastosAgrupados).length > 0 ? (
                    Object.keys(gastosAgrupados).map((fecha, index) => (
                        <div key={index} className="lista-fecha">
                            <h2>{fecha}</h2>
                            {gastosAgrupados[fecha].map((gasto) => (
                                <div key={gasto.id} className="lista-contact">
                                    <div className="lista-contatin-opciones">
                                        <div
                                            className="lista-categoria"
                                            data-categoria={gasto.categoria || "otros"}
                                        >
                                            {gasto.categoria || "Sin categoría"}
                                        </div>
                                        <div className="lista-descripcion">{gasto.descripcion || "Sin descripción"}</div>
                                        <div className="lista-cantidad">{formatearCantidad(gasto.cantidad || 0)}</div>
                                        <div className="lista-botones">
                                            <button
                                                className="lista-editar"
                                                onClick={() => navigate(`/editar/${gasto.id}`)}
                                            >
                                                <FontAwesomeIcon icon={faPen} />
                                            </button>
                                            <button 
                                                className="lista-eliminar" 
                                                onClick={() => borrarGasto(gasto.id)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <p className="lista-sinregistro">No tienes gastos registrados.</p>
                )}
                {cargarMas &&
                    <button className="lista-cargar" onClick={() => obtenerMasGastos()}>Cargar Más</button>
                }
            </div>
        </div>
    );
};

export default ListaGastos;
