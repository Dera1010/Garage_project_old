import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAaSslIV0rC4U5rjdf95wtjamHeTyS8fpk",
  authDomain: "projet-garage-18528.firebaseapp.com",
  databaseURL: "https://projet-garage-18528-default-rtdb.firebaseio.com",
  projectId: "projet-garage-18528",
  storageBucket: "projet-garage-18528.firebasestorage.app",
  messagingSenderId: "470326200273",
  appId: "1:470326200273:web:a07d6fed7878f77c0042f0",
  measurementId: "G-NXEN7E1WF2"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
