import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { enviarACocina } from "../api/client";

export default function PagarScreen({ route, navigation }) {
  const { comanda } = route.params;

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const resumen = (comanda.detalles ?? []).reduce((acc, d) => {
    const nombre = d.itemCarta?.nombre ?? "Item";
    const precio = d.itemCarta?.precio ?? 0;
    const existente = acc.find((x) => x.nombre === nombre);
    if (existente) {
      existente.cantidad++;
      existente.subtotal += precio;
    } else {
      acc.push({ nombre, precio, cantidad: 1, subtotal: precio });
    }
    return acc;
  }, []);

  const total = (comanda.detalles ?? []).reduce(
    (acc, d) => acc + (d.itemCarta?.precio ?? 0), 0
  );

  async function handlePagar() {
    setError("");
    setLoading(true);
    try {
      // Envia comanda a cocina y luego va a la pantalla del QR
      await enviarACocina(comanda.id);
      navigation.navigate("QRPago", { comanda, total });
    } catch (e) {
      setError(e.message || "No se pudo procesar el pago");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Resumen del pedido</Text>
          <Text style={styles.headerSub}>Comanda #{comanda.id}</Text>
        </View>
        <View style={{ width: 70 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Tabla de items */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pedido</Text>
          {resumen.length === 0 ? (
            <Text style={styles.emptyText}>No hay items en esta comanda</Text>
          ) : (
            resumen.map((item, i) => (
              <View key={i} style={styles.lineaItem}>
                <Text style={styles.lineaNombre}>
                  {item.cantidad > 1 ? `${item.cantidad}x ` : ""}
                  {item.nombre}
                </Text>
                <Text style={styles.lineaPrecio}>${item.subtotal.toFixed(2)}</Text>
              </View>
            ))
          )}
          <View style={styles.separador} />
          <View style={styles.lineaTotal}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValor}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Boton pagar */}
        <TouchableOpacity
          style={[styles.btnPagar, loading && styles.btnDisabled]}
          onPress={handlePagar}
          disabled={loading || resumen.length === 0}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#1e1f4a" />
          ) : (
            <>
              <Text style={styles.btnPagarIcon}>📱</Text>
              <Text style={styles.btnPagarText}>Generar QR de pago</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.hint}>
          El pedido se enviará a cocina al confirmar el pago.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#1a1208" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 0.5, borderBottomColor: "#4a3020",
  },
  backBtn: { width: 70 },
  backText: { color: "#A2A3EB", fontSize: 14, fontWeight: "600" },
  headerCenter: { alignItems: "center" },
  headerTitle: { fontSize: 17, fontWeight: "800", color: "#FFD4BD" },
  headerSub: { fontSize: 12, color: "#b09080" },
  scroll: { padding: 20, gap: 20, paddingBottom: 40 },
  card: {
    backgroundColor: "#2a1e14", borderRadius: 16,
    borderWidth: 0.5, borderColor: "#4a3020", padding: 18,
  },
  cardTitle: {
    fontSize: 12, color: "#b09080", textTransform: "uppercase",
    letterSpacing: 0.8, marginBottom: 14,
  },
  lineaItem: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  lineaNombre: { color: "#ede0d4", fontSize: 15, flex: 1, marginRight: 8 },
  lineaPrecio: { color: "#FFD4BD", fontSize: 15, fontWeight: "600" },
  separador: { height: 1, backgroundColor: "#4a3020", marginVertical: 12 },
  lineaTotal: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { fontSize: 16, fontWeight: "700", color: "#d4a898" },
  totalValor: { fontSize: 26, fontWeight: "800", color: "#FFD4BD" },
  btnPagar: {
    backgroundColor: "#A2A3EB", borderRadius: 16,
    paddingVertical: 18, alignItems: "center",
    flexDirection: "row", justifyContent: "center", gap: 10,
  },
  btnDisabled: { backgroundColor: "#3d3e6a" },
  btnPagarIcon: { fontSize: 20 },
  btnPagarText: { color: "#1e1f4a", fontSize: 17, fontWeight: "800" },
  hint: { color: "#7a5a48", fontSize: 13, textAlign: "center", lineHeight: 18 },
  errorText: { color: "#f87171", textAlign: "center", fontSize: 14 },
  emptyText: { color: "#7a5a48", fontSize: 14, textAlign: "center" },
});
