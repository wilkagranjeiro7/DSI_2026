import { Refeicao } from "../../app/PlanoAlimentar";
import { PlanoAlimentarRepository } from "../repositories/PlanoAlimentarRepository";
import { auth } from "../utils/firebaseConfig";

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

  // 👇 NOVO: expõe a atualização pro resto do app (evita duplicar ao editar)
  async atualizarRefeicao(refeicaoId: string, refeicao: Omit<Refeicao, "id">) {
    const userId = this.getUserId();
    return this.repository.atualizar(userId, refeicaoId, refeicao);
  }
}

// Exporta como instância única (singleton), pra usar direto: PlanoAlimentarService.salvarRefeicao(...)
export const PlanoAlimentarService = new PlanoAlimentarServiceClass();
