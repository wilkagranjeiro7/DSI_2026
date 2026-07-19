import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    Timestamp,
    updateDoc,
} from "firebase/firestore";
import { Refeicao } from "../../app/PlanoAlimentar";
import { db } from "../utils/firebaseConfig";

// Tudo que toca diretamente no Firestore fica aqui dentro
export class PlanoAlimentarRepository {
  private getColecao(userId: string) {
    // Cada usuário tem sua própria subcoleção de refeições
    return collection(db, "users", userId, "refeicoes");
  }

  async salvar(userId: string, refeicao: Omit<Refeicao, "id">) {
    const dados = {
      ...refeicao,
      createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(this.getColecao(userId), dados);
    return docRef.id;
  }

  async buscarTodas(userId: string): Promise<Refeicao[]> {
    const q = query(this.getColecao(userId), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        tipo: data.tipo,
        nome: data.nome,
        itens: data.itens || [],
      } as Refeicao;
    });
  }

  // 👇 apaga a refeição do Firestore
  async deletar(userId: string, refeicaoId: string) {
    const refDoc = doc(db, "users", userId, "refeicoes", refeicaoId);
    await deleteDoc(refDoc);
  }

  // 👇 NOVO: atualiza uma refeição já existente (evita duplicar ao editar)
  async atualizar(
    userId: string,
    refeicaoId: string,
    refeicao: Omit<Refeicao, "id">,
  ) {
    const refDoc = doc(db, "users", userId, "refeicoes", refeicaoId);
    await updateDoc(refDoc, {
      tipo: refeicao.tipo,
      nome: refeicao.nome,
      itens: refeicao.itens,
    });
  }
}
