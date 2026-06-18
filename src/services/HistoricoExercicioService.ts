import HistoricoExercicio, {
  HistoricoExercicioDados,
} from "../models/HistoricoExercicio";
import HistoricoExercicioRepository from "../repositories/HistoricoExercicioRepository";

class HistoricoExercicioService {
  private repository: HistoricoExercicioRepository;

  constructor() {
    this.repository = new HistoricoExercicioRepository();
  }

  async listarHistorico(): Promise<HistoricoExercicio[]> {
    return await this.repository.listar();
  }

  async buscarHistorico(id: string): Promise<HistoricoExercicio | null> {
    return await this.repository.buscarPorId(id);
  }

  async salvarHistorico(
    dados: HistoricoExercicioDados,
  ): Promise<HistoricoExercicio> {
    const historico = new HistoricoExercicio(dados);

    if (!historico.nomeExercicio.trim()) {
      throw new Error("O nome do exercicio e obrigatorio.");
    }

    if (!historico.dataExecucao.trim()) {
      throw new Error("A data de execucao e obrigatoria.");
    }

    if (historico.series <= 0) {
      throw new Error("A quantidade de series deve ser maior que zero.");
    }

    if (historico.repeticoes <= 0) {
      throw new Error("A quantidade de repeticoes deve ser maior que zero.");
    }

    if (historico.cargaKg < 0) {
      throw new Error("A carga nao pode ser negativa.");
    }

    if (historico.duracaoMinutos < 0) {
      throw new Error("A duracao nao pode ser negativa.");
    }

    if (historico.id) {
      return await this.repository.atualizar(historico);
    }

    return await this.repository.criar(historico);
  }

  async registrarConclusao(
    dados: HistoricoExercicioDados,
  ): Promise<HistoricoExercicio> {
    const historico = new HistoricoExercicio(dados);

    return await this.salvarHistorico({
      ...dados,
      series: historico.series > 0 ? historico.series : 1,
      repeticoes: historico.repeticoes > 0 ? historico.repeticoes : 1,
      origem: "conclusao",
      observacoes:
        dados.observacoes || "Registrado automaticamente pela conclusao.",
    });
  }

  async excluirHistorico(id: string): Promise<void> {
    await this.repository.excluir(id);
  }
}

export default HistoricoExercicioService;
