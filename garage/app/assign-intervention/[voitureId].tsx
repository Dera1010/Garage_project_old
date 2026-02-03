import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { auth } from "../../config/firebaseConfig"; // 🔹 ton config firebase
import { useLocalSearchParams, useRouter } from "expo-router";

export default function AssignIntervention() {
  const router = useRouter();
  const { voitureId } = useLocalSearchParams(); // 🔹 récupère le param de l'URL
  const [interventions, setInterventions] = useState([]);
  const [selectedIntervention, setSelectedIntervention] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch("http://10.98.2.238:8000/api/interventions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();

        // 🔹 backend renvoie { data: [...] }
        if (Array.isArray(json.data)) setInterventions(json.data);
        else setInterventions([]);
      } catch (err) {
        console.error(err);
        Alert.alert("Erreur", "Impossible de charger les interventions");
      }
    };

    fetchInterventions();
  }, []);

  const handleAssignIntervention = async () => {
    if (!selectedIntervention) {
      Alert.alert("Erreur", "Veuillez choisir une intervention");
      return;
    }

    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`http://10.60.244.37:8000/api/voitures/${voitureId}/interventions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ intervention_id: selectedIntervention }),
      });

      if (res.ok) {
        Alert.alert("Succès", "Intervention assignée !");
        router.push("/dashboard"); // retour ou page suivante
      } else {
        const json = await res.json();
        Alert.alert("Erreur", json.message || "Impossible d’assigner l’intervention");
      }
    } catch (err: any) {
      Alert.alert("Erreur", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Intervention voiture #{voitureId}</Text>

      <Text style={styles.subtitle}>Choisir une intervention</Text>
      {interventions.length > 0 ? (
        <Picker
          selectedValue={selectedIntervention}
          onValueChange={(itemValue) => setSelectedIntervention(itemValue)}
        >
          {interventions.map((intervention: any) => (
            <Picker.Item
              key={intervention.id}
              label={intervention.nom}
              value={intervention.id.toString()}
            />
          ))}
        </Picker>
      ) : (
        <Text>Aucune intervention disponible</Text>
      )}

      <Button title="Assigner" onPress={handleAssignIntervention} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  subtitle: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
});
