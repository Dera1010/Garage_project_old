import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { auth } from "../config/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  // 🔹 REGISTER
  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      // Appel API Laravel pour créer email + role dans Postgres
      const res = await fetch("http://10.98.2.238:8000/api/register-firebase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        router.replace("/complete-profile"); // 🔹 redirige vers complete-profile
      } else {
        const data = await res.json();
        setMessage(data.error || "Erreur lors de la création");
      }

    } catch (error: any) {
      setMessage(`Erreur: ${error.message}`);
    }
  };

  // 🔹 LOGIN
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      const res = await fetch("http://10.60.244.37:8000/api/login-firebase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        router.replace("/dashboard"); // après login
      } else {
        const data = await res.json();
        setMessage(data.error || "Erreur lors du login");
      }

    } catch (error: any) {
      setMessage(`Erreur: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Garage App</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Register" onPress={handleRegister} />
      <Button title="Login" onPress={handleLogin} />
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
