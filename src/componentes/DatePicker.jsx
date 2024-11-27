import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import format from "date-fns/format";
import { startOfMonth, endOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import "../style/datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const DatePicker = ({ fecha, setFecha }) => {
    const [visible, setVisible] = useState(false);

    const today = new Date();
    const firstDayOfMonth = startOfMonth(today);
    const lastDayOfMonth = endOfMonth(today);

    const formattedDate = (fecha = new Date()) => {
        return format(fecha, `dd 'de' MMMM 'de' yyyy`, { locale: es });
    };

    return (
        <div className="date-container">
            <div className="date-picker-wrapper">
                <input
                    className="date-picker-toggle"
                    type="text"
                    readOnly
                    value={formattedDate(fecha)}
                    onClick={() => setVisible(!visible)}
                />
                <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`date-picker-icon ${visible ? "rotate" : ""}`}
                />
            </div>

            {visible && (
                <DayPicker
                    mode="single"
                    selected={fecha}
                    onSelect={setFecha}
                    locale={es}
                    className="dale-calendario"
                    defaultMonth={today}
                    fromDate={firstDayOfMonth}
                    toDate={lastDayOfMonth}
                />
            )}
        </div>
    );
};

export default DatePicker;
