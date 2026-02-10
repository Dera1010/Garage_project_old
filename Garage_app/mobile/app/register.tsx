import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { auth } from "../config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "../config/apiConfig";
import { Form, FormInput } from "../components/form";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleRegister = async () => {
        try {
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();

            const res = await fetch(`${API_BASE_URL}/api/register-firebase`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ email, name }),
            });

            if (res.ok) {
                router.replace("/(tabs)");
            } else {
                const data = await res.json();
                setMessage(data.error || "Erreur lors de la création");
            }
        } catch (error: any) {
            setMessage(`Erreur: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Form title="Sign up" buttonTitle="Sign up" loading={loading} onSubmit={handleRegister}>
                <FormInput
                    placeholder="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <FormInput
                    placeholder="Mot de passe"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <FormInput
                    placeholder="Nom"
                    value={name}
                    onChangeText={setName}
                />
            </Form>

            {message ? <Text style={styles.message}>{message}</Text> : null}

            <TouchableOpacity onPress={() => router.push("/login")} style={{ marginTop: 20 }}>
                <Text style={{ textAlign: "center", color: "#1089D3" }}>
                    Déjà un compte ? Connectez-vous
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    message: { marginTop: 20, textAlign: "center", color: "red" },
});
