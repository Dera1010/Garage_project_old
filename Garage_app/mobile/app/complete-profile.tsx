import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { auth } from "../config/firebaseConfig";
import { useRouter } from "expo-router";

export default function CompleteProfile() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleComplete = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Utilisateur non connecté");

      const token = await user.getIdToken();

      const res = await fetch("http://10.117.218.238:8000/api/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        router.replace("/login"); // 🔹 après completion retour login
      } else {
        const data = await res.json();
        setMessage(data.error || "Erreur lors de la mise à jour");
      }
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Compléter Profil</Text>
      <TextInput style={styles.input} placeholder="Nom" value={name} onChangeText={setName} />
      <Button title="Valider" onPress={handleComplete} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", marginBottom: 10, padding: 10, borderRadius: 5 },
  message: { marginTop: 20, textAlign: "center", color: "red" },
});
