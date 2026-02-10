import React, { useState, useEffect } from "react";
import { View, Text, Alert, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { auth } from "../../config/firebaseConfig";
import { useLocalSearchParams, useRouter } from "expo-router";
import { API_BASE_URL } from "../../config/apiConfig";
import { Loader } from "../../components/loader";
import { Card } from "../../components/card";
import { Button } from "../../components/button";

export default function AssignIntervention() {
  const router = useRouter();
  const { voitureInterventionId } = useLocalSearchParams();
  const [interventions, setInterventions] = useState<any[]>([]);
  const [selectedInterventions, setSelectedInterventions] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`${API_BASE_URL}/api/interventions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (Array.isArray(json.data)) setInterventions(json.data);
        else if (Array.isArray(json)) setInterventions(json); // Cas où le backend renvoie direct l'array
        else setInterventions([]);
      } catch (err) {
        console.error(err);
        Alert.alert("Erreur", "Impossible de charger les interventions");
      }
    };
    fetchInterventions();
  }, []);

  const toggleIntervention = (id: number) => {
    setSelectedInterventions((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAssignInterventions = async () => {
    if (selectedInterventions.length === 0) {
      Alert.alert("Erreur", "Veuillez choisir au moins une intervention");
      return;
    }

    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`${API_BASE_URL}/api/voitures/${voitureInterventionId}/interventions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ intervention_ids: selectedInterventions }),
      });

      if (res.ok) {
        Alert.alert("Succès", "Interventions assignées !");
        router.push("/(tabs)");
      } else {
        const json = await res.json();
        Alert.alert("Erreur", json.message || "Impossible d’assigner les interventions");
      }
    } catch (err: any) {
      Alert.alert("Erreur", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Interventions pour votre voiture</Text>
      <Text style={styles.instruction}>Sélectionnez les interventions nécessaires :</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading && !interventions.length ? (
          <Loader />
        ) : interventions.length > 0 ? (
          interventions.map((intervention: any) => {
            const isSelected = selectedInterventions.includes(intervention.id);
            return (
              <TouchableOpacity
                key={intervention.id}
                onPress={() => toggleIntervention(intervention.id)}
                activeOpacity={0.8}
              >
                <Card
                  gradientColors={isSelected ? ["#2196F3", "#12B1D1"] : ["#F4F7FB", "#FFFFFF"]}
                  style={[styles.cardOverride, isSelected ? styles.selectedCard : {}]}
                >
                  <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, isSelected && styles.selectedText]}>
                      {intervention.nom}
                    </Text>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <View style={styles.cardDetails}>
                    <Text style={[styles.cardPrice, isSelected && styles.selectedText]}>
                      {intervention.prix} Ar
                    </Text>
                    <Text style={[styles.cardTime, isSelected && styles.selectedText]}>
                      🕒 {intervention.time} min
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })
        ) : (
          <Text style={styles.emptyText}>Aucune intervention disponible</Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.selectedCount}>
          {selectedInterventions.length} intervention(s) sélectionnée(s)
        </Text>
        {loading && interventions.length ? (
          <Loader />
        ) : (
          <Button
            title="Valider la sélection"
            onPress={handleAssignInterventions}
            disabled={loading || selectedInterventions.length === 0}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginTop: 40, marginBottom: 10, textAlign: "center", color: "#333" },
  instruction: { fontSize: 16, color: "#666", marginBottom: 20, textAlign: "center" },
  scrollContent: { paddingBottom: 20 },
  cardOverride: { marginBottom: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedCard: {
    backgroundColor: "#2196F3",
    borderColor: "#1976D2",
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  checkmark: { fontSize: 20, color: "#fff", fontWeight: "bold" },
  selectedText: { color: "#fff" },
  cardDetails: { flexDirection: "row", justifyContent: "space-between" },
  cardPrice: { fontSize: 16, fontWeight: "600", color: "#4CAF50" },
  cardTime: { fontSize: 14, color: "#888" },
  emptyText: { textAlign: "center", marginTop: 50, color: "#999", fontSize: 16 },
  footer: { borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 15, paddingBottom: 10 },
  selectedCount: { textAlign: "center", marginBottom: 10, color: "#666", fontWeight: "500" },
});
