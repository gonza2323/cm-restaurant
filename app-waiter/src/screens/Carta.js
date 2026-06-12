import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getMyFiguritas, updateFiguritaStatus } from "../api/client";
import CartaImage from "../components/CartaImage";

export default function CollectionScreen() {
  const [carta, setCarta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState({}); // { [id]: true }

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await getCarta(); // TODO: Crear getCarta
      setCarta(data);
    } catch (e) {
      console.error(e);
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
    const isUpdating = updating[item.id];
    return (
      <View style={styles.card}>
        <CartaImage imagenUrl={item.imagenUrl} style={styles.cardImage} />
        <Text style={styles.cardName} numberOfLines={2}>
          {item.nombre}
        </Text>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.badge]}
            onPress={() => addToComanda(item)} // TODO: Implementar addToComanda
            disabled={isUpdating}
            activeOpacity={0.75}
          >
            <Text
              style={[styles.badgeText, item.owned && styles.badgeTextActive]}
            >
              {item.nombre}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.badge, item.wanted && styles.badgeWanted]}
            onPress={() => toggleWanted(item)}
            disabled={isUpdating}
            activeOpacity={0.75}
          >
            <Text
              style={[styles.badgeText, item.wanted && styles.badgeTextActive]}
            >
              {item.wanted ? "★ La quiero" : "La quiero"}
            </Text>
          </TouchableOpacity>
        </View>
        {isUpdating && (
          <View style={styles.cardOverlay}>
            <ActivityIndicator color="#3b82f6" size="small" />
          </View>
        )}
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#3b82f6" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Mi Colección</Text>
        <Text style={styles.stats}>
          {ownedCount}/{figuritas.length} 🃏 · {wantedCount} ★
        </Text>
      </View>

      <View style={styles.filterRow}>
        {[
          { key: "all", label: "Todas" },
          { key: "owned", label: "Las tengo" },
          { key: "wanted", label: "Las quiero" },
        ].map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterBtn,
              filter === f.key && styles.filterBtnActive,
            ]}
            onPress={() => setFilter(f.key)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f.key && styles.filterTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              No hay figuritas en este filtro
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: { fontSize: 22, fontWeight: "800", color: "#fff" },
  stats: { fontSize: 13, color: "#64748b" },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
  },
  filterBtnActive: { backgroundColor: "#3b82f6", borderColor: "#3b82f6" },
  filterText: { color: "#64748b", fontSize: 13, fontWeight: "600" },
  filterTextActive: { color: "#fff" },
  list: { paddingHorizontal: 12, paddingBottom: 24 },
  row: { justifyContent: "space-between", marginBottom: 12 },
  card: {
    width: "48%",
    backgroundColor: "#1e293b",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardImage: {
    width: "100%",
    aspectRatio: 0.72,
    backgroundColor: "#334155",
  },
  cardName: {
    color: "#f1f5f9",
    fontSize: 13,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 4,
    minHeight: 38,
  },
  cardActions: {
    flexDirection: "row",
    gap: 6,
    padding: 8,
    paddingTop: 4,
  },
  badge: {
    flex: 1,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "#334155",
    alignItems: "center",
  },
  badgeOwned: { backgroundColor: "#166534" },
  badgeWanted: { backgroundColor: "#1e3a5f" },
  badgeText: { color: "#94a3b8", fontSize: 11, fontWeight: "600" },
  badgeTextActive: { color: "#fff" },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,23,42,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  empty: { alignItems: "center", marginTop: 60 },
  emptyText: { color: "#64748b", fontSize: 16 },
});
