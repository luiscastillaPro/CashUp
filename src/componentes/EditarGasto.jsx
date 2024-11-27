import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import Header from "./Header.jsx";
import Select from "./Select.jsx";
import DatePicker from "./DatePicker.jsx";
import { getUnixTime } from "date-fns";
import { useAuth } from "../contextos/AuthContext";

const EditarGasto = () => {
    const { id } = useParams(); // Obtiene el ID del gasto desde la URL
    const navigate = useNavigate();
    const { usuario } = useAuth();

    const [descripcion, setDescripcion] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [categoria, setCategoria] = useState('Hogar');
    const [fecha, setFecha] = useState(new Date());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerGasto = async () => {
            try {
                if (!usuario) return;
                const docRef = doc(db, "gastos", id);
                const gasto = await getDoc(docRef);

                if (gasto.exists() && gasto.data().uidusuario === usuario.uid) {
                    const datos = gasto.data();
                    setDescripcion(datos.descripcion);
                    setCantidad(datos.cantidad);
                    setCategoria(datos.categoria);
                    setFecha(new Date(datos.fecha * 1000)); // Convertir Unix a Date
                } else {
                    console.error("No se encontró el gasto o no tienes permiso para editarlo.");
                    navigate("/lista"); // Redirige si no puede acceder al gasto
                }
            } catch (error) {
                console.error("Error al obtener el gasto:", error);
            } finally {
                setLoading(false);
            }
        };

        obtenerGasto();
    }, [id, usuario, navigate]);

    const handleChange = (e) => {
        if (e.target.name === "Descripcion") {
            setDescripcion(e.target.value);
        } else if (e.target.name === "cantidad") {
            setCantidad(e.target.value.replace(/[^0-9.]/g, "")); // Solo permite números y punto decimal
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!descripcion || !cantidad || isNaN(cantidad)) {
                console.error("Todos los campos son obligatorios y la cantidad debe ser un número.");
                return;
            }

            const docRef = doc(db, "gastos", id);
            await updateDoc(docRef, {
                descripcion,
                cantidad: parseFloat(cantidad).toFixed(2),
                categoria,
                fecha: getUnixTime(fecha),
            });

            console.log("Gasto actualizado correctamente.");
            navigate("/lista"); // Redirige a la lista de gastos
        } catch (error) {
            console.error("Error al actualizar el gasto:", error);
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <Header />
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
                <button type="submit" className="guardar-cambios">
                    Guardar Cambios
                </button>
            </form>
        </div>
    );
};

export default EditarGasto;
