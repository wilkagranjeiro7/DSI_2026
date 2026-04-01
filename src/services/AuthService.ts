import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";

class AuthService {
  /**
   * Encapsula a criação de usuário. 
   * Lança erros amigáveis para serem tratados na View.
   */
  async register(nome: string, email: string, senha: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      
      // Atualiza o nome do usuário no perfil
      await updateProfile(userCredential.user, { displayName: nome });
      
      return userCredential.user;
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
      }
      
      throw new Error(message + error);
    }
  }
}

// Exporta uma instância única (Singleton)
export default new AuthService();