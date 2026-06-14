import Meta, { MetaDados } from "../models/Meta";
import MetaRepository from "../repositories/MetaRepository";

class MetaService {
  private repository: MetaRepository;

  constructor() {
    this.repository = new MetaRepository();
  }

  async listarMetas(): Promise<Meta[]> {
    return await this.repository.listar();
  }

  async buscarMeta(id: string): Promise<Meta | null> {
    return await this.repository.buscarPorId(id);
  }

  async salvarMeta(dados: MetaDados): Promise<Meta> {
    const meta = new Meta(dados);

    if (!meta.titulo.trim()) {
      throw new Error("O título da meta é obrigatório.");
    }

    if (!meta.categoria.trim()) {
      throw new Error("A categoria da meta é obrigatória.");
    }

    if (meta.valorAtual < 0) {
      throw new Error("O valor atual não pode ser negativo.");
    }

    if (meta.valorDesejado <= 0) {
      throw new Error("O valor desejado deve ser maior que zero.");
    }

    if (meta.id) {
      return await this.repository.atualizar(meta);
    }

    return await this.repository.criar(meta);
  }

  async excluirMeta(id: string): Promise<void> {
    await this.repository.excluir(id);
  }

  async concluirMeta(id: string): Promise<Meta> {
    const meta = await this.repository.buscarPorId(id);

    if (!meta) {
      throw new Error("Meta não encontrada.");
    }

    meta.concluir();

    return await this.repository.atualizar(meta);
  }
}

export default MetaService;