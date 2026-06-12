import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";
import { generarQRPago } from "../api/client";

export default function QRPagoScreen({ route, navigation }) {
  const { idsComandas, total } = route.params;

  const [qrValue, setQrValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (idsComandas && idsComandas.length > 0) {
      generarQR();
    } else {
      setError("IDs de comandas no válidos.");
      setLoading(false);
    }
  }, [idsComandas]);

  async function generarQR() {
    setError("");
    setLoading(true);
    try {
      const response = await generarQRPago(idsComandas);
      console.log(response.urlDePago);
      // Modificado: Ahora esperamos 'urlDePago' en lugar de 'qr_code'
      if (response.urlDePago) {
        setQrValue(response.urlDePago);
      } else {
        setError("La respuesta de la API no contiene una URL de pago válida.");
      }
    } catch (e) {
      console.error("Error generando QR:", e);
      setError(e.message || "No se pudo generar el QR");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🍽️ Lo de Fer</Text>
        <Text style={styles.headerSub}>QR de pago — Comandas #{idsComandas.join(', #')}</Text>
      </View>

      <View style={styles.body}>
        {loading ? (
          <>
            <ActivityIndicator size="large" color="#A2A3EB" />
            <Text style={styles.loadingText}>Generando QR...</Text>
          </>
        ) : error ? (
          <>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={generarQR}>
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.instruccion}>
              Mostrá este código al cliente para que pague con Mercado Pago
            </Text>

            <View style={styles.qrBox}>
              {qrValue ? (
                <QRCode
                  value={qrValue}
                  size={230}
                  color="#1a1208"
                  backgroundColor="#FFD4BD"
                />
              ) : (
                <Text style={styles.emptyText}>QR no disponible.</Text>
              )}
            </View>

            <Text style={styles.monto}>${total.toFixed(2)}</Text>
            <Text style={styles.montoLabel}>Total a pagar</Text>
          </>
        )}
      </View>

      {!loading && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.btnVolver}
            onPress={() => navigation.popToTop()}
          >
            <Text style={styles.btnVolverText}>✓ Listo — volver a mesas</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#1a1208" },
  header: {
    alignItems: "center", paddingVertical: 20,
    borderBottomWidth: 0.5, borderBottomColor: "#4a3020",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#FFD4BD" },
  headerSub: { fontSize: 12, color: "#b09080", marginTop: 4 },
  body: {
    flex: 1, alignItems: "center", justifyContent: "center",
    paddingHorizontal: 28, gap: 18,
  },
  instruccion: {
    color: "#b09080", fontSize: 14, textAlign: "center",
    lineHeight: 20, marginBottom: 4,
  },
  qrBox: {
    backgroundColor: "#FFD4BD", borderRadius: 24, padding: 22,
    shadowColor: "#000", shadowOpacity: 0.5, shadowRadius: 16, elevation: 10,
  },
  monto: { fontSize: 36, fontWeight: "800", color: "#FFD4BD", marginTop: 8 },
  montoLabel: { fontSize: 13, color: "#b09080" },
  loadingText: { color: "#b09080", fontSize: 14, marginTop: 12 },
  errorText: { color: "#f87171", fontSize: 15, textAlign: "center" },
  retryBtn: {
    backgroundColor: "#A2A3EB", borderRadius: 12,
    paddingHorizontal: 24, paddingVertical: 12,
  },
  retryText: { color: "#1e1f4a", fontWeight: "700", fontSize: 15 },
  footer: {
    paddingHorizontal: 24, paddingBottom: 32, paddingTop: 12,
    borderTopWidth: 0.5, borderTopColor: "#4a3020",
  },
  btnVolver: {
    backgroundColor: "#A2A3EB", borderRadius: 14,
    paddingVertical: 16, alignItems: "center",
  },
  btnVolverText: { color: "#1e1f4a", fontSize: 16, fontWeight: "800" },
});