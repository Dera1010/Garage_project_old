import { Tabs, useRouter } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Ionicons } from "@expo/vector-icons";
import { Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebaseConfig';

export default function TabLayout() {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      "Déconnexion",
      "Voulez-vous vraiment vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Oui", onPress: async () => {
            await signOut(auth);
            router.replace("/login");
          }
        }
      ]
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2196F3', // Bleu
        tabBarInactiveTintColor: '#000000', // Noir
        tabBarShowLabel: false,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tableau de Bord',
          tabBarIcon: ({ color }) => <Ionicons size={26} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Ajout Voiture',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="add-circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="logout"
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleLogout();
          },
        }}
        options={{
          title: 'Se deconnecter',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="log-out" color={color} />,
        }}
      />
    </Tabs>
  );
}
