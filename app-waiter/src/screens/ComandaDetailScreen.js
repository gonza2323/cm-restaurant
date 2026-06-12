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
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getComandaById, removeItemFromComanda } from "../api/client";
import { useNavigation } from "@react-navigation/native";

export default function ComandaDetailScreen({ route }) {
  const { idComanda } = route.params;
  const navigation = useNavigation();

  const [comanda, setComanda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadComandaData();
  }, [idComanda]);

  async function loadComandaData() {
    setLoading(true);
    setError("");
    try {
      const data = await getComandaById(idComanda);
      setComanda(data);
    } catch (e) {
      console.error("Error cargando detalles de la comanda:", e);
      setError(e.message || "Error al cargar los detalles de la comanda.");
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadComandaData();
    setRefreshing(false);
  }

  async function handleRemoveItem(itemComandaId) {
    Alert.alert(
      "Eliminar Plato",
      "¿Estás seguro de que quieres eliminar este plato de la comanda?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await removeItemFromComanda(idComanda, itemComandaId);
              Alert.alert("Éxito", "Plato eliminado correctamente.");
              await loadComandaData(); // Recargar la comanda para reflejar el cambio
            } catch (e) {
              console.error("Error eliminando plato:", e);
              Alert.alert("Error", e.message || "No se pudo eliminar el plato.");
            }
          },
          style: "destructive",
        },
      ],
    );
  }

  function handleAddItem() {
    navigation.navigate("Carta", { idComanda: idComanda });
  }

  function renderComandaItem({ item }) {
    const { id, itemCarta, estado } = item;
    const imageUrl = itemCarta.imageUrl ? `${process.env.EXPO_PUBLIC_API_URL}${itemCarta.imageUrl}` : null;

    // Mapeo de estados de la API a texto descriptivo
    const estadoDisplay = {
      EN_PROCESO_DE_SOLICITUD: "En Proceso de Solicitud",
      ENVIADO_A_LA_COCINA: "Enviado a Cocina",
      COCINERO_ASIGNADO: "Cocinero Asignado",
      ENTREGADO_PARA_DESPACHAR: "Listo para Despachar",
      ENTREGADO_AL_CLIENTE: "Entregado al Cliente",
      PLAZO_EXCEDIDO_DE_ENTREGA: "Plazo Excedido",
    }[estado] || estado; // Fallback al estado original si no se encuentra

    // Determinar el estilo del estado
    let estadoStyle = styles.itemEstadoPendiente; // Estilo por defecto
    if (estado === "ENTREGADO_AL_CLIENTE") {
      estadoStyle = styles.itemEstadoCompletado;
    } else if (estado === "PLAZO_EXCEDIDO_DE_ENTREGA") {
      estadoStyle = styles.itemEstadoExcedido;
    } else if (estado === "ENVIADO_A_LA_COCINA" || estado === "COCINERO_ASIGNADO") {
      estadoStyle = styles.itemEstadoEnProceso;
    }


    return (
      <View style={styles.menuItemCard}>
        {imageUrl && <Image source={{ uri: imageUrl }} style={styles.menuItemImage} />}
        <View style={styles.menuItemDetails}>
          <Text style={styles.menuItemName}>{itemCarta.nombre}</Text>
          <Text style={styles.menuItemDescription}>{itemCarta.descripcion}</Text>
          <Text style={styles.menuItemPrice}>${itemCarta.precio.toFixed(2)}</Text>
          <Text style={[styles.menuItemStatus, estadoStyle]}>Estado: {estadoDisplay}</Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(id)}
        >
          <Text style={styles.removeButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
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
        <TouchableOpacity style={styles.retryButton} onPress={loadComandaData}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!comanda) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No se encontraron datos para esta comanda.</Text>
      </View>
    );
  }

  const fechaSolicitud = new Date(comanda.fechaSolicitud).toLocaleString();

  // Mapeo de estados de la API a texto descriptivo para la comanda principal
  const comandaEstadoDisplay = {
    EN_PROCESO_DE_SOLICITUD: "En Proceso de Solicitud",
    ENVIADO_A_LA_COCINA: "Enviado a Cocina",
    COCINERO_ASIGNADO: "Cocinero Asignado",
    ENTREGADO_PARA_DESPACHAR: "Listo para Despachar",
    ENTREGADO_AL_CLIENTE: "Entregado al Cliente",
    PLAZO_EXCEDIDO_DE_ENTREGA: "Plazo Excedido",
  }[comanda.estado] || comanda.estado;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Comanda #{comanda.id}</Text>
        <Text style={styles.subtitle}>Fecha: {fechaSolicitud}</Text>
        <Text style={styles.subtitle}>Estado: {comandaEstadoDisplay}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddItem}
        >
          <Text style={styles.addButtonText}>Agregar Plato</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={comanda.detalles}
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
            <Text style={styles.emptyText}>No hay platos en esta comanda.</Text>
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
  menuItemCard: {
    flexDirection: "row",
    backgroundColor: "#2a1e14",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#4a3020",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    alignItems: "center",
  },
  menuItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#4a3020",
  },
  menuItemDetails: {
    flex: 1,
  },
  menuItemName: { fontSize: 16, fontWeight: "700", color: "#ede0d4" },
  menuItemDescription: { fontSize: 12, color: "#b09080", marginTop: 2 },
  menuItemPrice: { fontSize: 14, fontWeight: "600", color: "#FFD4BD", marginTop: 5 },
  menuItemStatus: { fontSize: 12, fontWeight: "600", marginTop: 2 }, // Base style for item status
  itemEstadoPendiente: { color: "#FFD4BD" }, // Por ejemplo, para EN_PROCESO_DE_SOLICITUD
  itemEstadoEnProceso: { color: "#A2A3EB" }, // Por ejemplo, para ENVIADO_A_LA_COCINA, COCINERO_ASIGNADO
  itemEstadoCompletado: { color: "#4ade80" }, // Por ejemplo, para ENTREGADO_AL_CLIENTE
  itemEstadoExcedido: { color: "#f87171" }, // Por ejemplo, para PLAZO_EXCEDIDO_DE_ENTREGA
  removeButton: {
    backgroundColor: "#f87171",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 10,
  },
  removeButtonText: { color: "#1e1f4a", fontSize: 12, fontWeight: "700" },
  addButton: {
    backgroundColor: "#4ade80",
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