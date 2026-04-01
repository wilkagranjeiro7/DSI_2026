import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyAoeDdAknSzJyXZ2D-qGzRFVnUPne-6uaI",
  authDomain: "fitmatch-dsi.firebaseapp.com",
  projectId: "fitmatch-dsi",
  storageBucket: "fitmatch-dsi.firebasestorage.app",
  messagingSenderId: "320194100054",
  appId: "1:320194100054:web:e4bb5f55c08861a4c0b4f7",
};

const app = initializeApp(firebaseConfig);

// Inicializa o Firestore
const db = getFirestore(app); 

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth, db };
export default app;