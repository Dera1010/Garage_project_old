import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { auth } from "../../config/firebaseConfig";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "../../config/apiConfig";
import { Loader } from "../../components/loader";
import { Card } from "../../components/card";
import { Button } from "../../components/button";

export default function Dashboard() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [voitures, setVoitures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return router.replace("/login");

        const token = await user.getIdToken();

        // Fetch user profile
        const userRes = await fetch(`${API_BASE_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        const userData = await userRes.json();
        setName(userData.name);

        // Fetch user's vehicles with interventions
        const voituresRes = await fetch(`${API_BASE_URL}/api/voitures`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        const voituresData = await voituresRes.json();
        setVoitures(voituresData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon Garage 👋</Text>
      <Text style={styles.welcome}>Propriétaire : {name}</Text>

      {loading ? (
        <Loader />
      ) : (
        <ScrollView style={styles.scrollArea}>
          {voitures.length > 0 ? (
            voitures.map((voiture) => (
              <Card key={voiture.id} style={styles.cardOverride}>
                <View style={styles.voitureHeader}>
                  <Text style={styles.voitureName}>{voiture.make} {voiture.model}</Text>
                  <Text style={styles.voiturePlate}>{voiture.license_plate}</Text>
                </View>

                <Text style={styles.interventionTitle}>Interventions :</Text>
                {voiture.voiture_interventions && voiture.voiture_interventions.length > 0 ? (
                  voiture.voiture_interventions.flatMap((vi: any) =>
                    vi.details?.map((detail: any) => ({
                      ...detail,
                      parentStatus: vi.status
                    })) || []
                  ).length > 0 ? (
                    voiture.voiture_interventions.map((vi: any) => (
                      vi.details?.map((detail: any) => (
                        <View key={detail.id} style={styles.interventionItem}>
                          <Text style={styles.interventionName}>
                            • {detail.intervention ? detail.intervention.nom : 'Intervention inconnue'}
                          </Text>
                          <Text style={styles.interventionStatus}>
                            {detail.status === 'en attente' ? '⏳ En attente' : '✅ Terminé'}
                          </Text>
                        </View>
                      ))
                    ))
                  ) : (
                    <Text style={styles.noData}>Aucun détail d&apos;intervention disponible</Text>
                  )
                ) : (
                  <Text style={styles.noData}>Aucune intervention prévue</Text>
                )}
              </Card>
            ))
          ) : (
            <Text style={styles.noData}>Vous n&apos;avez pas encore ajouté de voiture.</Text>
          )}
        </ScrollView>
      )}

      <View style={styles.footer}>
        <Button title="Gestion de paiement" onPress={() => router.push("/paiement")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 28, fontWeight: "bold", marginTop: 40, marginBottom: 5 },
  welcome: { fontSize: 16, color: "#666", marginBottom: 20 },
  scrollArea: { flex: 1, marginBottom: 20 },
  cardOverride: { marginBottom: 15 },
  infoText: { textAlign: "center", marginTop: 20 },
  voitureCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  voitureHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15, borderBottomWidth: 1, borderBottomColor: "#eee", paddingBottom: 10 },
  voitureName: { fontSize: 20, fontWeight: "bold", color: "#333" },
  voiturePlate: { fontSize: 14, color: "#2196F3", fontWeight: "600", backgroundColor: "#E3F2FD", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5 },
  interventionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10, color: "#555" },
  interventionItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8, paddingLeft: 10 },
  interventionName: { fontSize: 15, color: "#444" },
  interventionStatus: { fontSize: 13, fontWeight: "500" },
  noData: { color: "#999", fontStyle: "italic", marginLeft: 10 },
  footer: { marginTop: "auto", width: "100%", paddingBottom: 10 },
});
