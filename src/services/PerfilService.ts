import Perfil, { PerfilDados } from "../models/Perfil";
import PerfilRepository from "../repositories/PerfilRepository";

class PerfilService {
  private repository: PerfilRepository;

  constructor() {
    this.repository = new PerfilRepository();
  }

  async buscarPerfil(): Promise<Perfil | null> {
    return await this.repository.buscarPerfil();
  }

  async salvarPerfil(dados: PerfilDados): Promise<Perfil> {
    const perfil = new Perfil(dados);

    if (!perfil.nome.trim()) {
      throw new Error("O nome é obrigatório.");
    }

    if (!perfil.email.trim()) {
      throw new Error("O e-mail é obrigatório.");
    }

    if (perfil.idade < 0) {
      throw new Error("A idade não pode ser negativa.");
    }

    if (perfil.peso < 0) {
      throw new Error("O peso não pode ser negativo.");
    }

    if (perfil.altura < 0) {
      throw new Error("A altura não pode ser negativa.");
    }

    return await this.repository.salvar(perfil);
  }

  async excluirPerfil(): Promise<void> {
    await this.repository.excluir();
  }
}

export default PerfilService;