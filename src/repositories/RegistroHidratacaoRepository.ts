import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import RegistroHidratacao, {
  RegistroHidratacaoDados,
} from "../models/RegistroHidratacao";
import { db } from "../utils/firebaseConfig";

class RegistroHidratacaoRepository {
  private nomeColecao = "registrosHidratacao";

  private colecaoDoUsuario(usuarioId: string) {
    return collection(db, "users", usuarioId, this.nomeColecao);
  }

  private documentoDoUsuario(usuarioId: string, registroId: string) {
    return doc(db, "users", usuarioId, this.nomeColecao, registroId);
  }

  async listar(usuarioId: string): Promise<RegistroHidratacao[]> {
    const consulta = query(
      this.colecaoDoUsuario(usuarioId),
      orderBy("dataHora", "desc"),
    );
    const resultado = await getDocs(consulta);

    return resultado.docs.map((documento) => {
      const dados = documento.data() as Omit<RegistroHidratacaoDados, "id">;

      return new RegistroHidratacao({ id: documento.id, ...dados });
    });
  }

  async buscarPorId(
    usuarioId: string,
    registroId: string,
  ): Promise<RegistroHidratacao | null> {
    const referencia = this.documentoDoUsuario(usuarioId, registroId);
    const resultado = await getDoc(referencia);

    if (!resultado.exists()) {
      return null;
    }

    const dados = resultado.data() as Omit<RegistroHidratacaoDados, "id">;
    return new RegistroHidratacao({ id: resultado.id, ...dados });
  }

  async criar(registro: RegistroHidratacao): Promise<RegistroHidratacao> {
    const documento = await addDoc(
      this.colecaoDoUsuario(registro.usuarioId),
      {
        ...registro.toFirestore(),
        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp(),
      },
    );

    registro.id = documento.id;
    return registro;
  }

  async atualizar(registro: RegistroHidratacao): Promise<RegistroHidratacao> {
    if (!registro.id) {
      throw new Error("Não é possível atualizar um registro sem ID.");
    }

    const referencia = this.documentoDoUsuario(
      registro.usuarioId,
      registro.id,
    );

    await updateDoc(referencia, {
      ...registro.toFirestore(),
      atualizadoEm: serverTimestamp(),
    });

    return registro;
  }

  async excluir(usuarioId: string, registroId: string): Promise<void> {
    await deleteDoc(this.documentoDoUsuario(usuarioId, registroId));
  }
}

export default RegistroHidratacaoRepository;
