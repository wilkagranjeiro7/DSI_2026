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
import MetaCard from "../src/components/metas/MetaCard";
import Meta from "../src/models/Meta";
import MetaService from "../src/services/MetaService";

interface MetasState {
  metas: Meta[];
  carregando: boolean;
  erro: string;
}

export default class MetasScreen extends Component<object, MetasState> {
  private readonly metaService = new MetaService();

  state: MetasState = {
    metas: [],
    carregando: true,
    erro: "",
  };

  componentDidMount() {
    this.carregarMetas();
  }

  private carregarMetas = async () => {
    try {
      this.setState({ carregando: true });

      const lista = await this.metaService.listarMetas();

      this.setState({ metas: lista, erro: "" });
    } catch (error) {
      this.setState({
        erro:
          error instanceof Error ? error.message : "Erro ao carregar metas.",
      });
    } finally {
      this.setState({ carregando: false });
    }
  };

  private abrirNovaMeta = () => {
    router.push("/meta-form");
  };

  private editarMeta = (meta: Meta) => {
    if (!meta.id) {
      return;
    }

    router.push({
      pathname: "/meta-form",
      params: { id: meta.id },
    });
  };

  private confirmarExclusao = (id: string) => {
    Alert.alert("Excluir meta", "Tem certeza que deseja excluir esta meta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => this.excluirMeta(id),
      },
    ]);
  };

  private excluirMeta = async (id: string) => {
    try {
      await this.metaService.excluirMeta(id);
      await this.carregarMetas();
    } catch (error) {
      Alert.alert(
        "Erro",
        error instanceof Error ? error.message : "Erro ao excluir meta.",
      );
    }
  };

  private concluirMeta = async (id: string) => {
    try {
      await this.metaService.concluirMeta(id);
      await this.carregarMetas();
    } catch (error) {
      Alert.alert(
        "Erro",
        error instanceof Error ? error.message : "Erro ao concluir meta.",
      );
    }
  };

  private renderConteudo() {
    const { metas, carregando, erro } = this.state;

    if (carregando) {
      return <Text style={styles.feedback}>Carregando metas...</Text>;
    }

    if (metas.length === 0) {
      return (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Nenhuma meta cadastrada</Text>
          <Text style={styles.emptyText}>
            Toque em "+ Nova meta" para criar sua primeira meta.
          </Text>
        </View>
      );
    }

    return metas.map((meta) => (
      <MetaCard
        key={meta.id}
        meta={meta}
        onEditar={this.editarMeta}
        onExcluir={this.confirmarExclusao}
        onConcluir={this.concluirMeta}
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
              <View>
                <Text style={styles.title}>Minhas metas</Text>
                <Text style={styles.subtitle}>Acompanhe seu progresso</Text>
              </View>

              <TouchableOpacity
                style={styles.newButton}
                onPress={this.abrirNovaMeta}
              >
                <Text style={styles.newButtonText}>+ Nova meta</Text>
              </TouchableOpacity>
            </View>

            {erro ? <Text style={styles.error}>{erro}</Text> : null}
            {this.renderConteudo()}
          </ScrollView>

          <BottomNavbar active="metas" />
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
    borderRadius: 18,
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
