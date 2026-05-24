export interface PerfilDados {
  id?: string | null;
  nome?: string;
  email?: string;
  telefone?: string;
  idade?: number | string;
  peso?: number | string;
  altura?: number | string;
  objetivo?: string;
  nivel?: string;
  observacoes?: string;
}

export interface PerfilFormulario {
  nome: string;
  email: string;
  telefone: string;
  idade: string;
  peso: string;
  altura: string;
  objetivo: string;
  nivel: string;
  observacoes: string;
}

class Perfil {
  id: string | null;
  nome: string;
  email: string;
  telefone: string;
  idade: number;
  peso: number;
  altura: number;
  objetivo: string;
  nivel: string;
  observacoes: string;

  constructor({
    id = null,
    nome = "",
    email = "",
    telefone = "",
    idade = 0,
    peso = 0,
    altura = 0,
    objetivo = "",
    nivel = "",
    observacoes = "",
  }: PerfilDados) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.telefone = telefone;
    this.idade = Number(idade);
    this.peso = Number(peso);
    this.altura = Number(altura);
    this.objetivo = objetivo;
    this.nivel = nivel;
    this.observacoes = observacoes;
  }

  toFirestore() {
    return {
      nome: this.nome,
      email: this.email,
      telefone: this.telefone,
      idade: this.idade,
      peso: this.peso,
      altura: this.altura,
      objetivo: this.objetivo,
      nivel: this.nivel,
      observacoes: this.observacoes,
    };
  }
}

export default Perfil;