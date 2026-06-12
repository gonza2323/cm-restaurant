import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

// Helper para leer el user de localStorage sin romper si hay datos corruptos
function getUserFromStorage() {
  try {
    return JSON.parse(localStorage.getItem("user")) ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUserFromStorage);

  // Guarda token y user en localStorage y en el estado
  function saveSession({ token, user: userData }) {
    // El backend devuelve token como { value, expiryDate }, guardamos solo el string
    localStorage.setItem("token", token.value);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    saveSession(response.data);
  };

  const signup = async ({ nombre, apellido, email, fechaNacimiento, password, passwordConfirm, imageFile }) => {
    // El endpoint espera multipart/form-data
    const formData = new FormData();

    formData.append(
      "clienteDto",
      new Blob(
        [JSON.stringify({ nombre, apellido, email, fechaNacimiento, password, passwordConfirm })],
        { type: "application/json" }
      )
    );

    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    const response = await api.post("/auth/signup", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    saveSession(response.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,           // { userId, roles }
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        // Helpers de rol para usar en componentes
        isCliente: user?.roles?.includes("CLIENTE") ?? false,
        isMozo: user?.roles?.includes("MOZO") ?? false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return context;
};