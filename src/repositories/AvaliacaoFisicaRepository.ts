import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import { AvaliacaoFisica, AvaliacaoFisicaDados } from "../models/AvaliacaoFisica";

export class AvaliacaoFisicaRepository {
  private nomeColecao = "avaliacoesFisicas";

  async listarPorUsuario(usuarioId: string): Promise<AvaliacaoFisica[]> {
    const collRef = collection(db, this.nomeColecao);
    const q = query(collRef, where("usuarioId", "==", usuarioId));
    const resultado = await getDocs(q);

    return resultado.docs.map((documento) => {
      const dados = documento.data() as Omit<AvaliacaoFisicaDados, "id">;
      return new AvaliacaoFisica({ id: documento.id, ...dados });
    });
  }

  async salvar(avaliacao: AvaliacaoFisica): Promise<AvaliacaoFisica> {
    const collRef = collection(db, this.nomeColecao);

    if (avaliacao.id) {
        const docRef = doc(db, this.nomeColecao, avaliacao.id);
        await setDoc(docRef, {
            ...avaliacao.toFirestore(),
            atualizadoEm: serverTimestamp(),
        }, { merge: true });
        return avaliacao;
        } else {
            const docRef = await addDoc(collRef, {
                ...avaliacao.toFirestore(),
                criadoEm: serverTimestamp(),
            });
            avaliacao.id = docRef.id;
            return avaliacao;
        }
    }  



  async excluir(id: string): Promise<void> {
    const docRef = doc(db, this.nomeColecao, id);
    await deleteDoc(docRef);
  }
}