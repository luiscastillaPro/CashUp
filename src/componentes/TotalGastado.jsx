// TotalGasto.jsx
import React from "react";

export const formatearCantidad = (cantidad) => {
    return new Intl.NumberFormat(
        'en-US',
        { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }
    ).format(cantidad);
};

const TotalGasto = ({ saldo }) => {
    return (
        <div>
            <p>{formatearCantidad(saldo)}</p>
        </div>
    );
};

export default TotalGasto;
