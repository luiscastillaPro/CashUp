import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils, faFileInvoiceDollar, faHome, faBus, faTshirt, faHeart, faShoppingCart, faGamepad, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import "../style/select.css";

const Select = ({ categoria, setCategoria }) => {
    const [mostrar, setMostrar] = useState(false);

    const categorias = [
        { id: "comida", texto: "Comida", icon: faUtensils },
        { id: "cuentas y pagos", texto: "Cuentas y pagos", icon: faFileInvoiceDollar },
        { id: "hogar", texto: "Hogar", icon: faHome },
        { id: "transporte", texto: "Transporte", icon: faBus },
        { id: "ropa", texto: "Ropa", icon: faTshirt },
        { id: "salud e higiene", texto: "Salud e Higiene", icon: faHeart },
        { id: "compras", texto: "Compras", icon: faShoppingCart },
        { id: "diversion", texto: "Diversión", icon: faGamepad },
    ];

    const categoriaSeleccionada = categorias.find((cat) => cat.id === categoria);

    const handleClick = (e) => {
        setCategoria(e.currentTarget.dataset.valor);
        setMostrar(false);
    };

    return (
        <div className="select-container">
            <div onClick={() => setMostrar(!mostrar)} className="select-init">
                <div>
                    {categoriaSeleccionada && (
                        <FontAwesomeIcon
                            icon={categoriaSeleccionada.icon}
                            className="select-icon"
                        />
                    )}
                    <span>{categoriaSeleccionada ? categoriaSeleccionada.texto : "Selecciona una categoría"}</span>
                </div>
                <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`select-arrow ${mostrar ? "rotate" : ""}`}
                />
            </div>

            {mostrar && (
                <div className="select-list">
                    {categorias.map((cat) => (
                        <div
                            className="select-item"
                            key={cat.id}
                            onClick={handleClick}
                            data-valor={cat.id}
                        >
                            <FontAwesomeIcon
                                icon={cat.icon}
                                className="select-icon"
                            />
                            {cat.texto}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Select;
