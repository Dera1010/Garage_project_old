import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { auth } from "../../config/firebaseConfig";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "../../config/apiConfig";
import { Form, FormInput } from "../../components/form";

export default function Home() {
    const router = useRouter();
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [annee, setAnnee] = useState("");
    const [licensePlate, setLicensePlate] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const user = auth.currentUser;
            if (!user) router.replace("/login");
        };
        fetchUser();
    }, [router]);

    const handleAddVoiture = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return Alert.alert("Erreur", "Utilisateur non connecté");

            setLoading(true);
            const token = await user.getIdToken(true);
            const res = await fetch(`${API_BASE_URL}/api/voitures`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ make, model, annee, license_plate: licensePlate }),
            });

            const data = await res.json();

            if (res.ok) {
                Alert.alert("Succès", "Voiture ajoutée !");

                // 🔹 rediriger vers assign-intervention avec id dynamique
                const voitureInterventionId = data.voiture_intervention.id;
                router.push({
                    pathname: "/assign-intervention/[voitureInterventionId]" as any,
                    params: { voitureInterventionId: voitureInterventionId.toString() },
                });
            } else {
                Alert.alert("Erreur", data.message || "Impossible d'ajouter la voiture");
            }
        } catch (error: any) {
            Alert.alert("Erreur", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Form
                title="Ajouter une voiture"
                buttonTitle="Ajouter et continuer"
                loading={loading}
                onSubmit={handleAddVoiture}
            >
                <FormInput
                    placeholder="Marque (ex: Toyota)"
                    value={make}
                    onChangeText={setMake}
                />
                <FormInput
                    placeholder="Modèle (ex: Corolla)"
                    value={model}
                    onChangeText={setModel}
                />
                <FormInput
                    placeholder="Année (ex: 2022)"
                    value={annee}
                    onChangeText={setAnnee}
                    keyboardType="numeric"
                />
                <FormInput
                    placeholder="Plaque d'immatriculation"
                    value={licensePlate}
                    onChangeText={setLicensePlate}
                />
            </Form>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: "center" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 30, textAlign: "center" },
    subtitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
    input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, marginBottom: 15, padding: 12 },
});
