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
import { getComandaById, removeItemFromComanda, addItemToComanda, getMenuItems } from "../api/client";
import { useNavigation } from "@react-navigation/native"; // Para navegar de vuelta o a selección de ítems

export default function ComandaDetailScreen({ route }) {
  const { idComanda } = route.params;
  const navigation = useNavigation();

  const [comanda, setComanda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false); // Para el estado del botón "Agregar Plato"

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

  async function handleAddItem() {
    // Por ahora, para simplificar, vamos a agregar un item de carta fijo (ej. el primero de la lista de menu items)
    // En una implementación real, esto abriría un modal o una nueva pantalla para seleccionar el item.
    setIsAddingItem(true);
    try {
      const menuItems = await getMenuItems();
      if (menuItems && menuItems.length > 0) {
        const firstMenuItemId = menuItems[0].id; // Tomamos el primer item disponible
        await addItemToComanda(idComanda, firstMenuItemId);
        Alert.alert("Éxito", `Plato "${menuItems[0].nombre}" agregado.`);
        await loadComandaData(); // Recargar la comanda para reflejar el cambio
      } else {
        Alert.alert("Info", "No hay platos disponibles para agregar.");
      }
    } catch (e) {
      console.error("Error agregando plato:", e);
      Alert.alert("Error", e.message || "No se pudo agregar el plato.");
    } finally {
      setIsAddingItem(false);
    }
  }

  function renderComandaItem({ item }) {
    // item.itemCarta contiene los detalles del plato
    const { id, itemCarta, estado } = item;
    const imageUrl = itemCarta.imageUrl ? `${process.env.EXPO_PUBLIC_API_URL}${itemCarta.imageUrl}` : null;

    return (
      <View style={styles.menuItemCard}>
        {imageUrl && <Image source={{ uri: imageUrl }} style={styles.menuItemImage} />}
        <View style={styles.menuItemDetails}>
          <Text style={styles.menuItemName}>{itemCarta.nombre}</Text>
          <Text style={styles.menuItemDescription}>{itemCarta.descripcion}</Text>
          <Text style={styles.menuItemPrice}>${itemCarta.precio.toFixed(2)}</Text>
          <Text style={styles.menuItemStatus}>Estado: {estado}</Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(id)} // id del detalle de comanda
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

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Comanda #{comanda.id}</Text>
        <Text style={styles.subtitle}>Fecha: {fechaSolicitud}</Text>
        <Text style={styles.subtitle}>Estado: {comanda.estado}</Text>
        <TouchableOpacity
          style={[styles.addButton, isAddingItem && styles.addButtonDisabled]}
          onPress={handleAddItem}
          disabled={isAddingItem}
        >
          {isAddingItem ? (
            <ActivityIndicator color="#1e1f4a" />
          ) : (
            <Text style={styles.addButtonText}>Agregar Plato</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.pagarButton}
          onPress={() => navigation.navigate("Pagar", { comanda })}
          disabled={!comanda?.detalles?.length}
        >
          <Text style={styles.pagarButtonText}>💳  Pagar</Text>
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
    backgroundColor: "#4a3020", // Placeholder color
  },
  menuItemDetails: {
    flex: 1,
  },
  menuItemName: { fontSize: 16, fontWeight: "700", color: "#ede0d4" },
  menuItemDescription: { fontSize: 12, color: "#b09080", marginTop: 2 },
  menuItemPrice: { fontSize: 14, fontWeight: "600", color: "#FFD4BD", marginTop: 5 },
  menuItemStatus: { fontSize: 12, color: "#b09080", marginTop: 2 },
  removeButton: {
    backgroundColor: "#f87171",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 10,
  },
  removeButtonText: { color: "#1e1f4a", fontSize: 12, fontWeight: "700" },
  addButton: {
    backgroundColor: "#4ade80", // Usar un color diferente para "Agregar Plato"
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