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
      error.response?.data?.message ||
      error.response?.data?.error ||
      null;
    const statusMsg = error.response ? `Error ${error.response.status}` : null;
    const finalMsg = backendMsg || statusMsg || "Error de conexión";
    return Promise.reject(new Error(finalMsg));
  }
);


export function setAuthToken(token) {
  apiClient.authToken = token;
}

export function clearAuthToken() {
  apiClient.authToken = null;
}

async function request(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  if (apiClient.authToken) headers["Authorization"] = `Bearer ${apiClient.authToken}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let errorMsg = `Error ${res.status}`;
    try {
      const errData = await res.json();
      errorMsg = errData.message || errData.error || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Auth
export const login = (email, password) =>
  apiClient.post("/api/auth/login", { email, password }).then((r) => r.data);

export const getMe = () => apiClient.get("/api/auth/me").then((r) => r.data);

