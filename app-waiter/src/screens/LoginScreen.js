import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = email.trim() && password;

  async function handleLogin() {
    if (!canSubmit) return;
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      // La navegación la maneja el Navigator al detectar que user != null
    } catch (e) {
      setError(e.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.emoji}>🍽️</Text>
          <Text style={styles.title}>Lo de Fer</Text>
          <Text style={styles.subtitle}>Panel de mozos</Text>
        </View>

        {/* Form*/}
        <View style={styles.form}>
            <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#c4967e"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            placeholderTextColor="#c4967e"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[
              styles.button,
              (!canSubmit || loading) && styles.buttonDisabled,
            ]}
            onPress={handleLogin}
            disabled={!canSubmit || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#1e1f4a" />
            ) : (
              <Text style={styles.buttonText}>Iniciar sesión</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#1a1208" },
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 28 },
  header: { alignItems: "center", marginBottom: 40 },
  emoji: { fontSize: 56, marginBottom: 12 },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFD4BD",
    letterSpacing: 0.5,
  },
  subtitle: { fontSize: 15, color: "#b09080", marginTop: 6 },
  form: { gap: 8 },
  label:  {
    fontSize: 12,
    color: "#d4a898",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    paddingLeft: 4,
    marginBottom: -2,
  },
  input: {
    backgroundColor: "#2a1e14",
    color: "#ede0d4",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    borderWidth: 0.5,
    borderColor: "#4a3020",
    marginBottom: 6,
  },
  error: {
    color: "#f87171",
    textAlign: "center",
    fontSize: 14,
    marginTop: 4,
  },
  button: {
    backgroundColor: "#A2A3EB",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: { backgroundColor: "#3d3e6a" },
  buttonText: { color: "#1e1f4a", fontSize: 16, fontWeight: "700" },
});
