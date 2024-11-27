import React, { useState } from "react";
import { db } from '../firebase/firebaseConfig';
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../contextos/AuthContext";

const NuevoSaldo = ({ actualizarSaldoTotal }) => {
    const [mostrarFormulario, setMostrarFormulario] = useState(null); // Controla qué formulario se muestra
    const [descripcion, setDescripcion] = useState(''); // Estado para descripción del ingreso
    const [valor, setValor] = useState(''); // Estado para el valor ingresado
    const [nuevoSaldo, setNuevoSaldo] = useState(''); // Estado para el saldo a actualizar
    const { usuario } = useAuth(); // Obtener usuario del contexto

    // Maneja el envío del formulario de "Ingresar Nuevo Valor"
    const handleIngresarValor = async (e) => {
        e.preventDefault();

        if (!usuario || !usuario.uid) {
            alert("Debes iniciar sesión para ingresar un nuevo valor.");
            return;
        }

        const valorNumerico = parseFloat(valor);
        if (!isNaN(valorNumerico) && descripcion.trim() !== '') {
            try {
                const docRef = doc(db, "ingresos", usuario.uid); // Supongamos que los ingresos van a una colección "ingresos"
                await setDoc(docRef, { descripcion, valor: valorNumerico }, { merge: true }); // Guardar descripción y valor
                alert("Nuevo valor ingresado correctamente.");
                setDescripcion('');
                setValor('');
                setMostrarFormulario(null); // Oculta el formulario
            } catch (error) {
                console.error("Error al ingresar el valor:", error);
            }
        } else {
            alert("Por favor ingresa una descripción y un valor válido.");
        }
    };

    // Maneja el envío del formulario de "Actualizar Saldo"
    const handleActualizarSaldo = async (e) => {
        e.preventDefault();

        if (!usuario || !usuario.uid) {
            alert("Debes iniciar sesión para actualizar el saldo.");
            return;
        }

        const saldoNumerico = parseFloat(nuevoSaldo);
        if (!isNaN(saldoNumerico)) {
            try {
                const docRef = doc(db, "usuarios", usuario.uid); // Actualiza el saldo en la colección "usuarios"
                await setDoc(docRef, { saldo: saldoNumerico }, { merge: true });
                alert("Saldo actualizado correctamente.");
                setNuevoSaldo('');
                setMostrarFormulario(null); // Oculta el formulario
                actualizarSaldoTotal(saldoNumerico); // Llama a la función para actualizar el saldo en App.jsx
            } catch (error) {
                console.error("Error al actualizar el saldo:", error);
            }
        } else {
            alert("Ingresa un valor válido para el saldo.");
        }
    };

    return (
        <div>
            <h2>Gestión de Saldo</h2>
            <div>
                <button onClick={() => setMostrarFormulario('ingresarValor')}>
                    Ingresar Nuevo Valor
                </button>
                <button onClick={() => setMostrarFormulario('actualizarSaldo')}>
                    Actualizar Saldo
                </button>
            </div>

            {mostrarFormulario === 'ingresarValor' && (
                <form onSubmit={handleIngresarValor}>
                    <div>
                        <input
                            type="text"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Descripción"
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            placeholder="Valor"
                        />
                    </div>
                    <button type="submit">Guardar</button>
                </form>
            )}

            {mostrarFormulario === 'actualizarSaldo' && (
                <form onSubmit={handleActualizarSaldo}>
                    <div>
                        <input
                            type="number"
                            value={nuevoSaldo}
                            onChange={(e) => setNuevoSaldo(e.target.value)}
                            placeholder="Nuevo saldo"
                        />
                    </div>
                    <button type="submit">Confirmar</button>
                </form>
            )}
        </div>
    );
};

export default NuevoSaldo;
