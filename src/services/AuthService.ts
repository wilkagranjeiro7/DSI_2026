import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../utils/firebaseConfig";

class AuthService {
  async register(nome: string, email: string, senha: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha,
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: nome });

      await setDoc(doc(db, "usuarios", user.uid), {
        nome,
        email,
        uid: user.uid,
        createdAt: serverTimestamp(),
        status: "ativo",
      });

      return user;
    } catch (error: any) {
      console.error("DEBUG - ERRO REAL DO FIREBASE:", error);

      let message = "Ocorreu um erro inesperado.";

      switch (error.code) {
        case "auth/email-already-in-use":
          message = "Este e-mail ja esta em uso.";
          break;
        case "auth/invalid-email":
          message = "E-mail invalido.";
          break;
        case "auth/weak-password":
          message = "A senha deve ter pelo menos 6 caracteres.";
          break;
        case "permission-denied":
          message = "Erro de permissao ao salvar no banco de dados.";
          break;
      }

      throw new Error(message);
    }
  }

  async login(email: string, senha: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        senha,
      );

      await addDoc(collection(db, "loginHistorico"), {
        email: email.trim(),
        uid: userCredential.user.uid,
        data: serverTimestamp(),
      });

      return userCredential.user;
    } catch (error: any) {
      console.error("DEBUG - ERRO REAL DO LOGIN:", error);

      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        throw new Error("E-mail ou senha incorretos.");
      }

      if (error.code === "auth/invalid-email") {
        throw new Error("E-mail invalido.");
      }

      throw new Error("Falha ao conectar com o servidor. Verifique sua internet.");
    }
  }
}

export default new AuthService();
