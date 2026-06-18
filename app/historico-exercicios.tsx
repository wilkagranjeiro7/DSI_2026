import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { Component } from "react";
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
import HistoricoExercicioCard from "../src/components/historico/HistoricoExercicioCard";
import HistoricoExercicio from "../src/models/HistoricoExercicio";
import HistoricoExercicioService from "../src/services/HistoricoExercicioService";

interface HistoricoExerciciosState {
  historicos: HistoricoExercicio[];
  carregando: boolean;
  erro: string;
}

export default class HistoricoExerciciosScreen extends Component<
  object,
  HistoricoExerciciosState
> {
  private readonly historicoService = new HistoricoExercicioService();

  state: HistoricoExerciciosState = {
    historicos: [],
    carregando: true,
    erro: "",
  };

  componentDidMount() {
    this.carregarHistorico();
  }

  private carregarHistorico = async () => {
    try {
      this.setState({ carregando: true });

      const lista = await this.historicoService.listarHistorico();

      this.setState({ historicos: lista, erro: "" });
    } catch (error) {
      this.setState({
        erro:
          error instanceof Error
            ? error.message
            : "Erro ao carregar historico.",
      });
    } finally {
      this.setState({ carregando: false });
    }
  };

  private abrirNovoHistorico = () => {
    router.push("/historico-exercicio-form");
  };

  private editarHistorico = (historico: HistoricoExercicio) => {
    if (!historico.id) {
      return;
    }

    router.push({
      pathname: "/historico-exercicio-form",
      params: { id: historico.id },
    });
  };

  private confirmarExclusao = (id: string) => {
    Alert.alert(
      "Excluir historico",
      "Tem certeza que deseja excluir este registro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => this.excluirHistorico(id),
        },
      ],
    );
  };

  private excluirHistorico = async (id: string) => {
    try {
      await this.historicoService.excluirHistorico(id);
      await this.carregarHistorico();
    } catch (error) {
      Alert.alert(
        "Erro",
        error instanceof Error ? error.message : "Erro ao excluir historico.",
      );
    }
  };

  private renderConteudo() {
    const { historicos, carregando } = this.state;

    if (carregando) {
      return <Text style={styles.feedback}>Carregando historico...</Text>;
    }

    if (historicos.length === 0) {
      return (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Nenhum exercicio no historico</Text>
          <Text style={styles.emptyText}>
            Toque em "+ Novo" para registrar uma execucao manualmente.
          </Text>
        </View>
      );
    }

    return historicos.map((historico) => (
      <HistoricoExercicioCard
        key={historico.id}
        historico={historico}
        onEditar={this.editarHistorico}
        onExcluir={this.confirmarExclusao}
      />
    ));
  }

  render() {
    const { erro } = this.state;

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
            <View style={styles.titleRow}>
              <View style={styles.titleArea}>
                <Text style={styles.title}>Historico de exercicios</Text>
                <Text style={styles.subtitle}>Veja sua evolucao por execucao</Text>
              </View>

              <TouchableOpacity
                style={styles.newButton}
                onPress={this.abrirNovoHistorico}
              >
                <Text style={styles.newButtonText}>+ Novo</Text>
              </TouchableOpacity>
            </View>

            {erro ? <Text style={styles.error}>{erro}</Text> : null}
            {this.renderConteudo()}
          </ScrollView>

          <BottomNavbar active="treinos" />
        </View>
      </SafeAreaView>
    );
  }
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
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    gap: 12,
  },
  titleArea: {
    flex: 1,
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
  },
  newButton: {
    backgroundColor: "#FF8500",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  newButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
  },
  feedback: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "700",
  },
  error: {
    backgroundColor: "#FEE2E2",
    color: "#DC2626",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    fontWeight: "700",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#111827",
  },
  emptyText: {
    color: "#6B7280",
    marginTop: 6,
  },
});
