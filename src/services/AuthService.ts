import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; // IMPORTANTE: novas funções
import { auth, db } from "../utils/firebaseConfig"; // IMPORTANTE: importando o 'db'

class AuthService {
  /**
   * Encapsula a criação de usuário no Auth e salvamento no Firestore.
   */
  async register(nome: string, email: string, senha: string) {
    try {
      // 1. Cria o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
      
      // 2. Atualiza o nome do usuário no perfil do Auth
      await updateProfile(user, { displayName: nome });

      // 3. SALVA NO FIRESTORE
      // Criamos um documento na coleção "usuarios" usando o UID do Auth como ID do documento
      await setDoc(doc(db, "usuarios", user.uid), {
        nome: nome,
        email: email,
        uid: user.uid,
        createdAt: serverTimestamp(), // Registra a hora exata no servidor
        status: "ativo"
      });
      
      return user;
    } catch (error: any) {
      let message = "Ocorreu um erro inesperado.";
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = "Este e-mail já está em uso.";
          break;
        case 'auth/invalid-email':
          message = "E-mail inválido.";
          break;
        case 'auth/weak-password':
          message = "A senha deve ter pelo menos 6 caracteres.";
          break;
        // Erro comum de permissão do Firestore
        case 'permission-denied':
          message = "Erro de permissão ao salvar no banco de dados.";
          break;
      }
      
      throw new Error(message);
    }
  }
}

export default new AuthService();