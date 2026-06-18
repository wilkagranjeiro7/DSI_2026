import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { onAuthStateChanged, Unsubscribe } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { Component } from "react";
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

interface PerfilState {
  perfil: Perfil | null;
  form: PerfilFormulario;
  editando: boolean;
  carregando: boolean;
  erro: string;
  uploadingImage: boolean;
  toastVisivel: boolean;
  toastMensagem: string;
}

class PerfilFormMapper {
  static fromPerfil(perfilAtual: Perfil): PerfilFormulario {
    return {
      nome: perfilAtual.nome,
      email: perfilAtual.email,
      telefone: perfilAtual.telefone,
      idade: String(perfilAtual.idade || ""),
      peso: String(perfilAtual.peso || ""),
      altura: String(perfilAtual.altura || ""),
      objetivo: perfilAtual.objetivo,
      nivel: perfilAtual.nivel,
      observacoes: perfilAtual.observacoes,
      photoUrl: perfilAtual.photoUrl,
    };
  }
}

class PerfilScreen extends Component<object, PerfilState> {
  private readonly perfilService = new PerfilService();
  private unsubscribeAuth?: Unsubscribe;
  private toastTimer?: ReturnType<typeof setTimeout>;

  state: PerfilState = {
    perfil: null,
    form: { ...formInicial },
    editando: false,
    carregando: true,
    erro: "",
    uploadingImage: false,
    toastVisivel: false,
    toastMensagem: "",
  };

  componentDidMount() {
    this.unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        this.carregarPerfil();
      } else {
        this.setState({ carregando: false });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribeAuth?.();

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
  }

  private mostrarAvisoDiscreto = (mensagem: string) => {
    this.setState({ toastMensagem: mensagem, toastVisivel: true });

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastTimer = setTimeout(() => {
      this.setState({ toastVisivel: false });
    }, 3000);
  };

  private carregarPerfil = async () => {
    try {
      this.setState({ carregando: true });
      const perfilEncontrado = await this.perfilService.buscarPerfil();

      this.setState({
        perfil: perfilEncontrado,
        editando: !perfilEncontrado,
        erro: "",
      });
    } catch (error) {
      this.setState({
        erro:
          error instanceof Error ? error.message : "Erro ao carregar perfil.",
      });
    } finally {
      this.setState({ carregando: false });
    }
  };

  private escolherEEnviarImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      this.mostrarAvisoDiscreto("Precisamos de permissao para acessar suas fotos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return;
    }

    try {
      this.setState({ uploadingImage: true });
      let user = auth.currentUser;

      if (!user) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        user = auth.currentUser;
      }

      if (!user) {
        this.mostrarAvisoDiscreto("Usuario nao autenticado.");
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

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData.publicUrl;

      await setDoc(doc(db, "users", user.uid), { photoUrl: publicUrl }, { merge: true });
      await setDoc(
        doc(db, "perfis", user.uid),
        { photoUrl: publicUrl },
        { merge: true },
      );

      this.mostrarAvisoDiscreto("Foto de perfil atualizada com sucesso!");
      await this.carregarPerfil();
    } catch (error: any) {
      console.error(error);
      this.mostrarAvisoDiscreto("Erro ao salvar imagem.");
    } finally {
      this.setState({ uploadingImage: false });
    }
  };

  private alterarCampo = (campo: keyof PerfilFormulario, valor: string) => {
    this.setState((estadoAtual) => ({
      form: {
        ...estadoAtual.form,
        [campo]: valor,
      },
    }));
  };

  private preencherFormulario = (perfilAtual: Perfil) => {
    this.setState({
      form: PerfilFormMapper.fromPerfil(perfilAtual),
      editando: true,
    });
  };

  private salvarPerfil = async () => {
    const { form, perfil } = this.state;

    try {
      const dadosParaSalvar = {
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        idade: form.idade,
        peso: form.peso,
        altura: form.altura,
        objetivo: form.objetivo,
        nivel: form.nivel,
        observacoes: form.observacoes,
        photoUrl: perfil?.photoUrl || form.photoUrl,
      };

      await this.perfilService.salvarPerfil(dadosParaSalvar);
      this.mostrarAvisoDiscreto("Perfil salvo com sucesso!");
      await this.carregarPerfil();
    } catch (error) {
      this.setState({
        erro: error instanceof Error ? error.message : "Erro ao salvar perfil.",
      });
    }
  };

  private confirmarExclusao = () => {
    Alert.alert(
      "Excluir perfil",
      "Tem certeza que deseja excluir os dados do perfil?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: this.excluirPerfil },
      ],
    );
  };

  private excluirPerfil = async () => {
    try {
      await this.perfilService.excluirPerfil();
      this.setState({
        perfil: null,
        form: { ...formInicial },
        editando: true,
      });
      this.mostrarAvisoDiscreto("Perfil excluido.");
    } catch (error) {
      this.setState({
        erro: error instanceof Error ? error.message : "Erro ao excluir perfil.",
      });
    }
  };

  private cancelarEdicao = () => {
    if (this.state.perfil) {
      this.setState({ editando: false, erro: "" });
      return;
    }

    this.setState({ form: { ...formInicial } });
  };

  private renderConteudo() {
    const { perfil, form, erro, carregando, editando, uploadingImage } =
      this.state;

    if (carregando) {
      return (
        <ActivityIndicator
          size="small"
          color="#FF8500"
          style={{ marginTop: 20 }}
        />
      );
    }

    if (editando) {
      return (
        <PerfilForm
          form={form}
          erro={erro}
          onChange={this.alterarCampo}
          onSubmit={this.salvarPerfil}
          onCancel={this.cancelarEdicao}
        />
      );
    }

    if (perfil) {
      return (
        <PerfilCard
          perfil={perfil}
          onEditar={() => this.preencherFormulario(perfil)}
          onExcluir={this.confirmarExclusao}
          onTrocarFoto={this.escolherEEnviarImagem}
          carregandoFoto={uploadingImage}
        />
      );
    }

    return (
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => this.setState({ editando: true })}
      >
        <Text style={styles.createButtonText}>Criar perfil</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { erro, toastVisivel, toastMensagem } = this.state;

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
            <Text style={styles.subtitle}>Gerencie suas informacoes</Text>

            {erro ? <Text style={styles.error}>{erro}</Text> : null}
            {this.renderConteudo()}
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
}

export default PerfilScreen;

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
