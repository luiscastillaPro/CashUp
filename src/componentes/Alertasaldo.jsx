import React, { useState, useEffect } from "react";
import "../style/alertasaldo.css";
import { db } from "../firebase/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../contextos/AuthContext";

const Alertasaldo = ({ gastosTotal }) => {
  const [montoMaximo, setMontoMaximo] = useState(0);
  const [porcentajeGasto, setPorcentajeGasto] = useState(0);
  const { usuario } = useAuth();

  // Leer el monto máximo desde Firestore
  useEffect(() => {
    const obtenerMontoMaximo = async () => {
      if (usuario && usuario.uid) {
        try {
          const docRef = doc(db, "usuarios", usuario.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setMontoMaximo(data.montoMaximo || 0);
          }
        } catch (error) {
          console.error("Error al obtener el monto máximo:", error);
        }
      }
    };
    obtenerMontoMaximo();
  }, [usuario]);

  // Calcular porcentaje de gasto
  useEffect(() => {
    if (montoMaximo > 0) {
      const porcentaje = (gastosTotal / montoMaximo) * 100;
      setPorcentajeGasto(Math.min(porcentaje, 100)); // Limita el porcentaje al 100%
    }
  }, [gastosTotal, montoMaximo]);

  // Guardar el monto máximo en Firestore
  const handleMontoMaximoChange = async (e) => {
    const nuevoMonto = Number(e.target.value);
    setMontoMaximo(nuevoMonto);

    if (usuario && usuario.uid) {
      try {
        const docRef = doc(db, "usuarios", usuario.uid);
        await setDoc(docRef, { montoMaximo: nuevoMonto }, { merge: true });
      } catch (error) {
        console.error("Error al guardar el monto máximo:", error);
      }
    }
  };

  const calcularColorGradual = () => {
    if (porcentajeGasto <= 50) {
      const verde = [76, 175, 80];
      const amarillo = [255, 235, 59];
      const factor = porcentajeGasto / 50;
      return `rgb(
        ${Math.round(verde[0] + (amarillo[0] - verde[0]) * factor)},
        ${Math.round(verde[1] + (amarillo[1] - verde[1]) * factor)},
        ${Math.round(verde[2] + (amarillo[2] - verde[2]) * factor)}
      )`;
    } else {
      const amarillo = [255, 235, 59];
      const rojo = [244, 67, 54];
      const factor = (porcentajeGasto - 50) / 50;
      return `rgb(
        ${Math.round(amarillo[0] + (rojo[0] - amarillo[0]) * factor)},
        ${Math.round(amarillo[1] + (rojo[1] - amarillo[1]) * factor)},
        ${Math.round(amarillo[2] + (rojo[2] - amarillo[2]) * factor)}
      )`;
    }
  };

  return (
    <div className="alerta-saldo-container">
      <label className="titulo-maximo" htmlFor="montoMaximo">Monto máximo para el mes:</label>
      <input
        type="number"
        id="montoMaximo"
        value={montoMaximo}
        onChange={handleMontoMaximoChange}
        placeholder="Ingrese el monto máximo"
        className="input-monto-maximo"
      />
      <div
        className="alerta-saldo-indicador"
        style={{
          backgroundColor: calcularColorGradual(),
          color: "#fff",
          transition: "background-color 0.5s ease",
        }}
      >
        {montoMaximo > 0 && (
          <div className="marquee">
            <p>Gasto actual: ${gastosTotal.toFixed(2)}</p>
            <p>Monto máximo: ${montoMaximo.toFixed(2)}</p>
            <p>Porcentaje gastado: {porcentajeGasto.toFixed(2)}%</p>
            <p>Gasto actual: ${gastosTotal.toFixed(2)}</p>
            <p>Monto máximo: ${montoMaximo.toFixed(2)}</p>
            <p>Porcentaje gastado: {porcentajeGasto.toFixed(2)}%</p>
            <p>Gasto actual: ${gastosTotal.toFixed(2)}</p>
            <p>Monto máximo: ${montoMaximo.toFixed(2)}</p>
            <p>Porcentaje gastado: {porcentajeGasto.toFixed(2)}%</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alertasaldo;
