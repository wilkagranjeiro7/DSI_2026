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
import { AvaliacaoFisica } from "../src/models/AvaliacaoFisica";
import { AvaliacaoFisicaService } from "../src/services/AvaliacaoFisicaService";

interface AvaliacoesState {
  avaliacoes: AvaliacaoFisica[];
  carregando: boolean;
  erro: string;
}

export default class AvaliacoesScreen extends Component<object, AvaliacoesState> {
  private readonly avaliacaoService = new AvaliacaoFisicaService();

  state: AvaliacoesState = {
    avaliacoes: [],
    carregando: true,
    erro: "",
  };

  componentDidMount() {
    this.carregarAvaliacoes();
  }

  private carregarAvaliacoes = async () => {
    try {
      this.setState({ carregando: true });
      const lista = await this.avaliacaoService.listar();
      this.setState({ avaliacoes: lista, erro: "" });
    } catch (error) {
      this.setState({
        erro: error instanceof Error ? error.message : "Erro ao carregar avaliações.",
      });
    } finally {
      this.setState({ carregando: false });
    }
  };

  private editarAvaliacao = (item: AvaliacaoFisica) => {
    if (!item.id) return;
    router.push({
      pathname: "/avaliacao-form",
      params: { id: item.id },
    });
  };

  private deletarAvaliacao = (id?: string) => {
    if (!id) return;

    Alert.alert("Remover Registro", "Deseja realmente excluir esta avaliação?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await this.avaliacaoService.remover(id);
            this.carregarAvaliacoes();
          } catch (error) {
            Alert.alert("Erro", "Não foi possível excluir.");
          }
        },
      },
    ]);
  };

  renderConteudo() {
    const { avaliacoes, carregando } = this.state;

    if (carregando) return <Text style={styles.feedback}>Carregando dados físicos...</Text>;

    if (avaliacoes.length === 0) {
      return (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Nenhuma avaliação registrada</Text>
          <Text style={styles.emptyText}>Toque em "+ Nova avaliação" para acompanhar sua evolução corporal.</Text>
        </View>
      );
    }

    return avaliacoes.map((item) => (
      <View key={item.id} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardData}>📅 Data: {item.data}</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => this.editarAvaliacao(item)} style={{ marginRight: 16 }}>
              <Ionicons name="create-outline" size={20} color="#FF8500" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.deletarAvaliacao(item.id)}>
              <Ionicons name="trash-outline" size={20} color="#DC2626" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.cardGrid}>
          <Text style={styles.cardLabel}>Peso: <Text style={styles.cardValor}>{item.peso} kg</Text></Text>
          <Text style={styles.cardLabel}>Altura: <Text style={styles.cardValor}>{item.altura} m</Text></Text>
        </View>
        <View style={styles.imcBadge}>
          <Text style={styles.imcText}>IMC Calculado: {item.calcularIMC()}</Text>
        </View>
      </View>
    ));
  }

  render() {
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
                <Text style={styles.title}>Avaliação Física</Text>
                <Text style={styles.subtitle}>Evolução física</Text>
              </View>
              <TouchableOpacity style={styles.newButton} onPress={() => router.push("/avaliacao-form")}>
                <Text style={styles.newButtonText}>+ Nova avaliação</Text>
              </TouchableOpacity>
            </View>

            {this.state.erro ? <Text style={styles.error}>{this.state.erro}</Text> : null}
            {this.renderConteudo()}
          </ScrollView>

          <BottomNavbar active="perfil" />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FF8500" },
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  header: { height: 58, backgroundColor: "#FF8500", paddingHorizontal: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  content: { padding: 16, paddingBottom: 110 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  title: { fontSize: 24, fontWeight: "900", color: "#111827" },
  subtitle: { color: "#6B7280", fontSize: 13, marginTop: 3 },
  newButton: { backgroundColor: "#FF8500", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  newButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 12 },
  feedback: { color: "#6B7280", textAlign: "center", marginTop: 20, fontWeight: "700" },
  error: { backgroundColor: "#FEE2E2", color: "#DC2626", padding: 10, borderRadius: 10, marginBottom: 12, fontWeight: "700" },
  emptyCard: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 18, borderWidth: 1, borderColor: "#E5E7EB" },
  emptyTitle: { fontSize: 17, fontWeight: "900", color: "#111827" },
  emptyText: { color: "#6B7280", marginTop: 6 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#E5E7EB" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  cardData: { fontWeight: "700", color: "#374151" },
  actions: { flexDirection: "row", alignItems: "center" },
  cardGrid: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  cardLabel: { color: "#6B7280" },
  cardValor: { color: "#111827", fontWeight: "700" },
  imcBadge: { backgroundColor: "#EFF6FF", padding: 8, borderRadius: 10, alignItems: "center" },
  imcText: { color: "#1D4ED8", fontWeight: "800" },
});