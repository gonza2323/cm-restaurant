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
import { useNavigation } from "@react-navigation/native";
import { getMesaById, createComanda } from "../api/client";

export default function ComandasMesa({ route }) {
  const { idMesa } = route.params;
  const navigation = useNavigation();

  const [mesa, setMesa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [addingComanda, setAddingComanda] = useState(false);
  const [selectedComandas, setSelectedComandas] = useState([]); // Nuevo estado para comandas seleccionadas
  const [selectionMode, setSelectionMode] = useState(false); // Nuevo estado para el modo de selección

  useEffect(() => {
    loadMesaData();
  }, [idMesa]);

  useEffect(() => {
    // Si no hay comandas seleccionadas, salir del modo de selección
    if (selectedComandas.length === 0 && selectionMode) {
      setSelectionMode(false);
    }
  }, [selectedComandas, selectionMode]);

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
    setSelectedComandas([]); // Limpiar selección al refrescar
    setSelectionMode(false);
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

  const toggleComandaSelection = (comandaId) => {
    setSelectedComandas((prevSelected) => {
      if (prevSelected.includes(comandaId)) {
        return prevSelected.filter((id) => id !== comandaId);
      } else {
        return [...prevSelected, comandaId];
      }
    });
  };

  async function handlePaySelectedComandas() {
    if (selectedComandas.length === 0) {
      Alert.alert("Atención", "Selecciona al menos una comanda para pagar.");
      return;
    }
    // Navegar a PagarScreen con los IDs de las comandas seleccionadas
    navigation.navigate("Pagar", { idsComandas: selectedComandas });
    // Limpiar selección y salir del modo de selección después de navegar
    setSelectedComandas([]);
    setSelectionMode(false);
  }

  function renderComandaItem({ item }) {
    const fecha = new Date(item.fechaSolicitud).toLocaleString();
    const isSelected = selectedComandas.includes(item.id);
    const isPayable = item.estado === "ENTREGADA"; // Solo se pueden pagar comandas "ENTREGADA"

    // Mapeo de estados de la API a texto descriptivo
    const estadoDisplay = {
      EN_PROCESO_DE_SOLICITUD: "En Proceso de Solicitud",
      ENVIADO_A_LA_COCINA: "Enviado a Cocina",
      COCINERO_ASIGNADO: "Cocinero Asignado",
      ENTREGADO_PARA_DESPACHAR: "Listo para Despachar",
      ENTREGADA: "Entregada al Cliente", // Actualizado aquí
      PLAZO_EXCEDIDO_DE_ENTREGA: "Plazo Excedido",
      PREPARACION_LISTA: "Preparación Lista",
    }[item.estado] || item.estado;

    // Determinar el estilo del estado
    const estadoStyle = item.estado === "PLAZO_EXCEDIDO_DE_ENTREGA" ? styles.comandaEstadoExcedido :
        item.estado === "ENTREGADA" ? styles.comandaEstadoCompletada :
            styles.comandaEstadoPendiente;

    const handlePress = () => {
      if (selectionMode) {
        if (isPayable) {
          toggleComandaSelection(item.id);
        } else {
          Alert.alert("Atención", "Solo se pueden seleccionar comandas 'ENTREGADA' para pagar.");
        }
      } else {
        navigation.navigate("ComandaDetailScreen", { idComanda: item.id });
      }
    };

    const handleLongPress = () => {
      if (isPayable) {
        setSelectionMode(true);
        toggleComandaSelection(item.id);
      } else {
        Alert.alert("Atención", "Solo se pueden seleccionar comandas 'ENTREGADA' para pagar.");
      }
    };

    return (
        <TouchableOpacity
            style={[
              styles.comandaCard,
              isSelected && styles.comandaCardSelected,
              !isPayable && selectionMode && styles.comandaCardNotPayable // Visual cue for non-payable in selection mode
            ]}
            activeOpacity={0.8}
            onPress={handlePress}
            onLongPress={handleLongPress}
            disabled={!isPayable && selectionMode} // Deshabilitar selección si no es pagable y en modo selección
        >
          <View style={styles.comandaCardContent}>
            <View>
              <Text style={styles.comandaId}>Comanda #{item.id}</Text>
              <Text style={styles.comandaFecha}>Fecha de solicitud: {fecha}</Text>
              <Text style={[styles.comandaEstado, estadoStyle]}>
                Estado: {estadoDisplay}
              </Text>
            </View>
            {selectionMode && (
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]} />
            )}
          </View>
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
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>Mesa {mesa.numero}</Text>
          <Text style={styles.subtitle}>Capacidad: {mesa.capacidad} personas</Text>
          {mesa.zona && <Text style={styles.subtitle}>Zona: {mesa.zona}</Text>}
          {selectionMode && (
              <TouchableOpacity onPress={() => { setSelectedComandas([]); setSelectionMode(false); }} style={styles.cancelSelectionButton}>
                <Text style={styles.cancelSelectionButtonText}>Cancelar Selección</Text>
              </TouchableOpacity>
          )}
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

        {/* Botón flotante para agregar comanda (izquierda) */}
        {!selectionMode && (
            <TouchableOpacity
                style={[styles.fabAddComanda, addingComanda && styles.fabDisabled]}
                onPress={handleAddComanda}
                disabled={addingComanda}
            >
              {addingComanda ? (
                  <ActivityIndicator color="#1e1f4a" />
              ) : (
                  <Text style={styles.fabText}>+</Text>
              )}
            </TouchableOpacity>
        )}

        {/* Botón flotante para pagar comandas seleccionadas (derecha) */}
        {selectedComandas.length > 0 && (
            <TouchableOpacity
                style={[styles.fabPaySelected, loading && styles.fabDisabled]}
                onPress={handlePaySelectedComandas}
                disabled={loading}
            >
              <Text style={styles.fabPaySelectedText}>Pagar ({selectedComandas.length})</Text>
            </TouchableOpacity>
        )}
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
  comandaCardSelected: {
    borderColor: "#A2A3EB", // Color de borde para comandas seleccionadas
    borderWidth: 2,
  },
  comandaCardNotPayable: {
    opacity: 0.6, // Reducir opacidad para comandas no pagables en modo selección
  },
  comandaCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  comandaId: { fontSize: 16, fontWeight: "700", color: "#ede0d4", marginBottom: 5 },
  comandaFecha: { fontSize: 13, color: "#b09080", marginBottom: 5 },
  comandaEstado: { fontSize: 14, fontWeight: "600" },
  comandaEstadoPendiente: { color: "#FFD4BD" },
  comandaEstadoCompletada: { color: "#4ade80" },
  comandaEstadoExcedido: { color: "#f87171" },
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
  // Estilos para el FAB de agregar comanda
  fabAddComanda: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#A2A3EB",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabPaySelected: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#4ade80", // Color para pagar
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabDisabled: {
    backgroundColor: "#3d3e6a",
  },
  fabText: {
    color: "#1e1f4a",
    fontSize: 30,
    fontWeight: "bold",
  },
  fabPaySelectedText: {
    color: "#1e1f4a",
    fontSize: 16,
    fontWeight: "700",
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#b09080",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  checkbox: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "transparent",
  },
  checkboxSelected: {
    backgroundColor: "#A2A3EB",
  },
  cancelSelectionButton: {
    position: "absolute",
    top: 15,
    right: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#f87171",
    borderRadius: 8,
  },
  cancelSelectionButtonText: {
    color: "#1e1f4a",
    fontSize: 14,
    fontWeight: "700",
  },
});