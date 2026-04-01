// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAoeDdAknSzJyXZ2D-qGzRFVnUPne-6uaI",
  authDomain: "fitmatch-dsi.firebaseapp.com",
  projectId: "fitmatch-dsi",
  storageBucket: "fitmatch-dsi.firebasestorage.app",
  messagingSenderId: "320194100054",
  appId: "1:320194100054:web:e4bb5f55c08861a4c0b4f7",
};

const app = initializeApp(firebaseConfig);

// Inicializa o Auth com persistência para o usuário não precisar logar toda hora
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };
export default app;
