import api from './api';

export const getCarta = async () => {
    try {
        const response = await api.get('/carta');   
        return response.data; // Devuelve la carta completa
    } catch (error) {
        console.error('Error al obtener la carta:', error);
        throw error;
    }
};