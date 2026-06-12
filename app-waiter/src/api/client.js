import axios from "axios";

// Instancia Base
const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Adjunta el token si es que exste
apiClient.interceptors.request.use((config) => {
  if (apiClient.authToken) {
    config.headers.Authorization = `Bearer ${apiClient.authToken}`;
  }
  return config;
});

// Normaliza errores para mostrar mensajes claros al usuario
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const backendMsg =
      error.response?.data?.message || error.response?.data?.error || null;
    const statusMsg = error.response ? `Error ${error.response.status}` : null;
    const finalMsg = backendMsg || statusMsg || "Error de conexión";
    return Promise.reject(new Error(finalMsg));
  },
);

export function setAuthToken(token) {
  apiClient.authToken = token;
}

export function clearAuthToken() {
  apiClient.authToken = null;
}

// Auth
export const login = (email, password) =>
  apiClient.post("/api/auth/login", { email, password }).then((r) => r.data);

export const getMe = () => apiClient.get("/api/auth/me").then((r) => r.data);

// Mesas
export const getMesas = () => apiClient.get("/api/mesas").then((r) => r.data);
export const getMesaById = (idMesa) =>
  apiClient.get(`/api/mesas/${idMesa}`).then((r) => r.data);

// Comandas
export const createComanda = (mesaId) =>
  apiClient.post("/api/comandas", { mesaId }).then((r) => r.data);
export const getComandaById = (idComanda) =>
  apiClient.get(`/api/comandas/${idComanda}`).then((r) => r.data);
export const addItemToComanda = (idComanda, itemCartaId) =>
  apiClient.post(`/api/comandas/${idComanda}/detalles`, { itemCartaId }).then((r) => r.data);
export const removeItemFromComanda = (idComanda, detalleId) =>
  apiClient.delete(`/api/comandas/${idComanda}/detalles/${detalleId}`).then((r) => r.data);
export const addItemToComandaDetails = (idComanda, itemCartaId) =>
    apiClient.post(`/api/comandas/${idComanda}/detalles`, { itemCartaId }).then((r) => r.data);
export const enviarACocina = (idComanda) =>
  apiClient.post(`/api/comandas/${idComanda}/enviar-a-cocina`).then((r) => r.data);

// Items de Carta
export const getMenuItems = () => apiClient.get("/api/items-carta").then((r) => r.data);
export const getMozosCarta = () => apiClient.get("/api/mozos/carta").then((r) => r.data);

// Mercado Pago 
export const generarQRPago = (idComanda) =>
  apiClient.post(`/api/payments/${idComanda}`).then((r) => r.data);
