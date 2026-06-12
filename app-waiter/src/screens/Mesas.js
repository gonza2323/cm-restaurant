import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native"; // Importar useNavigation
import { getMesas } from "../api/client";

export default function Mesas() {
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation(); // Obtener el objeto de navegación

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await getMesas();
      setMesas(data);
    } catch (e) {
      console.error("Error cargando mesas:", e);
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  function renderItem({ item }) {
    // Asumiendo que el item tiene: id, numero, capacidad, estado (disponible/ocupada)
    const isOcupada = item.estado === "OCUPADA";

    return (
      <TouchableOpacity 
        style={[styles.card, isOcupada && styles.cardOccupied]} 
        activeOpacity={0.8}
        onPress={() => navigation.navigate("ComandasMesa", { idMesa: item.id })} // Navegar a ComandasMesa
      >
        <View style={styles.cardHeader}>
          <Text style={styles.tableNumber}>Mesa {item.numero}</Text>
          <View style={[styles.statusDot, isOcupada ? styles.dotOccupied : styles.dotAvailable]} />
        </View>
        
        <Text style={styles.capacityText}>Capacidad: {item.capacidad} personas</Text>
        {item.zona && <Text style={styles.zoneText}>Zona: {item.zona}</Text>}
        
        <View style={styles.cardFooter}>
          <Text style={[styles.statusText, isOcupada ? styles.statusTextOccupied : styles.statusTextAvailable]}>
            {isOcupada ? "OCUPADA" : "DISPONIBLE"}
          </Text>
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

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>🍽️ Lo de Fer</Text>
        <Text style={styles.subtitle}>Selecciona una mesa para atender</Text>
      </View>

      <FlatList
        data={mesas}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
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
            <Text style={styles.emptyText}>No hay mesas configuradas</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#1a1208" }, // Fondo principal
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1a1208" },
  header: { paddingHorizontal: 20, paddingTop: 15, marginBottom: 15 },
  title: { fontSize: 26, fontWeight: "800", color: "#FFD4BD" }, // Título
  subtitle: { fontSize: 14, color: "#b09080", marginTop: 4 }, // Subtítulo
  list: { paddingHorizontal: 15, paddingBottom: 30 },
  row: { justifyContent: "space-between" },
  card: {
    width: "48%",
    backgroundColor: "#2a1e14", // Fondo de tarjeta
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#4a3020", // Borde de tarjeta
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardOccupied: { borderColor: "#f8717133", backgroundColor: "#331a1a" }, // Tarjeta ocupada
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  tableNumber: { fontSize: 18, fontWeight: "700", color: "#ede0d4" }, // Número de mesa
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  dotAvailable: { backgroundColor: "#4ade80" }, // Punto disponible
  dotOccupied: { backgroundColor: "#f87171" }, // Punto ocupado
  zoneText: { fontSize: 12, color: "#b09080", marginBottom: 10 }, // Texto de zona
  capacityText: { fontSize: 13, color: "#b09080", marginBottom: 15 }, // Texto de capacidad
  cardFooter: { borderTopWidth: 0.5, borderTopColor: "#4a3020", paddingTop: 10 }, // Separador de footer
  statusText: { fontSize: 11, fontWeight: "800", textAlign: "center", letterSpacing: 0.5 },
  statusTextAvailable: { color: "#4ade80" }, // Texto disponible
  statusTextOccupied: { color: "#f87171" }, // Texto ocupado
  empty: { alignItems: "center", marginTop: 50 },
  emptyText: { color: "#b09080", fontSize: 16 }, // Texto vacío
});