import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHome, faUtensils, faBus, faHeart, faTshirt, faShoppingCart, faGamepad, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../contextos/AuthContext";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { formatearCantidad } from "../componentes/TotalGastado";
import { format, fromUnixTime } from "date-fns";
import { es } from "date-fns/locale/es";
import "../style/categoria.css";

// Agregar iconos a la librería
library.add(faHome, faUtensils, faBus, faHeart, faTshirt, faShoppingCart, faGamepad, faArrowLeft);

const categorias = [
    { nombre: "comida", icono: faUtensils },
    { nombre: "cuentas y pagos", icono: faFileInvoiceDollar },
    { nombre: "hogar", icono: faHome },
    { nombre: "transporte", icono: faBus },
    { nombre: "ropa", icono: faTshirt },
    { nombre: "salud e higiene", icono: faHeart },
    { nombre: "compras", icono: faShoppingCart },
    { nombre: "diversion", icono: faGamepad },
];

const GastosCategoria = () => {
    const navigate = useNavigate();
    const { usuario } = useAuth();
    const [gastosPorCategoria, setGastosPorCategoria] = useState({});
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

    useEffect(() => {
        if (!usuario) return;

        const consulta = query(
            collection(db, "gastos"),
            where("uidusuario", "==", usuario.uid)
        );

        const unsuscribe = onSnapshot(consulta, (snapshot) => {
            const gastosAgrupados = {};
            snapshot.docs.forEach((doc) => {
                const data = doc.data();
                const { categoria, cantidad, fecha, descripcion } = data;

                if (!gastosAgrupados[categoria]) {
                    gastosAgrupados[categoria] = { total: 0, detalles: [] };
                }

                gastosAgrupados[categoria].total += parseFloat(cantidad);
                gastosAgrupados[categoria].detalles.push({
                    id: doc.id,
                    fecha,
                    descripcion,
                    cantidad,
                });
            });

            setGastosPorCategoria(gastosAgrupados);
        });

        return unsuscribe;
    }, [usuario]);

    const formatearFecha = (fecha) => {
        return format(fromUnixTime(fecha), "dd 'de' MMMM 'de' yyyy", { locale: es });
    };

    return (
        <div className="categoria-container">
            <div className="categoria-header">
                <button onClick={() => navigate("/")} className="categoria-button">
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <h1 className="categoria-titulo">Gastos por Categoría</h1>
            </div>

            <div className="categorias-lista">
                {categorias.map((categoria) => {
                    const { nombre, icono } = categoria;
                    const total = gastosPorCategoria[nombre]?.total || 0;

                    return (
                        <div key={nombre} className="categoria-item">
                            <div className="categoria-contai-cate">
                                <div className="categoria-info" onClick={() => setCategoriaSeleccionada(categoriaSeleccionada === nombre ? null : nombre)}>
                                    <FontAwesomeIcon icon={icono} />
                                    <span>{nombre}</span>
                                </div>
                                <span className="categoria-total">{formatearCantidad(total)}</span>
                            </div>
                            <div>
                            {categoriaSeleccionada === nombre && (
                                <div className="categoria-detalle">
                                    {gastosPorCategoria[nombre]?.detalles.length > 0 ? (
                                        Object.entries(
                                            gastosPorCategoria[nombre].detalles.reduce((agrupados, gasto) => {
                                                const fecha = formatearFecha(gasto.fecha);
                                                if (!agrupados[fecha]) {
                                                    agrupados[fecha] = [];
                                                }
                                                agrupados[fecha].push(gasto);
                                                return agrupados;
                                            }, {})
                                        ).map(([fecha, gastos]) => (
                                            <div key={fecha} className="categoria-detalle-fecha">
                                                <h3>{fecha}</h3>
                                                {gastos.map((gasto) => (
                                                    <div key={gasto.id} className="detalle-item">
                                                        <span>{gasto.descripcion}</span>
                                                        <span>{formatearCantidad(gasto.cantidad)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ))
                                    ) : (
                                        <p>No hay gastos para esta categoría</p>
                                    )}
                                </div>
                            )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GastosCategoria;
