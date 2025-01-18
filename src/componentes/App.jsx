import React, { useState, useEffect } from "react";
import Header from './Header.jsx';
import Select from "./Select.jsx";
import agregarGasto from "../firebase/agregarGasto.js";
import { getUnixTime } from "date-fns/getUnixTime";
import { useAuth } from '../contextos/AuthContext.js';
import { obtenerGastos } from "../firebase/obtenerGastos.js";
import { db } from '../firebase/firebaseConfig';
import '../style/app.css';
import { doc, getDoc } from "firebase/firestore";
import imagen1 from "../imagenes/imagen 1.png";
import imagen2 from "../imagenes/imagen2.png";
import Alertasaldo from "./Alertasaldo.jsx";

const App = () => {
    const [descripcion, setDescripcion] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [categoria, setCategoria] = useState('Hogar');
    const [fecha, setFecha] = useState(new Date());
    const [gastos, setGastos] = useState([]);
    const [saldoTotal, setSaldoTotal] = useState(0);
    const [saldoActual, setSaldoActual] = useState(0);
    const [mensajeExito, setMensajeExito] = useState(''); // Estado para el mensaje de éxito
    const { usuario } = useAuth();

    useEffect(() => {
        if (usuario && usuario.uid) {
            obtenerGastos(usuario.uid)
                .then(gastos => {
                    setGastos(gastos);
                })
                .catch(error => console.log(error));
        }
    }, [usuario]);

    useEffect(() => {
        if (usuario && usuario.uid) {
            const getSaldo = async () => {
                try {
                    const docRef = doc(db, "usuarios", usuario.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const saldo = docSnap.data().saldo || 0;
                        setSaldoTotal(saldo);
                    }
                } catch (error) {
                    console.error("Error al obtener el saldo:", error);
                }
            };
            getSaldo();
        }
    }, [usuario]);

    useEffect(() => {
        const saldoGastos = gastos.reduce((total, gasto) => total + parseFloat(gasto.cantidad || 0), 0);
        const saldoRestante = saldoTotal - saldoGastos;
        setSaldoActual(saldoRestante);
    }, [gastos, saldoTotal]);

    const handleChange = (e) => {
        if (e.target.name === 'Descripcion') {
            setDescripcion(e.target.value);
        } else if (e.target.name === 'cantidad') {
            setCantidad(e.target.value.replace(/[^0-9.]/g, ''));
        }
    };

    const obtenerSaldoUsuario = async (uid) => {
        try {
            const docRef = doc(db, "usuarios", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const saldo = docSnap.data().saldo || 0;
                actualizarSaldoTotal(saldo);
            }
        } catch (error) {
            console.error("Error al obtener el saldo:", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let canti = parseFloat(cantidad);

        if (!usuario || !usuario.uid) {
            alert("Debes iniciar sesión para agregar un gasto.");
            return;
        }

        if (descripcion !== '' && cantidad !== '') {
            if (canti) {
                agregarGasto({
                    categoria: categoria,
                    descripcion: descripcion,
                    cantidad: canti,
                    fecha: getUnixTime(fecha),
                    uidusuario: usuario.uid
                })
                    .then(() => {
                        obtenerSaldoUsuario(usuario.uid);

                        setCategoria('Hogar');
                        setDescripcion('');
                        setCantidad('');
                        setFecha(new Date());

                        // Mostrar mensaje de éxito
                        setMensajeExito("El gasto fue ingresado con éxito!");
                        setTimeout(() => setMensajeExito(''), 3000); // Oculta el mensaje después de 3 segundos
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                console.log('Debes ingresar valores correctos');
            }
        } else {
            console.log('Agrega todos los valores');
        }
    };

    const actualizarSaldoTotal = (nuevoSaldo) => {
        setSaldoTotal(nuevoSaldo);
    };

    const ingresos = saldoTotal;
    const gastosTotal = gastos.reduce((total, gasto) => total + parseFloat(gasto.cantidad || 0), 0);
    const balance = ingresos - gastosTotal;

    return (
        <div className="invisible">
            <Header />

            <div className="app-contain-principal">
                {mensajeExito && (
                    <div className="mensaje-exito">
                        {mensajeExito}
                    </div>
                )}
                <div className="app-contain-saldos">
                    <div className="saldo-totalito">
                        <p className="titulo-ingresado">Ingresos</p>
                        <div className="saldo-total">$ {ingresos.toFixed(2)}</div> {/* Muestra los ingresos */}
                    </div>
                    <div className="saldo-totalito">
                        <p className="titulo-ingresado">Gastos</p>
                        <div className="saldo-total1">- $ {gastosTotal.toFixed(2)}</div> {/* Muestra los gastos */}
                    </div>
                    <div className="saldo-totalito">
                        <p className="titulo-ingresado">Balance</p>
                        <div className="saldo-total2">$ {balance.toFixed(2)}</div> {/* Muestra el balance */}
                    </div>
                </div>

                <div className="seccion-gasto">
                    <div className="App-filtrado">
                        <Select categoria={categoria} setCategoria={setCategoria} />
                        <h2 className="titul-agregar">Nuevo Gasto</h2>
                        <input
                            type="date"
                            value={fecha.toISOString().split('T')[0]} // Convierte la fecha al formato YYYY-MM-DD
                            onChange={(e) => setFecha(new Date(e.target.value))}
                            className="input-fecha"
                        />
                    </div>
                    <div className="contan-imaginis">
                        <div>
                            <img src={imagen2} alt="Imagen debajo" className="imagen-debajo" />
                        </div>
                        <form className="registro-form-ingreso" onSubmit={handleSubmit}>
                            <div className="form-group-ingres">
                                <div className="input-con-imagen">
                                    <input
                                        type="text"
                                        name="Descripcion"
                                        value={descripcion}
                                        onChange={handleChange}
                                        placeholder="Descripción"
                                        className="input-ingreso"
                                    />
                                </div>
                            </div>
                            <div className="form-group-ingres">
                                <div className="input-con-imagen">
                                    <input
                                        type="text"
                                        name="cantidad"
                                        value={cantidad}
                                        onChange={handleChange}
                                        placeholder="$0.00"
                                        className="input-ingreso"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-agregar-gasto">Agregar Gasto</button>
                        </form>
                        <div className="imagen-debajo">
                            <img src={imagen1} alt="Imagen debajo" className="imagen-debajo-formulario" />
                        </div>
                    </div>

                </div>
            </div>
            <Alertasaldo gastosTotal={gastosTotal} className="alerta-fija" />
        </div>
    );
};

export default App;
