import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Adicione essa linha
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAoeDdAknszJyXZ2D-qGzRFVnUPne-6uaI",
  authDomain: "fitmatch-dsi.firebaseapp.com",
  projectId: "fitmatch-dsi",
  storageBucket: "fitmatch-dsi.firebasestorage.app",
  messagingSenderId: "320194100054",
  appId: "1:320194100054:web:e4bb5f55c08861a4c0b4f7",
  measurementId: "G-919M9V2FVR",
};

// Lógica correta para não duplicar
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Inicializa os serviços
const db = getFirestore(app);
const auth = getAuth(app); // Inicializa o Auth de forma simples

// Exporta tudo para usar nas outras telas
export { app, auth, db };

