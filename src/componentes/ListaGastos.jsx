import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPen, faTrash, faChevronDown, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../contextos/AuthContext";
import { formatearCantidad } from "../componentes/TotalGastado";
import { format, fromUnixTime } from "date-fns";
import { es } from "date-fns/locale/es";
import { collection, onSnapshot, query, orderBy, where, limit, startAfter, doc, updateDoc } from "firebase/firestore";
import borrarGasto from "../firebase/borrarGasto";
import Header from "./Header";
import "../style/listaGastos.css";
import { faUtensils, faFileInvoiceDollar, faHome, faBus, faTshirt, faHeart, faShoppingCart, faGamepad } from "@fortawesome/free-solid-svg-icons";
// Agregar iconos a la librería
library.add(faCheck, faTimes, faUtensils, faFileInvoiceDollar, faHome, faBus, faTshirt, faHeart, faShoppingCart, faGamepad);
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
const ListaGastos = () => {
    const navigate = useNavigate();
    const [gastos, setGastos] = useState([]);
    const { usuario } = useAuth();
    const [ultimoGasto, setUltimoGasto] = useState([]);
    const [cargarMas, setCargarMas] = useState(false);
    const [gastoEditando, setGastoEditando] = useState(null);
    const [editData, setEditData] = useState({});
    const obtenerMasGastos = () => {
        const consulta = query(
            collection(db, "gastos"),
            where("uidusuario", "==", usuario.uid),
            orderBy("fecha", "desc"),
            limit(10),
            startAfter(ultimoGasto)
        );
        onSnapshot(
            consulta,
            (snapshot) => {
                if (snapshot.docs.length > 0) {
                    setUltimoGasto(snapshot.docs[snapshot.docs.length - 1]);
                    setGastos(
                        gastos.concat(
                            snapshot.docs.map((gasto) => ({
                                ...gasto.data(),
                                id: gasto.id,
                            }))
                        )
                    );
                } else {
                    setCargarMas(false);
                }
            },
            (error) => {
                console.log(error);
            }
        );
    };
    useEffect(() => {
        if (usuario) {
            const consulta = query(
                collection(db, "gastos"),
                where("uidusuario", "==", usuario.uid),
                orderBy("fecha", "desc"),
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
                    setGastos(
                        snapshot.docs.map((gasto) => ({
                            ...gasto.data(),
                            id: gasto.id,
                        }))
                    );
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
    const iniciarEdicion = (gasto) => {
        setGastoEditando(gasto.id);
        setEditData(gasto);
    };
    const cancelarEdicion = () => {
        setGastoEditando(null);
        setEditData({});
    };
    const guardarCambios = async () => {
        try {
            const docRef = doc(db, "gastos", gastoEditando);
            await updateDoc(docRef, {
                descripcion: editData.descripcion,
                cantidad: parseFloat(editData.cantidad).toFixed(2),
                categoria: editData.categoria,
            });
            setGastoEditando(null);
        } catch (error) {
            console.error("Error al guardar cambios:", error);
        }
    };

    const obtenerIconoCategoria = (categoria) => {
        const categoriaEncontrada = categorias.find((cat) => cat.nombre === categoria);
        return categoriaEncontrada ? categoriaEncontrada.icono : null;
    };

    const manejarCambio = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };
    const gastosAgrupados = agruparGastosPorFecha(gastos);
    return (
        <div className="invisible">
            <Header />
            <div className="lista-container">
                <div className="lista-navbar">
                    <button onClick={() => navigate("/")} className="categoria-button">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <h1 className="lista-titulo">Gastos por Fecha</h1>
                </div>
                <div className="lista-container-gasto">
                    {Object.keys(gastosAgrupados).length > 0 ? (
                        Object.keys(gastosAgrupados).map((fecha, index) => (
                            <div key={index} className="lista-fecha">
                                <h2 className="lista-fecha-titulo">{fecha}</h2>
                                {gastosAgrupados[fecha].map((gasto) => (
                                    <div key={gasto.id} className="lista-item">
                                        {gastoEditando === gasto.id ? (
                                            <div className="lista-editar-form">
                                                <select
                                                    name="categoria"
                                                    value={editData.categoria}
                                                    onChange={manejarCambio}
                                                    className="editar-categoriaa"
                                                >
                                                    {categorias.map((cat) => (
                                                        <option key={cat.nombre} value={cat.nombre}>
                                                            {cat.nombre}
                                                        </option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="text"
                                                    name="descripcion"
                                                    value={editData.descripcion}
                                                    onChange={manejarCambio}
                                                    placeholder="Descripción"
                                                    className="editar-descripcion"
                                                />
                                                <div className="contenedor-editar-botones">
                                                    <input
                                                        type="text"
                                                        name="cantidad"
                                                        value={editData.cantidad}
                                                        onChange={manejarCambio}
                                                        placeholder="$0.00"
                                                        className="editar-cantidad"
                                                    />

                                                    <button onClick={guardarCambios} className="lista-editar">
                                                        <FontAwesomeIcon icon={faCheck} />
                                                    </button>
                                                    <button onClick={cancelarEdicion} className="lista-eliminar">
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </button>

                                                </div>
                                            </div>
                                        ) : (
                                            <div className="lista-detalle">
                                                <span className="lista-icono">
                                                    {obtenerIconoCategoria(gasto.categoria) && (
                                                        <FontAwesomeIcon icon={obtenerIconoCategoria(gasto.categoria)} />
                                                    )}
                                                </span>
                                                <span className="lista-categoria">{gasto.categoria || "Sin categoría"}</span> {/* Mostrar la categoría */}
                                                <span className="lista-descripcion">{gasto.descripcion || "Sin descripción"}</span>
                                                <span className="lista-cantidad">{formatearCantidad(gasto.cantidad || 0)}</span>
                                                <div className="lista-acciones">
                                                    <button
                                                        className="lista-editar"
                                                        onClick={() => iniciarEdicion(gasto)}
                                                    >
                                                        <FontAwesomeIcon icon={faPen} />
                                                    </button>
                                                    <button
                                                        className="lista-eliminar"
                                                        onClick={() => borrarGasto(gasto.id)}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <p className="lista-sinregistro">No tienes gastos registrados.</p>
                    )}
                    {cargarMas && (
                        <button className="categoria-volver-bitin" onClick={() => obtenerMasGastos()}>
                            <FontAwesomeIcon icon={faChevronDown} className="cargar-mas-boton" />
                            Cargar Más
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
export default ListaGastos;