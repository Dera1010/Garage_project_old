import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { Loader } from "../components/loader";

export default function RootIndex() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/(tabs)");
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [router]);

  if(loading) {
    return (
      <View style={styles.container}>
        <Loader/>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Garage App</Text>
      <Button title="Commencer" onPress={() => router.push("/login")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 30, color: "#2196F3" },
});
