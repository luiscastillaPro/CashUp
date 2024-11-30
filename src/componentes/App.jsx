import React, { useState, useEffect } from "react";
import Header from './Header.jsx';
import Select from "./Select.jsx";
import DatePicker from "./DatePicker.jsx";
import agregarGasto from "../firebase/agregarGasto.js";
import { getUnixTime } from "date-fns/getUnixTime";
import { useAuth } from '../contextos/AuthContext.js';
import { obtenerGastos } from "../firebase/obtenerGastos.js";
import { db } from '../firebase/firebaseConfig';
import '../style/app.css';
import { doc, getDoc } from "firebase/firestore";

const App = () => {
    const [descripcion, setDescripcion] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [categoria, setCategoria] = useState('Hogar');
    const [fecha, setFecha] = useState(new Date());
    const [gastos, setGastos] = useState([]);
    const [saldoTotal, setSaldoTotal] = useState(0); 
    const [saldoActual, setSaldoActual] = useState(0);
    const { usuario } = useAuth();

    useEffect(() => {
        if (usuario && usuario.uid) {
            obtenerGastos(usuario.uid)
                .then(gastos => {
                    setGastos(gastos);  // Establece los gastos obtenidos
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
                        setSaldoTotal(saldo); // Establece el saldo total del usuario
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
        setSaldoActual(saldoRestante); // Establece el saldo actual
    }, [gastos, saldoTotal]);

    const handleChange = (e) => {
        if (e.target.name === 'Descripcion') {
            setDescripcion(e.target.value);
        } else if (e.target.name === 'cantidad') {
            setCantidad(e.target.value.replace(/[^0-9.]/g, ''));  // Filtra solo números y puntos
        }
    };

    const obtenerSaldoUsuario = async (uid) => {
        try {
            const docRef = doc(db, "usuarios", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const saldo = docSnap.data().saldo || 0;
                actualizarSaldoTotal(saldo); // Actualiza el saldo localmente
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
                    fecha: getUnixTime(fecha),  // Convierte la fecha a formato UNIX
                    uidusuario: usuario.uid  // Asegúrate de que esto no sea undefined
                })
                .then(() => {
                    // Actualiza el saldo total después de agregar el gasto
                    obtenerSaldoUsuario(usuario.uid);
                    
                    setCategoria('Hogar');
                    setDescripcion('');
                    setCantidad('');
                    setFecha(new Date());
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
        setSaldoTotal(nuevoSaldo);  // Actualiza el saldo total localmente
    };

    // Calcular el total de los ingresos
    const ingresos = saldoTotal;

    // Calcular el total de los gastos
    const gastosTotal = gastos.reduce((total, gasto) => total + parseFloat(gasto.cantidad || 0), 0);

    // Calcular el balance (ingresos - gastos)
    const balance = ingresos - gastosTotal;

    return (
        <div>
            <Header />
            <div className="app-contain-principal">
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
                    <div className="titul-agregar">
                        <h2>Agregar Nuevo Gasto</h2>
                    </div>
                    <div className="App-filtrado">
                        <Select categoria={categoria} setCategoria={setCategoria} />
                        <DatePicker fecha={fecha} setFecha={setFecha} />
                    </div>
                    <form className="registro-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                name="Descripcion"
                                value={descripcion}
                                onChange={handleChange}
                                placeholder="Descripción"
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="cantidad"
                                value={cantidad}
                                onChange={handleChange}
                                placeholder="$0.00"
                            />
                        </div>
                        <button type="submit" className="btn-agregar-gasto">
                            Agregar Gasto
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default App;
