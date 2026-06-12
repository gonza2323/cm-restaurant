import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginScreen from "./screens/LoginScreen";
import Mesas from "./screens/Mesas";
import ComandasMesa from "./screens/ComandasMesa";
import ComandaDetailScreen from "./screens/ComandaDetailScreen";
import Carta from "./screens/Carta";
import PagarScreen from "./screens/PagarScreen";
import QRPagoScreen from "./screens/QRPagoScreen"; // Asegúrate de que este componente exista

function HomeScreen() {
    // Asumimos que la pantalla principal después del login es Mesas
    // Si necesitas una pantalla de inicio diferente, puedes crearla aquí
    return <Mesas />;
}

const Stack = createNativeStackNavigator();

function RootNavigator() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#A2A3EB" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    // Si el usuario está autenticado, muestra la pantalla principal (Mesas)
                    <Stack.Screen name="Home" component={HomeScreen} />
                ) : (
                    // De lo contrario, muestra la pantalla de Login
                    <Stack.Screen name="Login" component={LoginScreen} />
                )}

                {/* Pantallas de la aplicación */}
                {/* Mesas ya se renderiza como Home si el usuario está logueado */}
                <Stack.Screen name="ComandasMesa" component={ComandasMesa} />
                <Stack.Screen name="ComandaDetailScreen" component={ComandaDetailScreen} />
                <Stack.Screen name="Carta" component={Carta} />
                <Stack.Screen name="Pagar" component={PagarScreen} />
                <Stack.Screen name="QRPago" component={QRPagoScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <RootNavigator />
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1a1208" },
});