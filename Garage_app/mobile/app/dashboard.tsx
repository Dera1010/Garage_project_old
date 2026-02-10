import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { auth } from "../config/firebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [annee, setAnnee] = useState("");
  const [licensePlate, setLicensePlate] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return router.replace("/login");

      const token = await user.getIdToken();
      const res = await fetch("http://10.117.218.238:8000/api/me", {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      const data = await res.json();
      setName(data.name);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  const handleAddVoiture = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return Alert.alert("Erreur", "Utilisateur non connecté");

      const token = await user.getIdToken(true);
      const res = await fetch("http://10.60.244.37:8000/api/voitures", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ make, model, annee, license_plate: licensePlate }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Succès", "Voiture ajoutée !");
        // reset form
        setMake("");
        setModel("");
        setAnnee("");
        setLicensePlate("");

        // 🔹 rediriger vers assign-intervention avec id dynamique
        const voitureId = data.voiture.id;
          router.push({
          pathname: "/assign-intervention/[voitureId]",
          params: { voitureId: voitureId.toString() },
        });
      } else {
        Alert.alert("Erreur", data.message || "Impossible d'ajouter la voiture");
      }
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue {name} 👋</Text>
      <Button title="Logout" onPress={handleLogout} />

      <Text style={styles.subtitle}>Ajouter une voiture</Text>
      <TextInput style={styles.input} placeholder="Marque" value={make} onChangeText={setMake} />
      <TextInput style={styles.input} placeholder="Modèle" value={model} onChangeText={setModel} />
      <TextInput style={styles.input} placeholder="Année" value={annee} onChangeText={setAnnee} keyboardType="numeric" />
      <TextInput
        style={styles.input}
        placeholder="Plaque d'immatriculation"
        value={licensePlate}
        onChangeText={setLicensePlate}
      />
      <Button title="Ajouter" onPress={handleAddVoiture} />
      <Text style={styles.title}>Gestion de paiement</Text>
      <Button title="Paiement" onPress={() => router.push("/paiement")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  subtitle: { fontSize: 20, fontWeight: "bold", marginTop: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, marginBottom: 10, padding: 10 },
});
