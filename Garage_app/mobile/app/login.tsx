import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { auth } from "../config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "../config/apiConfig";
import { Form, FormInput } from "../components/form";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // 🔹 LOGIN
  const handleLogin = async () => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      const res = await fetch(`${API_BASE_URL}/api/login-firebase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        router.replace("/(tabs)");
      } else {
        const data = await res.json();
        setMessage(data.error || "Erreur lors du login");
      }

    } catch (error: any) {
      setMessage(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Form title="Sign In" buttonTitle="Sign In" loading={loading} onSubmit={handleLogin}>
        <FormInput
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <FormInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </Form>

      {message ? <Text style={styles.message}>{message}</Text> : null}
      
        <TouchableOpacity onPress={() => router.push("/register")} style={{ marginTop: 20 }}>
          <Text style={{ textAlign: "center", color: "#1089D3" }}>
            Pas de compte ? Créer un compte
          </Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  forgotPassword: {
    marginTop: 10,
    marginLeft: 10,
  },
  forgotPasswordText: {
    fontSize: 11,
    color: "#0099ff",
  },
  message: { marginTop: 20, textAlign: "center", color: "red" },
});
