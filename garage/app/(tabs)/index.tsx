// app/tabs/index.tsx
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { auth } from "../../config/firebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/"); // retourne à l'écran login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur le Dashboard</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
