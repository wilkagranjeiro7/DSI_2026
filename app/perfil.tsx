import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BottomNavbar from "../src/components/BottomNavbar";

import PerfilCard from "../src/components/perfil/PerfilCard";
import PerfilForm from "../src/components/perfil/PerfilForm";
import Perfil, { PerfilFormulario } from "../src/models/Perfil";
import PerfilService from "../src/services/PerfilService";
import { auth, db } from "../src/utils/firebaseConfig";
import { supabase } from "../src/utils/supabaseConfig";

const formInicial: PerfilFormulario = {
  nome: "",
  email: "",
  telefone: "",
  idade: "",
  peso: "",
  altura: "",
  objetivo: "",
  nivel: "",
  observacoes: "",
};

export default function PerfilScreen() {
  const perfilService = useMemo(() => new PerfilService(), []);

  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [form, setForm] = useState<PerfilFormulario>({ ...formInicial });
  const [editando, setEditando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);
  const [toastVisivel, setToastVisivel] = useState(false);
  const [toastMensagem, setToastMensagem] = useState("");

  const mostrarAvisoDiscreto = (mensagem: string) => {
    setToastMensagem(mensagem);
    setToastVisivel(true);
    setTimeout(() => setToastVisivel(false), 3000);
  };

  async function carregarPerfil() {
    try {
      setCarregando(true);
      const perfilEncontrado = await perfilService.buscarPerfil();
      setPerfil(perfilEncontrado);

      if (!perfilEncontrado) {
        setEditando(true);
      } else {
        setEditando(false);
      }
      setErro("");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao carregar perfil.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        carregarPerfil();
      } else {
        setCarregando(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const escolherEEnviarImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      mostrarAvisoDiscreto("Precisamos de permissão para acessar suas fotos.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return;
    }

    try {
      setUploadingImage(true);
      let user = auth.currentUser;

      if (!user) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        user = auth.currentUser;
      }

      if (!user) {
        mostrarAvisoDiscreto("Usuário não autenticado.");
        return;
      }

      const localUri = result.assets[0].uri;
      const base64 = await FileSystem.readAsStringAsync(localUri, {
        encoding: "base64",
      });
      
      const buffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const fileExtension = localUri.split(".").pop();
      const fileName = `${user.uid}/avatar.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, buffer, {
          contentType: `image/${fileExtension}`,
          upsert: true,
        });

      if (uploadError) throw new Error(uploadError.message);

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData.publicUrl;

      await setDoc(doc(db, "users", user.uid), { photoUrl: publicUrl }, { merge: true });
      await setDoc(doc(db, "perfis", user.uid), { photoUrl: publicUrl }, { merge: true });

      mostrarAvisoDiscreto("Foto de perfil atualizada com sucesso! ✨");
      await carregarPerfil();
    } catch (error: any) {
      console.error(error);
      mostrarAvisoDiscreto("Erro ao salvar imagem.");
    } finally {
      setUploadingImage(false);
    }
  };

  function alterarCampo(campo: keyof PerfilFormulario, valor: string) {
    setForm((estadoAtual) => ({
      ...estadoAtual,
      [campo]: valor,
    }));
  }

  function preencherFormulario(perfilAtual: Perfil) {
    setForm({
      nome: perfilAtual.nome,
      email: perfilAtual.email,
      telefone: perfilAtual.telefone,
      idade: String(perfilAtual.idade || ""),
      peso: String(perfilAtual.peso || ""),
      altura: String(perfilAtual.altura || ""),
      objetivo: perfilAtual.objetivo,
      nivel: perfilAtual.nivel,
      observacoes: perfilAtual.observacoes,
    });
    setEditando(true);
  }

  async function salvarPerfil() {
    try {
      const dadosParaSalvar: any = {
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        idade: form.idade,
        peso: form.peso,
        altura: form.altura,
        objetivo: form.objetivo,
        nivel: form.nivel,
        observacoes: form.observacoes,
      };

      if (perfil && (perfil as any).photoUrl) {
        dadosParaSalvar.photoUrl = (perfil as any).photoUrl;
      }

      await perfilService.salvarPerfil(dadosParaSalvar);
      mostrarAvisoDiscreto("Perfil salvo com sucesso!");
      await carregarPerfil();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao salvar perfil.");
    }
  }

  function confirmarExclusao() {
    Alert.alert("Excluir perfil", "Tem certeza que deseja excluir os dados do perfil?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: excluirPerfil },
    ]);
  }

  async function excluirPerfil() {
    try {
      await perfilService.excluirPerfil();
      setPerfil(null);
      setForm({ ...formInicial });
      setEditando(true);
      mostrarAvisoDiscreto("Perfil excluído.");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao excluir perfil.");
    }
  }

  function cancelarEdicao() {
    if (perfil) {
      setEditando(false);
      setErro("");
      return;
    }
    setForm({ ...formInicial });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>FitMatch</Text>
          <Ionicons name="ellipsis-vertical" size={22} color="#FFFFFF" />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Perfil</Text>
          <Text style={styles.subtitle}>Gerencie suas informações</Text>

          {erro ? <Text style={styles.error}>{erro}</Text> : null}

          {carregando ? (
            <ActivityIndicator size="small" color="#FF8500" style={{ marginTop: 20 }} />
          ) : editando ? (
            <PerfilForm
              form={form}
              erro={erro}
              onChange={alterarCampo}
              onSubmit={salvarPerfil}
              onCancel={cancelarEdicao}
            />
          ) : perfil ? (
            // 🔥 PASSADO AQUI: Injeta a função e o estado de carregamento para dentro do card
            <PerfilCard
              perfil={perfil}
              onEditar={() => preencherFormulario(perfil)}
              onExcluir={confirmarExclusao}
              onTrocarFoto={escolherEEnviarImagem}
              carregandoFoto={uploadingImage}
            />
          ) : (
            <TouchableOpacity style={styles.createButton} onPress={() => setEditando(true)}>
              <Text style={styles.createButtonText}>Criar perfil</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        <BottomNavbar active="perfil" />

        {toastVisivel && (
          <View style={styles.toastCard}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.toastText}>{toastMensagem}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FF8500",
  },
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    height: 58,
    backgroundColor: "#FF8500",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  content: {
    padding: 16,
    paddingBottom: 110,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 3,
    marginBottom: 18,
  },
  error: {
    backgroundColor: "#FEE2E2",
    color: "#DC2626",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    fontWeight: "700",
  },
  createButton: {
    backgroundColor: "#FF8500",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  createButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  toastCard: {
    position: "absolute",
    bottom: 90,
    left: 20,
    right: 20,
    backgroundColor: "#1E293B",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    zIndex: 9999,
  },
  toastText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 10,
  },
});