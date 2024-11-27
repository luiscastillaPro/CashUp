// obtenerGastos.js
import { db } from './firebaseConfig'; // Asegúrate de importar la instancia db
import { collection, getDocs, query, where } from 'firebase/firestore'; // Importa las funciones directamente de Firestore

export const obtenerGastos = async (uid) => {
    try {
        const gastosRef = collection(db, 'gastos'); // Referencia a la colección 'gastos'
        const q = query(gastosRef, where('uidusuario', '==', uid)); // Consulta para filtrar por 'uidusuario'
        const snapshot = await getDocs(q); // Obtener los documentos que coinciden con la consulta
        const gastos = snapshot.docs.map(doc => doc.data()); // Mapear los documentos a un array de datos
        return gastos;
    } catch (error) {
        console.error("Error al obtener los gastos: ", error);
        throw error; // Lanza el error para ser manejado en el componente
    }
};
