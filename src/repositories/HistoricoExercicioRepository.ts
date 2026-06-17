import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from "firebase/firestore";

import HistoricoExercicio, {
    HistoricoExercicioDados,
} from "../models/HistoricoExercicio";
import { auth, db } from "../utils/firebaseConfig";

class HistoricoExercicioRepository {
  private nomeColecao = "historicoExercicios";

  private getIdUsuario(): string {
    const usuarioLogado = auth.currentUser;

    if (!usuarioLogado) {
      throw new Error("Usuario nao autenticado no Firebase.");
    }

    return usuarioLogado.uid;
  }

  async listar(): Promise<HistoricoExercicio[]> {
    const idUsuario = this.getIdUsuario();
    const historicoRef = collection(db, this.nomeColecao);
    const filtroUsuario = query(
      historicoRef,
      where("usuarioId", "==", idUsuario),
    );
    const resultado = await getDocs(filtroUsuario);

    return resultado.docs
      .map((documento) => {
        const dados = documento.data() as Omit<HistoricoExercicioDados, "id">;

        return new HistoricoExercicio({
          id: documento.id,
          ...dados,
        });
      })
      .sort((atual, proximo) =>
        proximo.dataExecucao.localeCompare(atual.dataExecucao),
      );
  }

  async buscarPorId(id: string): Promise<HistoricoExercicio | null> {
    const idUsuario = this.getIdUsuario();
    const historicoRef = doc(db, this.nomeColecao, id);
    const resultado = await getDoc(historicoRef);

    if (!resultado.exists()) {
      return null;
    }

    const dados = resultado.data() as Omit<HistoricoExercicioDados, "id">;

    if (dados.usuarioId !== idUsuario) {
      return null;
    }

    return new HistoricoExercicio({
      id: resultado.id,
      ...dados,
    });
  }

  async criar(historico: HistoricoExercicio): Promise<HistoricoExercicio> {
    historico.usuarioId = this.getIdUsuario();

    const historicoRef = collection(db, this.nomeColecao);
    const documento = await addDoc(historicoRef, {
      ...historico.toFirestore(),
      criadoEm: serverTimestamp(),
      atualizadoEm: serverTimestamp(),
    });

    historico.id = documento.id;

    return historico;
  }

  async atualizar(historico: HistoricoExercicio): Promise<HistoricoExercicio> {
    if (!historico.id) {
      throw new Error("Nao e possivel atualizar um historico sem ID.");
    }

    const historicoAtual = await this.buscarPorId(historico.id);

    if (!historicoAtual) {
      throw new Error("Historico de exercicio nao encontrado.");
    }

    historico.usuarioId = this.getIdUsuario();

    const historicoRef = doc(db, this.nomeColecao, historico.id);

    await updateDoc(historicoRef, {
      ...historico.toFirestore(),
      atualizadoEm: serverTimestamp(),
    });

    return historico;
  }

  async excluir(id: string): Promise<void> {
    const historicoAtual = await this.buscarPorId(id);

    if (!historicoAtual) {
      throw new Error("Historico de exercicio nao encontrado.");
    }

    const historicoRef = doc(db, this.nomeColecao, id);

    await deleteDoc(historicoRef);
  }
}

export default HistoricoExercicioRepository;
