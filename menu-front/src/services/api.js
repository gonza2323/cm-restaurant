import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Tu backend de Spring Boot
  headers: {
    'Content-Type': 'application/json'
  }
});

// Opcional: Agregar token JWT automáticamente si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // O donde guardes tu sesión
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;