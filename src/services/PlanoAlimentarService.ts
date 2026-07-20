import {
    addDoc,
    collection,
    getDocs,
    query,
    serverTimestamp,
    where,
} from "firebase/firestore";
import { Refeicao } from "../../app/PlanoAlimentar";
import { PlanoAlimentarRepository } from "../repositories/PlanoAlimentarRepository";
import { auth, db } from "../utils/firebaseConfig";

// Essa camada garante que sempre usamos o ID do usuário logado
class PlanoAlimentarServiceClass {
  private repository = new PlanoAlimentarRepository();

  private getUserId(): string {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      throw new Error("Usuário não autenticado.");
    }
    return uid;
  }

  async salvarRefeicao(refeicao: Omit<Refeicao, "id">) {
    const userId = this.getUserId();
    return this.repository.salvar(userId, refeicao);
  }

  async buscarRefeicoes(): Promise<Refeicao[]> {
    const userId = this.getUserId();
    return this.repository.buscarTodas(userId);
  }

  async deletarRefeicao(refeicaoId: string) {
    const userId = this.getUserId();
    return this.repository.deletar(userId, refeicaoId);
  }

  async atualizarRefeicao(refeicaoId: string, refeicao: Omit<Refeicao, "id">) {
    const userId = this.getUserId();
    return this.repository.atualizar(userId, refeicaoId, refeicao);
  }

  // 👇 NOVO: Método para finalizar refeição
  async finalizarRefeicao(refeicaoId: string) {
    const userId = this.getUserId();

    // Cria uma referência para a coleção de histórico
    const concluidasRef = collection(db, "refeicoes_concluidas");

    return await addDoc(concluidasRef, {
      refeicaoId: refeicaoId,
      userId: userId,
      dataConclusao: serverTimestamp(),
    });
  }

  async obterProgressoUsuario(): Promise<number> {
    const userId = this.getUserId();

    try {
      const refeicoesRef = collection(db, "refeicoes");
      const q = query(refeicoesRef, where("userId", "==", userId));

      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error("Erro ao buscar progresso:", error);
      return 0;
    }
  }
}

// Exporta como instância única
export const PlanoAlimentarService = new PlanoAlimentarServiceClass();
