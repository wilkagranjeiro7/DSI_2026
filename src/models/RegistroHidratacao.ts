export type TipoBebida = "agua" | "agua_coco" | "isotonico" | "cha";

export interface RegistroHidratacaoDados {
  id?: string | null;
  usuarioId?: string;
  quantidadeMl?: number | string;
  tipoBebida?: TipoBebida;
  dataHora?: string;
  observacoes?: string;
}

export interface RegistroHidratacaoFormulario {
  quantidadeMl: string;
  tipoBebida: TipoBebida;
  data: string;
  hora: string;
  observacoes: string;
}

class RegistroHidratacao {
  id: string | null;
  usuarioId: string;
  quantidadeMl: number;
  tipoBebida: TipoBebida;
  dataHora: string;
  observacoes: string;

  constructor({
    id = null,
    usuarioId = "",
    quantidadeMl = 0,
    tipoBebida = "agua",
    dataHora = new Date().toISOString(),
    observacoes = "",
  }: RegistroHidratacaoDados) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.quantidadeMl = Number(quantidadeMl);
    this.tipoBebida = tipoBebida;
    this.dataHora = dataHora;
    this.observacoes = observacoes.trim();
  }

  get nomeBebida(): string {
    const nomes: Record<TipoBebida, string> = {
      agua: "Água",
      agua_coco: "Água de coco",
      isotonico: "Isotônico",
      cha: "Chá sem açúcar",
    };

    return nomes[this.tipoBebida];
  }

  ocorreuHoje(referencia = new Date()): boolean {
    const dataRegistro = new Date(this.dataHora);

    return (
      dataRegistro.getFullYear() === referencia.getFullYear() &&
      dataRegistro.getMonth() === referencia.getMonth() &&
      dataRegistro.getDate() === referencia.getDate()
    );
  }

  toFirestore() {
    return {
      usuarioId: this.usuarioId,
      quantidadeMl: this.quantidadeMl,
      tipoBebida: this.tipoBebida,
      dataHora: this.dataHora,
      observacoes: this.observacoes,
    };
  }
}

export default RegistroHidratacao;
