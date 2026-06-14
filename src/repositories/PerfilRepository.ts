import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import Perfil, { PerfilDados } from "../models/Perfil";
import { auth, db } from "../utils/firebaseConfig"; // 🌟 Importado o 'auth' aqui

class PerfilRepository {
  private nomeColecao = "perfis";

  // 🌟 FUNÇÃO AUXILIAR: Pega o ID do usuário logado dinamicamente
  private getIdUsuario(): string {
    const usuarioLogado = auth.currentUser;
    if (!usuarioLogado) {
      throw new Error("Usuário não autenticado no Firebase.");
    }
    return usuarioLogado.uid; // Retorna o UID real (ex: "g7Xy2...") em vez de "perfil_demo"
  }

  async buscarPerfil(): Promise<Perfil | null> {
    const idUsuario = this.getIdUsuario(); // 🌟 Dinâmico
    const perfilRef = doc(db, this.nomeColecao, idUsuario);
    const resultado = await getDoc(perfilRef);

    if (!resultado.exists()) {
      return null;
    }

    const dados = resultado.data() as Omit<PerfilDados, "id">;

    return new Perfil({
      id: resultado.id,
      ...dados,
    });
  }

  async salvar(perfil: Perfil): Promise<Perfil> {
    const idUsuario = this.getIdUsuario(); // 🌟 Dinâmico
    const perfilRef = doc(db, this.nomeColecao, idUsuario);

    await setDoc(
      perfilRef,
      {
        ...perfil.toFirestore(),
        atualizadoEm: serverTimestamp(),
      },
      { merge: true }
    );

    perfil.id = idUsuario;

    return perfil;
  }

  async excluir(): Promise<void> {
    const idUsuario = this.getIdUsuario(); // 🌟 Dinâmico
    const perfilRef = doc(db, this.nomeColecao, idUsuario);

    await deleteDoc(perfilRef);
  }
}

export default PerfilRepository;