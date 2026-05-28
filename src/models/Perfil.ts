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
  photoUrl?: string; // 🌟 1. ADICIONADO AQUI
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
  photoUrl?: string; // 🌟 2. ADICIONADO AQUI (Opcional no formulário)
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
  photoUrl: string; // 🌟 3. ADICIONADO AQUI

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
    photoUrl = "", // 🌟 4. ADICIONADO AQUI NO CONSTRUTOR
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
    this.photoUrl = photoUrl; // 🌟 5. SALVA AQUI NA CLASSE
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
      photoUrl: this.photoUrl, // 🌟 6. GARANTE QUE SALVE NO FIREBASE SE ENVIAR PELO FORMULÁRIO
    };
  }
}

export default Perfil;