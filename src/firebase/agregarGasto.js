import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const agregarGasto = ({categoria, fecha, cantidad, descripcion, uidusuario}) => {
    return addDoc(collection(db, 'gastos'), {
        categoria: categoria,
        descripcion: descripcion,
        cantidad: Number(cantidad),
        fecha: fecha,
        uidusuario: uidusuario
    });
}

export default agregarGasto;