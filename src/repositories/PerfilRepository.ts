import {
    deleteDoc,
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";

import Perfil, { PerfilDados } from "../models/Perfil";
import { db } from "../utils/firebaseConfig";

class PerfilRepository {
  private nomeColecao = "perfis";
  private idPadrao = "perfil_demo";

  async buscarPerfil(): Promise<Perfil | null> {
    const perfilRef = doc(db, this.nomeColecao, this.idPadrao);
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
    const perfilRef = doc(db, this.nomeColecao, this.idPadrao);

    await setDoc(
      perfilRef,
      {
        ...perfil.toFirestore(),
        atualizadoEm: serverTimestamp(),
      },
      { merge: true }
    );

    perfil.id = this.idPadrao;

    return perfil;
  }

  async excluir(): Promise<void> {
    const perfilRef = doc(db, this.nomeColecao, this.idPadrao);

    await deleteDoc(perfilRef);
  }
}

export default PerfilRepository;