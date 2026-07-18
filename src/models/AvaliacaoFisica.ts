export interface AvaliacaoFisicaDados {
  id?: string;
  usuarioId: string;
  data: string;
  peso: number;
  altura: number;
  cintura?: number;
  quadril?: number;
}

export class AvaliacaoFisica {
  public id?: string;
  public usuarioId: string;
  public data: string;
  public peso: number;
  public altura: number;
  public cintura?: number;
  public quadril?: number;

  constructor(dados: AvaliacaoFisicaDados) {
    this.id = dados.id;
    this.usuarioId = dados.usuarioId;
    this.data = dados.data;

    this.peso = typeof dados.peso === 'string'
        ? parseFloat(String(dados.peso).replace(',', '.'))
        : dados.peso;
    
    this.altura = typeof dados.altura === 'string'
        ? parseFloat(String(dados.altura).replace(',', '.'))
        : dados.altura;

    this.cintura = dados.cintura ? parseFloat(String(dados.cintura).replace(',', '.')) : undefined;
    this.quadril = dados.quadril ? parseFloat(String(dados.quadril).replace(',', '.')) : undefined;
  }

  public calcularIMC(): number {
    const pesoNum = typeof this.peso === 'string'
        ? parseFloat(String(this.peso).replace(',', '.'))
        : this.peso;
    const alturaNum = typeof this.altura === 'string'
        ? parseFloat(String(this.altura).replace(',', '.'))
        : this.altura;
    if (!alturaNum || isNaN(alturaNum) || alturaNum <= 0 || !pesoNum || isNaN(pesoNum) || pesoNum <= 0) {
        return 0;
    }
    const imc = pesoNum / (alturaNum * alturaNum);
    return parseFloat(imc.toFixed(2));
  }

   public calcularRelacaoCinturaQuadril(): number {
    if (!this.cintura || !this.quadril || this.quadril <= 0) return 0;
    return parseFloat((this.cintura / this.quadril).toFixed(2));
  }

  public toFirestore() {
    return {
      usuarioId: this.usuarioId,
      data: this.data,
      peso: this.peso,
      altura: this.altura,
      cintura: this.cintura || null,
      quadril: this.quadril || null,
    };
  }
}