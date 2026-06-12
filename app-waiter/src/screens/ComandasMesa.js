import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native"; // Importar useNavigation
import { getMesaById, createComanda } from "../api/client";

export default function ComandasMesa({ route }) {
  const { idMesa } = route.params;
  const navigation = useNavigation(); // Obtener el objeto de navegación

  const [mesa, setMesa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [addingComanda, setAddingComanda] = useState(false);

  useEffect(() => {
    loadMesaData();
  }, [idMesa]);

  async function loadMesaData() {
    setLoading(true);
    setError("");
    try {
      const data = await getMesaById(idMesa);
      setMesa(data);
    } catch (e) {
      console.error("Error cargando datos de la mesa:", e);
      setError(e.message || "Error al cargar los datos de la mesa.");
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadMesaData();
    setRefreshing(false);
  }

  async function handleAddComanda() {
    setAddingComanda(true);
    try {
      await createComanda(idMesa);
      Alert.alert("Éxito", "Comanda agregada correctamente.");
      await loadMesaData();
    } catch (e) {
      console.error("Error agregando comanda:", e);
      Alert.alert("Error", e.message || "No se pudo agregar la comanda.");
    } finally {
      setAddingComanda(false);
    }
  }

  function renderComandaItem({ item }) {
    const fecha = new Date(item.fechaDeSolicitud).toLocaleString();

    return (
      <TouchableOpacity
        style={styles.comandaCard}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("ComandaDetailScreen", { idComanda: item.id })} // Navegar a ComandaDetailScreen
      >
        <Text style={styles.comandaId}>Comanda ID: {item.id}</Text>
        <Text style={styles.comandaFecha}>Fecha: {fecha}</Text>
        <Text style={[styles.comandaEstado, item.estado === "PENDIENTE" ? styles.comandaEstadoPendiente : styles.comandaEstadoCompletada]}>
          Estado: {item.estado}
        </Text>
      </TouchableOpacity>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#A2A3EB" size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadMesaData}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!mesa) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No se encontraron datos para esta mesa.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Mesa {mesa.numero}</Text>
        <Text style={styles.subtitle}>Capacidad: {mesa.capacidad} personas</Text>
        {mesa.zona && <Text style={styles.subtitle}>Zona: {mesa.zona}</Text>}
        <TouchableOpacity
          style={[styles.addButton, addingComanda && styles.addButtonDisabled]}
          onPress={handleAddComanda}
          disabled={addingComanda}
        >
          {addingComanda ? (
            <ActivityIndicator color="#1e1f4a" />
          ) : (
            <Text style={styles.addButtonText}>Agregar Comanda</Text>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={mesa.comandas}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderComandaItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#A2A3EB"
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No hay comandas para esta mesa.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#1a1208" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1a1208" },
  header: { paddingHorizontal: 20, paddingTop: 15, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: "#4a3020", paddingBottom: 10 },
  title: { fontSize: 28, fontWeight: "800", color: "#FFD4BD" },
  subtitle: { fontSize: 16, color: "#b09080", marginTop: 4 },
  list: { paddingHorizontal: 15, paddingBottom: 30 },
  comandaCard: {
    backgroundColor: "#2a1e14",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#4a3020",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  comandaId: { fontSize: 16, fontWeight: "700", color: "#ede0d4", marginBottom: 5 },
  comandaFecha: { fontSize: 13, color: "#b09080", marginBottom: 5 },
  comandaEstado: { fontSize: 14, fontWeight: "600" },
  comandaEstadoPendiente: { color: "#FFD4BD" },
  comandaEstadoCompletada: { color: "#4ade80" },
  empty: { alignItems: "center", marginTop: 50 },
  emptyText: { color: "#b09080", fontSize: 16 },
  errorText: { color: "#f87171", fontSize: 16, textAlign: "center", marginBottom: 10 },
  retryButton: {
    backgroundColor: "#A2A3EB",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  retryButtonText: { color: "#1e1f4a", fontSize: 16, fontWeight: "700" },
  addButton: {
    backgroundColor: "#A2A3EB",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 15,
  },
  addButtonDisabled: {
    backgroundColor: "#3d3e6a",
  },
  addButtonText: {
    color: "#1e1f4a",
    fontSize: 16,
    fontWeight: "700",
  },
});