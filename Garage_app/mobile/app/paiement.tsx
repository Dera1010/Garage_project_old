import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Paiement(){
    const router = useRouter();
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Garage App</Text>
          <Button title="Login" onPress={() => router.push("/paiement")} />
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: { flex: 1, justifyContent: "center", alignItems: "center" },
      title: { fontSize: 24, fontWeight: "bold" },
    });
