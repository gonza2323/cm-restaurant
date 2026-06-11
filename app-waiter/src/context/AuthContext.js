import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setAuthToken,
  clearAuthToken,
  login as apiLogin,
  getMe,
} from "../api/client";

const AuthContext = createContext(null);

const STORAGE_KEY = "auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, token }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { token, userId, roles} = JSON.parse(stored);
        setAuthToken(token);
        // Verify token is still valid
        await getMe();
        setUser({ id: userId, roles, token });
      }
    } catch {
      // Si token expira o falla, limpiamos
      await AsyncStorage.removeItem(STORAGE_KEY);
      clearAuthToken();
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const data = await apiLogin(email, password);

    const token = data.token.value;
    const userId = data.user.userId;
    const roles = data.user.roles;
    setAuthToken(token);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ token, userId, roles }));
    setUser({ id: userId, roles, token });
  }

  async function logout() {
    clearAuthToken();
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
