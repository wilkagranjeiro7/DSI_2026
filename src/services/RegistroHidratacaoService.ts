import { auth } from "../utils/firebaseConfig";
import RegistroHidratacao, {
  RegistroHidratacaoDados,
} from "../models/RegistroHidratacao";
import RegistroHidratacaoRepository from "../repositories/RegistroHidratacaoRepository";

export interface ResumoHidratacao {
  totalHojeMl: number;
  metaDiariaMl: number;
  percentual: number;
  quantidadeRegistros: number;
}

class RegistroHidratacaoService {
  private repository: RegistroHidratacaoRepository;

  constructor(repository = new RegistroHidratacaoRepository()) {
    this.repository = repository;
  }

  private obterUsuarioId(): string {
    const usuarioId = auth.currentUser?.uid;

    if (!usuarioId) {
      throw new Error("Faça login para acessar o diário de hidratação.");
    }

    return usuarioId;
  }

  private validar(registro: RegistroHidratacao): void {
    if (!Number.isFinite(registro.quantidadeMl)) {
      throw new Error("Informe uma quantidade válida.");
    }

    if (registro.quantidadeMl < 50 || registro.quantidadeMl > 5000) {
      throw new Error("A quantidade deve ficar entre 50 ml e 5000 ml.");
    }

    const dataRegistro = new Date(registro.dataHora);

    if (Number.isNaN(dataRegistro.getTime())) {
      throw new Error("Informe uma data e uma hora válidas.");
    }

    const toleranciaFuturo = Date.now() + 5 * 60 * 1000;

    if (dataRegistro.getTime() > toleranciaFuturo) {
      throw new Error("O consumo não pode ser registrado em uma data futura.");
    }

    if (registro.observacoes.length > 200) {
      throw new Error("A observação deve ter no máximo 200 caracteres.");
    }
  }

  async listarRegistros(): Promise<RegistroHidratacao[]> {
    return await this.repository.listar(this.obterUsuarioId());
  }

  async buscarRegistro(id: string): Promise<RegistroHidratacao | null> {
    return await this.repository.buscarPorId(this.obterUsuarioId(), id);
  }

  async salvarRegistro(
    dados: RegistroHidratacaoDados,
  ): Promise<RegistroHidratacao> {
    const registro = new RegistroHidratacao({
      ...dados,
      usuarioId: this.obterUsuarioId(),
    });

    this.validar(registro);

    if (registro.id) {
      return await this.repository.atualizar(registro);
    }

    return await this.repository.criar(registro);
  }

  async excluirRegistro(id: string): Promise<void> {
    await this.repository.excluir(this.obterUsuarioId(), id);
  }

  calcularResumo(
    registros: RegistroHidratacao[],
    metaDiariaMl = 2000,
  ): ResumoHidratacao {
    const registrosHoje = registros.filter((registro) =>
      registro.ocorreuHoje(),
    );
    const totalHojeMl = registrosHoje.reduce(
      (total, registro) => total + registro.quantidadeMl,
      0,
    );

    return {
      totalHojeMl,
      metaDiariaMl,
      percentual: Math.min(Math.round((totalHojeMl / metaDiariaMl) * 100), 100),
      quantidadeRegistros: registrosHoje.length,
    };
  }
}

export default RegistroHidratacaoService;
