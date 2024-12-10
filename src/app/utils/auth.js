import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000'; // Dirección del backend de Django

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/token/`, {
            username,
            password,
        });
        const { access, refresh } = response.data;
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        return response.data;
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        throw error;
    }
};
