export type StatusMeta = "em andamento" | "concluida";

export type TipoRelacionamento = "treino" | "exercicio" | "local" | null;

export type TipoRelacionamentoFormulario = "" | "treino" | "exercicio" | "local";

export interface MetaDados {
  id?: string | null;
  titulo?: string;
  categoria?: string;
  valorAtual?: number | string;
  valorDesejado?: number | string;
  unidade?: string;
  dataLimite?: string;
  status?: StatusMeta;
  observacoes?: string;
  relacionadoTipo?: TipoRelacionamento;
  relacionadoId?: string | null;
}

export interface MetaFormulario {
  titulo: string;
  categoria: string;
  valorAtual: string;
  valorDesejado: string;
  unidade: string;
  dataLimite: string;
  observacoes: string;
  relacionadoTipo: TipoRelacionamentoFormulario;
  relacionadoId: string;
}

class Meta {
  id: string | null;
  titulo: string;
  categoria: string;
  valorAtual: number;
  valorDesejado: number;
  unidade: string;
  dataLimite: string;
  status: StatusMeta;
  observacoes: string;
  relacionadoTipo: TipoRelacionamento;
  relacionadoId: string | null;

  constructor({
    id = null,
    titulo = "",
    categoria = "",
    valorAtual = 0,
    valorDesejado = 0,
    unidade = "",
    dataLimite = "",
    status = "em andamento",
    observacoes = "",
    relacionadoTipo = null,
    relacionadoId = null,
  }: MetaDados) {
    this.id = id;
    this.titulo = titulo;
    this.categoria = categoria;
    this.valorAtual = Number(valorAtual);
    this.valorDesejado = Number(valorDesejado);
    this.unidade = unidade;
    this.dataLimite = dataLimite;
    this.status = status;
    this.observacoes = observacoes;
    this.relacionadoTipo = relacionadoTipo;
    this.relacionadoId = relacionadoId;

    this.atualizarStatusPorProgresso();
  }

  calcularProgresso(): number {
    if (this.valorDesejado <= 0) {
      return 0;
    }

    const progresso = (this.valorAtual / this.valorDesejado) * 100;

    return Math.min(Math.round(progresso), 100);
  }

  atualizarStatusPorProgresso(): void {
    if (this.valorDesejado > 0 && this.valorAtual >= this.valorDesejado) {
      this.status = "concluida";
      return;
    }

    this.status = "em andamento";
  }

  concluir(): void {
    this.valorAtual = this.valorDesejado;
    this.status = "concluida";
  }

  toFirestore() {
    this.atualizarStatusPorProgresso();

    return {
      titulo: this.titulo,
      categoria: this.categoria,
      valorAtual: this.valorAtual,
      valorDesejado: this.valorDesejado,
      unidade: this.unidade,
      dataLimite: this.dataLimite,
      status: this.status,
      observacoes: this.observacoes,
      relacionadoTipo: this.relacionadoTipo,
      relacionadoId: this.relacionadoId,
    };
  }
}

export default Meta;