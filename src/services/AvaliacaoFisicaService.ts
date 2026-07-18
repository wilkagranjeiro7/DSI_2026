import { AvaliacaoFisica, AvaliacaoFisicaDados } from "../models/AvaliacaoFisica";
import { AvaliacaoFisicaRepository } from "../repositories/AvaliacaoFisicaRepository";
import { auth } from "../utils/firebaseConfig";

export class AvaliacaoFisicaService {
  private repository: AvaliacaoFisicaRepository;

  constructor() {
    this.repository = new AvaliacaoFisicaRepository();
  }

  private getUid(): string {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado.");
    return user.uid;
  }

  async listar(): Promise<AvaliacaoFisica[]> {
    return await this.repository.listarPorUsuario(this.getUid());
  }

  async registrar(dados: Omit<AvaliacaoFisicaDados, "usuarioId">): Promise<AvaliacaoFisica> {
    if (dados.peso <= 0) throw new Error("O peso deve ser maior que zero.");
    if (dados.altura <= 0) throw new Error("A altura deve ser maior que zero.");

    const novaAvaliacao = new AvaliacaoFisica({
      ...dados,
      usuarioId: this.getUid(),
      data: new Date().toLocaleDateString("pt-BR"),
    });

    return await this.repository.salvar(novaAvaliacao);
  }

  async remover(id: string): Promise<void> {
    await this.repository.excluir(id);
  }
}