import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage"; // Importamos o AsyncStorage
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth"; // Mudamos aqui!
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// Inicializa o Firebase App
const app = initializeApp(firebaseConfig);

// Inicializa o Auth com PERSISTÊNCIA para o usuário não ser deslogado na troca de telas/galeria
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Inicializa o Firestore
const db = getFirestore(app);

export { app, auth, db };
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

class FirebaseEnvironment {
  static read() {
    return {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    };
  }
}

class FirebaseClient {
  readonly app: FirebaseApp;
  readonly auth: Auth;
  readonly db: Firestore;

  constructor() {
    this.app = getApps().length
      ? getApp()
      : initializeApp(FirebaseEnvironment.read());
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
  }
}

const firebaseClient = new FirebaseClient();

export const app = firebaseClient.app;
export const auth = firebaseClient.auth;
export const db = firebaseClient.db;
export default firebaseClient;
