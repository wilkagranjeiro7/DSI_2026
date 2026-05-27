import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
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

  // Busca dados do Firebase de forma dinâmica com o listener ativo
  useEffect(() => {
    carregarPerfil();
  }, []);

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
      await perfilService.salvarPerfil({
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        idade: form.idade,
        peso: form.peso,
        altura: form.altura,
        objetivo: form.objetivo,
        nivel: form.nivel,
        observacoes: form.observacoes,
      });

      await carregarPerfil();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao salvar perfil.");
    }
  }

  function confirmarExclusao() {
    Alert.alert("Excluir perfil", "Tem certeza que deseja excluir os dados do perfil?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: excluirPerfil,
      },
    ]);
  }

  async function excluirPerfil() {
    try {
      await perfilService.excluirPerfil();

      setPerfil(null);
      setForm({ ...formInicial });
      setEditando(true);
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
            <Text style={styles.feedback}>Carregando perfil...</Text>
          ) : editando ? (
            <PerfilForm
              form={form}
              erro={erro}
              onChange={alterarCampo}
              onSubmit={salvarPerfil}
              onCancel={cancelarEdicao}
            />
          ) : perfil ? (
            <PerfilCard
              perfil={perfil}
              onEditar={() => preencherFormulario(perfil)}
              onExcluir={confirmarExclusao}
            />
          ) : (
            <TouchableOpacity style={styles.createButton} onPress={() => setEditando(true)}>
              <Text style={styles.createButtonText}>Criar perfil</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        <BottomNavbar active="perfil" />

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
  feedback: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: 20,
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
  }
});