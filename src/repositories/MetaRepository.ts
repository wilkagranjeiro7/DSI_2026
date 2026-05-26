import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import Meta, { MetaDados } from "../models/Meta";
import { db } from "../utils/firebaseConfig";

class MetaRepository {
  private nomeColecao = "metas";

  async listar(): Promise<Meta[]> {
    const metasRef = collection(db, this.nomeColecao);
    const resultado = await getDocs(metasRef);

    return resultado.docs.map((documento) => {
      const dados = documento.data() as Omit<MetaDados, "id">;

      return new Meta({
        id: documento.id,
        ...dados,
      });
    });
  }

  async buscarPorId(id: string): Promise<Meta | null> {
    const metaRef = doc(db, this.nomeColecao, id);
    const resultado = await getDoc(metaRef);

    if (!resultado.exists()) {
      return null;
    }

    const dados = resultado.data() as Omit<MetaDados, "id">;

    return new Meta({
      id: resultado.id,
      ...dados,
    });
  }

  async criar(meta: Meta): Promise<Meta> {
    const metasRef = collection(db, this.nomeColecao);

    const documento = await addDoc(metasRef, {
      ...meta.toFirestore(),
      criadoEm: serverTimestamp(),
      atualizadoEm: serverTimestamp(),
    });

    meta.id = documento.id;

    return meta;
  }

  async atualizar(meta: Meta): Promise<Meta> {
    if (!meta.id) {
      throw new Error("Não é possível atualizar uma meta sem ID.");
    }

    const metaRef = doc(db, this.nomeColecao, meta.id);

    await updateDoc(metaRef, {
      ...meta.toFirestore(),
      atualizadoEm: serverTimestamp(),
    });

    return meta;
  }

  async excluir(id: string): Promise<void> {
    const metaRef = doc(db, this.nomeColecao, id);

    await deleteDoc(metaRef);
  }
}

export default MetaRepository;