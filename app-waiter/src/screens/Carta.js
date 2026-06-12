import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getMozosCarta, addItemToComandaDetails } from "../api/client";
import { useNavigation } from "@react-navigation/native";

export default function Carta({ route }) {
  const { idComanda } = route.params;
  const navigation = useNavigation();

  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantities, setQuantities] = useState({}); // { itemId: quantity }
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadMenuData();
  }, []);

  async function loadMenuData() {
    setLoading(true);
    setError("");
    try {
      const data = await getMozosCarta();
      setMenuData(data);
    } catch (e) {
      console.error("Error cargando la carta:", e);
      setError(e.message || "Error al cargar la carta.");
    } finally {
      setLoading(false);
    }
  }

  const handleQuantityChange = (itemId, amount) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + amount),
    }));
  };

  const totalItemsSeleccionados = Object.values(quantities).reduce((a, b) => a + b, 0);

  async function handleAgregarTodos() {
    if (totalItemsSeleccionados === 0) {
      Alert.alert("Atención", "Seleccioná al menos un producto antes de agregar.");
      return;
    }

    setAdding(true);
    try {
      // Por cada item con cantidad > 0, hacemos N requests al backend
      const entries = Object.entries(quantities).filter(([, qty]) => qty > 0);
      for (const [itemId, qty] of entries) {
        for (let i = 0; i < qty; i++) {
          await addItemToComandaDetails(idComanda, Number(itemId));
        }
      }
      Alert.alert("Éxito", `${totalItemsSeleccionados} item(s) agregado(s) a la comanda.`);
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", e.message || "No se pudieron agregar los items.");
    } finally {
      setAdding(false);
    }
  }

  // async function handleAddItemToComanda(itemCartaId) {
  //   const quantity = quantities[itemCartaId] || 0;
  //   if (quantity === 0) {
  //     Alert.alert("Atención", "Selecciona al menos una unidad para agregar.");
  //     return;
  //   }

  //   setAddingItem(true);
  //   try {
  //     for (let i = 0; i < quantity; i++) {
  //       await addItemToComandaDetails(idComanda, itemCartaId);
  //     }
  //     Alert.alert("Éxito", `${quantity} unidad(es) agregada(s) a la comanda.`);
  //     setQuantities((prev) => ({ ...prev, [itemCartaId]: 0 })); // Reset quantity
  //     // Opcional: Navegar de vuelta a ComandaDetailScreen o refrescarla
  //     navigation.goBack();
  //   } catch (e) {
  //     console.error("Error agregando plato a la comanda:", e);
  //     Alert.alert("Error", e.message || "No se pudo agregar el plato a la comanda.");
  //   } finally {
  //     setAddingItem(false);
  //   }
  // }

  function renderMenuItem({ item }) {
    const imageUrl = item.imageUrl ? `${process.env.EXPO_PUBLIC_API_URL}${item.imageUrl}` : null;
    const currentQuantity = quantities[item.id] || 0;

    return (
      <View style={styles.menuItemCard}>
        {imageUrl && <Image source={{ uri: imageUrl }} style={styles.menuItemImage} />}
        <View style={styles.menuItemContent}>
          <View style={styles.menuItemDetails}>
            <Text style={styles.menuItemName}>{item.nombre}</Text>
            <Text style={styles.menuItemDescription}>{item.descripcion}</Text>
            <Text style={styles.menuItemPrice}>${item.precio.toFixed(2)}</Text>
          </View>
          <View style={styles.quantitySelector}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(item.id, -1)}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{currentQuantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(item.id, 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  function renderSection({ item }) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{item.nombre}</Text>
        <FlatList
          data={item.items}
          keyExtractor={(menuItem) => String(menuItem.id)}
          renderItem={renderMenuItem}
          scrollEnabled={false}
        />
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
        <TouchableOpacity style={styles.retryButton} onPress={loadMenuData}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!menuData || !menuData.secciones || menuData.secciones.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No hay elementos en la carta.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Carta del Restaurante</Text>
        <Text style={styles.subtitle}>Comanda #{idComanda}</Text>
      </View>
      <FlatList
        data={menuData.secciones}
        keyExtractor={(section) => String(section.id)}
        renderItem={renderSection}
        contentContainerStyle={styles.list}
      />
      {/* Boton flotante de agregar seleccionados */}
      <TouchableOpacity
        style={[
          styles.fabAgregar,
          (totalItemsSeleccionados === 0 || adding) && styles.fabAgregarDisabled,
        ]}
        onPress={handleAgregarTodos}
        disabled={totalItemsSeleccionados === 0 || adding}
      >
        {adding ? (
          <ActivityIndicator color="#1e1f4a" />
        ) : (
          <Text style={styles.fabAgregarText}>
            {totalItemsSeleccionados > 0
              ? `Agregar ${totalItemsSeleccionados} item(s)`
              : "Seleccioná items"}
          </Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#1a1208" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1a1208" },
  header: { paddingHorizontal: 20, paddingTop: 15, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: "#4a3020", paddingBottom: 10 },
  title: { fontSize: 26, fontWeight: "800", color: "#FFD4BD" },
  subtitle: { fontSize: 14, color: "#b09080", marginTop: 4 },
  list: { paddingHorizontal: 15, paddingBottom: 100 },
  sectionContainer: { marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: "700", color: "#FFD4BD", marginBottom: 10, paddingLeft: 5 },
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
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#4a3020",
  },
  menuItemContent: { // Nuevo contenedor para detalles y acciones
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuItemDetails: {
    flex: 1, // Permite que los detalles ocupen el espacio disponible
    marginRight: 10,
  },
  menuItemName: { fontSize: 16, fontWeight: "700", color: "#ede0d4" },
  menuItemDescription: { fontSize: 12, color: "#b09080", marginTop: 2 },
  menuItemPrice: { fontSize: 14, fontWeight: "600", color: "#FFD4BD", marginTop: 5 },
  // itemActions: { // Contenedor para el botón '+' y el selector de cantidad
  //   alignItems: "center",
  // },
  // addPlusButton: {
  //   backgroundColor: "#4ade80",
  //   borderRadius: 20, // Para hacerlo circular
  //   width: 40,
  //   height: 40,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginBottom: 8, // Espacio entre el '+' y el selector de cantidad
  // },
  // addPlusButtonDisabled: {
  //   backgroundColor: "#3d3e6a",
  // },
  // addPlusButtonText: {
  //   color: "#1e1f4a",
  //   fontSize: 24,
  //   fontWeight: "bold",
  //   lineHeight: 24, // Ajustar para centrar el '+'
  // },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  quantityButton: {
    backgroundColor: "#4a3020",
    borderRadius: 5,
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    color: "#ede0d4",
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityText: {
    color: "#ede0d4",
    fontSize: 16,
    fontWeight: "bold",
    minWidth: 20,
    textAlign: "center",
  },
  fabAgregar: {
    position: "absolute",
    bottom: 36,
    left: 20,
    right: 20,
    backgroundColor: "#4ade80",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabAgregarDisabled: { backgroundColor: "#3d3e6a" },
  fabAgregarText: { color: "#1e1f4a", fontSize: 16, fontWeight: "700" },

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