export type OrigemHistoricoExercicio = "manual" | "conclusao";

export interface HistoricoExercicioDados {
  id?: string | null;
  usuarioId?: string;
  exercicioId?: string | null;
  nomeExercicio?: string;
  grupoMuscular?: string;
  dataExecucao?: string;
  series?: number | string;
  repeticoes?: number | string;
  cargaKg?: number | string;
  duracaoMinutos?: number | string;
  observacoes?: string;
  origem?: OrigemHistoricoExercicio;
}

export interface HistoricoExercicioFormulario {
  exercicioId: string;
  nomeExercicio: string;
  grupoMuscular: string;
  dataExecucao: string;
  series: string;
  repeticoes: string;
  cargaKg: string;
  duracaoMinutos: string;
  observacoes: string;
}

class HistoricoDate {
  static hoje(): string {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  }

  static formatar(data: string): string {
    const partes = data.split("-");

    if (partes.length !== 3) {
      return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
}

class HistoricoNumber {
  static parse(valor: number | string | undefined): number {
    if (typeof valor === "number") {
      return Number.isFinite(valor) ? valor : 0;
    }

    if (!valor) {
      return 0;
    }

    const match = String(valor).replace(",", ".").match(/\d+(\.\d+)?/);

    return match ? Number(match[0]) : 0;
  }
}

class HistoricoExercicio {
  id: string | null;
  usuarioId: string;
  exercicioId: string | null;
  nomeExercicio: string;
  grupoMuscular: string;
  dataExecucao: string;
  series: number;
  repeticoes: number;
  cargaKg: number;
  duracaoMinutos: number;
  observacoes: string;
  origem: OrigemHistoricoExercicio;

  constructor({
    id = null,
    usuarioId = "",
    exercicioId = null,
    nomeExercicio = "",
    grupoMuscular = "",
    dataExecucao = HistoricoDate.hoje(),
    series = 0,
    repeticoes = 0,
    cargaKg = 0,
    duracaoMinutos = 0,
    observacoes = "",
    origem = "manual",
  }: HistoricoExercicioDados) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.exercicioId = exercicioId;
    this.nomeExercicio = nomeExercicio;
    this.grupoMuscular = grupoMuscular;
    this.dataExecucao = dataExecucao;
    this.series = HistoricoNumber.parse(series);
    this.repeticoes = HistoricoNumber.parse(repeticoes);
    this.cargaKg = HistoricoNumber.parse(cargaKg);
    this.duracaoMinutos = HistoricoNumber.parse(duracaoMinutos);
    this.observacoes = observacoes;
    this.origem = origem;
  }

  calcularVolume(): number {
    return this.series * this.repeticoes * this.cargaKg;
  }

  formatarData(): string {
    return HistoricoDate.formatar(this.dataExecucao);
  }

  resumoExecucao(): string {
    const partes = [`${this.series} series`, `${this.repeticoes} repeticoes`];

    if (this.cargaKg > 0) {
      partes.push(`${this.cargaKg} kg`);
    }

    if (this.duracaoMinutos > 0) {
      partes.push(`${this.duracaoMinutos} min`);
    }

    return partes.join(" - ");
  }

  toFirestore() {
    return {
      usuarioId: this.usuarioId,
      exercicioId: this.exercicioId,
      nomeExercicio: this.nomeExercicio,
      grupoMuscular: this.grupoMuscular,
      dataExecucao: this.dataExecucao,
      series: this.series,
      repeticoes: this.repeticoes,
      cargaKg: this.cargaKg,
      duracaoMinutos: this.duracaoMinutos,
      observacoes: this.observacoes,
      origem: this.origem,
    };
  }
}

export default HistoricoExercicio;
