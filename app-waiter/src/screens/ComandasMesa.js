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

  function handlePagarTodas() {
    const entregadas = (mesa?.comandas ?? [])
      .filter((c) => c.estado === "ENTREGADA")
      .map((c) => c.id);
    if (entregadas.length === 0) {
      Alert.alert("Sin comandas listas", "No hay comandas entregadas para pagar en esta mesa.");
      return;
    }
    navigation.navigate("Pagar", { idsComandas: entregadas });
  }

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

  const hayEntregadas = (mesa?.comandas ?? []).some((c) => c.estado === "ENTREGADA");


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
      ENTREGADA: "Entregada al Cliente", // Actualizado
      PLAZO_EXCEDIDO_DE_ENTREGA: "Plazo Excedido",
      PREPARACION_LISTA: "Preparación Lista",
      PAGADA: "Pagada",
    }[item.estado] || item.estado;

    // Determinar el estilo del estado
    const estadoStyle =
        item.estado === "EN_PROCESO_DE_SOLICITUD" ? styles.estadoEnProceso :
        item.estado === "PREPARACION_LISTA" ? styles.estadoPreparada :
        item.estado === "ENTREGADA" ? styles.estadoEntregada :
        item.estado === "PAGADA" ? styles.estadoPagada : styles.estadoEnProceso

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
                {estadoDisplay}
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
          <View style={styles.headerTopRow}>
            <View>
              <Text style={styles.title}>Mesa {mesa.numero}</Text>
              <Text style={styles.subtitle}>Capacidad: {mesa.capacidad} personas</Text>
              {mesa.zona && <Text style={styles.subtitle}>Zona: {mesa.zona}</Text>}
            </View>
            {/* Botón Pagar Todo */}
            {!selectionMode && (
              <TouchableOpacity
                style={[styles.pagarTodoButton, !hayEntregadas && styles.pagarTodoButtonDisabled]}
                onPress={handlePagarTodas}
                disabled={!hayEntregadas}
              >
                <Text style={styles.pagarTodoButtonText}>💳 Pagar todo</Text>
              </TouchableOpacity>
            )}
            {selectionMode && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => { setSelectedComandas([]); setSelectionMode(false); }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            )}
          </View>
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
                style={[styles.fabAdd, addingComanda && styles.fabDisabled]}
                onPress={handleAddComanda}
                disabled={addingComanda}
            >
              {addingComanda ? (
                  <ActivityIndicator color="#1e1f4a" />
              ) : (
                  <Text style={styles.fabAddText}>+</Text>
              )}
            </TouchableOpacity>
        )}

        {/* Botón flotante para pagar comandas seleccionadas (derecha) */}
        {selectedComandas.length > 0 && (
        <TouchableOpacity style={styles.fabPagar} onPress={handlePaySelected}>
          <Text style={styles.fabPagarText}>Pagar ({selectedComandas.length})</Text>
        </TouchableOpacity>
      )}
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#1a1208" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1a1208" },
  header: { paddingHorizontal: 20, paddingTop: 15, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: "#4a3020", paddingBottom: 10 },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: { fontSize: 28, fontWeight: "800", color: "#FFD4BD" },
  subtitle: { fontSize: 16, color: "#b09080", marginTop: 4 },
  pagarTodoButton: {
    backgroundColor: "#A2A3EB",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignSelf: "center",
  },
  pagarTodoButtonDisabled: { backgroundColor: "#3d3e6a" },
  pagarTodoButtonText: { color: "#1e1f4a", fontSize: 15, fontWeight: "700" },
  cancelButton: {
    backgroundColor: "#f87171",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "center",
  },
  cancelButtonText: { color: "#1e1f4a", fontSize: 14, fontWeight: "700" },
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
  comandaCardSelected: { borderColor: "#A2A3EB", borderWidth: 2 },
  comandaCardNotPayable: { opacity: 0.5 },
  comandaCardContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  comandaId: { fontSize: 16, fontWeight: "700", color: "#ede0d4", marginBottom: 5 },
  comandaFecha: { fontSize: 13, color: "#b09080", marginBottom: 5 },
  comandaEstado: { fontSize: 14, fontWeight: "600" },
  estadoEnProceso: { color: "#fcf9f6" },
  estadoPreparada: { color: "#a2ff69" },
  estadoEntregada: { color: "#7492fe" },
  estadoPagada: { color: "#548d43" },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#b09080",
    backgroundColor: "transparent",
  },
  checkboxSelected: { backgroundColor: "#A2A3EB", borderColor: "#A2A3EB" },
  fabAdd: {
    position: "absolute",
    bottom: 36,
    left: 20,
    backgroundColor: "#A2A3EB",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  fabAddText: { color: "#1e1f4a", fontSize: 30, fontWeight: "bold" },
  fabPagar: {
    position: "absolute",
    bottom: 36,
    right: 20,
    backgroundColor: "#4ade80",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 6,
  },
  fabPagarText: { color: "#1e1f4a", fontSize: 16, fontWeight: "700" },
  fabDisabled: { backgroundColor: "#3d3e6a" },
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
});
