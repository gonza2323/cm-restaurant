import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginScreen from "./screens/LoginScreen";
import Mesas from "./screens/Mesas"; // Importa el componente Mesas
import ComandasMesa from "./screens/ComandasMesa"; // Importa el nuevo componente ComandasMesa
import ComandaDetailScreen from "./screens/ComandaDetailScreen"; // Importa el nuevo componente ComandaDetailScreen
import PagarScreen from "./screens/PagarScreen";
import QRPagoScreen from "./screens/QRPagoScreen";

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
        {/* Líneas originales comentadas */}
        {/*{user ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}*/}

        {/*Temporalmente renderizando la pantalla Mesas para pruebas*/}
        <Stack.Screen name="MesasTest" component={Mesas} />
        <Stack.Screen name="ComandasMesa" component={ComandasMesa} />
        <Stack.Screen name="ComandaDetailScreen" component={ComandaDetailScreen} />
        {/**/}
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