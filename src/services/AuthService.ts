import {
  createUserWithEmailAndPassword,
<<<<<<< Updated upstream
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
=======
  signInWithEmailAndPassword, // ADICIONADO para fazer login
  signOut, // ADICIONADO para sair
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebaseConfig";

class AuthService {
  // --- FUNÇÃO DE CADASTRO (Já estava certa!) ---
>>>>>>> Stashed changes
  async register(nome: string, email: string, senha: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
<<<<<<< Updated upstream
        email,
=======
        email.trim(),
>>>>>>> Stashed changes
        senha,
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: nome });

      await setDoc(doc(db, "usuarios", user.uid), {
<<<<<<< Updated upstream
        nome,
        email,
=======
        nome: nome,
        email: email.trim().toLowerCase(),
>>>>>>> Stashed changes
        uid: user.uid,
        createdAt: serverTimestamp(),
        status: "ativo",
      });

      return user;
    } catch (error: any) {
      console.error("DEBUG - ERRO REAL DO FIREBASE:", error);

      let message = "Ocorreu um erro inesperado.";
<<<<<<< Updated upstream

      switch (error.code) {
        case "auth/email-already-in-use":
          message = "Este e-mail ja esta em uso.";
          break;
        case "auth/invalid-email":
          message = "E-mail invalido.";
=======
      switch (error.code) {
        case "auth/email-already-in-use":
          message = "Este e-mail já está em uso.";
          break;
        case "auth/invalid-email":
          message = "E-mail inválido.";
>>>>>>> Stashed changes
          break;
        case "auth/weak-password":
          message = "A senha deve ter pelo menos 6 caracteres.";
          break;
        case "permission-denied":
<<<<<<< Updated upstream
          message = "Erro de permissao ao salvar no banco de dados.";
          break;
      }

=======
          message = "Erro de permissão no banco de dados.";
          break;
      }
>>>>>>> Stashed changes
      throw new Error(message);
    }
  }

<<<<<<< Updated upstream
=======
  // --- 1. ADICIONADO: FUNÇÃO PARA FAZER LOGIN ---
>>>>>>> Stashed changes
  async login(email: string, senha: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        senha,
      );
<<<<<<< Updated upstream

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
=======
      return userCredential.user;
    } catch (error: any) {
      let message = "E-mail ou senha incorretos.";
      if (error.code === "auth/user-not-found")
        message = "Usuário não encontrado.";
      if (error.code === "auth/wrong-password") message = "Senha incorreta.";
      throw new Error(message);
    }
  }

  // --- 2. ADICIONADO: FUNÇÃO PARA SAIR DO APP ---
  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error("Erro ao deslogar.");
>>>>>>> Stashed changes
    }
  }
}

export default new AuthService();
