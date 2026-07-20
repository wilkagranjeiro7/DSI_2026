import { collection, getDocs, query, where } from "firebase/firestore";
import { Refeicao } from "../../app/PlanoAlimentar";
import { PlanoAlimentarRepository } from "../repositories/PlanoAlimentarRepository";
// 👇 Note que eu adicionei o 'db' aqui na importação do firebaseConfig
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

  // 👇 expõe a exclusão pro resto do app
  async deletarRefeicao(refeicaoId: string) {
    const userId = this.getUserId();
    return this.repository.deletar(userId, refeicaoId);
  }

  // 👇 expõe a atualização pro resto do app (evita duplicar ao editar)
  async atualizarRefeicao(refeicaoId: string, refeicao: Omit<Refeicao, "id">) {
    const userId = this.getUserId();
    return this.repository.atualizar(userId, refeicaoId, refeicao);
  }

  // 👇 NOVO: Busca a quantidade de refeições para a tela de Progresso
  async obterProgressoUsuario(): Promise<number> {
    const userId = this.getUserId();

    try {
      // Vai no banco de dados na "gaveta" chamada "refeicoes"
      // ⚠️ Verifique se o nome da sua coleção no banco é "refeicoes" mesmo
      const refeicoesRef = collection(db, "refeicoes");

      const q = query(
        refeicoesRef,
        where("userId", "==", userId),
        // Se você usar um status de "concluída" depois, pode colocar aqui!
      );

      const snapshot = await getDocs(q);

      // Retorna a quantidade exata
      return snapshot.size;
    } catch (error) {
      console.error("Erro ao buscar progresso:", error);
      return 0;
    }
  }
}

// Exporta como instância única (singleton), pra usar direto
export const PlanoAlimentarService = new PlanoAlimentarServiceClass();
