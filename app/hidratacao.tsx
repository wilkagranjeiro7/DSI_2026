import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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
import RegistroHidratacaoCard from "../src/components/hidratacao/RegistroHidratacaoCard";
import RegistroHidratacao from "../src/models/RegistroHidratacao";
import RegistroHidratacaoService, {
  ResumoHidratacao,
} from "../src/services/RegistroHidratacaoService";

interface HidratacaoState {
  registros: RegistroHidratacao[];
  resumo: ResumoHidratacao;
  carregando: boolean;
  erro: string;
}

const resumoInicial: ResumoHidratacao = {
  totalHojeMl: 0,
  metaDiariaMl: 2000,
  percentual: 0,
  quantidadeRegistros: 0,
};

export default class HidratacaoScreen extends Component<object, HidratacaoState> {
  private readonly service = new RegistroHidratacaoService();

  state: HidratacaoState = {
    registros: [],
    resumo: resumoInicial,
    carregando: true,
    erro: "",
  };

  componentDidMount() {
    this.carregarRegistros();
  }

  private carregarRegistros = async () => {
    try {
      this.setState({ carregando: true });
      const registros = await this.service.listarRegistros();
      const resumo = this.service.calcularResumo(registros);
      this.setState({ registros, resumo, erro: "" });
    } catch (error) {
      this.setState({
        erro:
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os registros.",
      });
    } finally {
      this.setState({ carregando: false });
    }
  };

  private abrirNovoRegistro = () => {
    router.push("/hidratacao-form");
  };

  private editarRegistro = (registro: RegistroHidratacao) => {
    if (!registro.id) {
      return;
    }

    router.push({ pathname: "/hidratacao-form", params: { id: registro.id } });
  };

  private confirmarExclusao = (id: string) => {
    Alert.alert(
      "Excluir consumo",
      "Tem certeza que deseja remover este registro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => this.excluirRegistro(id),
        },
      ],
    );
  };

  private excluirRegistro = async (id: string) => {
    try {
      await this.service.excluirRegistro(id);
      await this.carregarRegistros();
    } catch (error) {
      Alert.alert(
        "Erro",
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o registro.",
      );
    }
  };

  private renderRegistros() {
    const { registros, carregando } = this.state;

    if (carregando) {
      return <ActivityIndicator size="large" color="#F28C1B" />;
    }

    if (registros.length === 0) {
      return (
        <View style={styles.emptyCard}>
          <Ionicons name="water-outline" size={42} color="#38BDF8" />
          <Text style={styles.emptyTitle}>Nenhum consumo registrado</Text>
          <Text style={styles.emptyText}>
            Registre a primeira bebida para acompanhar sua hidratação diária.
          </Text>
        </View>
      );
    }

    return registros.map((registro) => (
      <RegistroHidratacaoCard
        key={registro.id}
        registro={registro}
        onEditar={this.editarRegistro}
        onExcluir={this.confirmarExclusao}
      />
    ));
  }

  render() {
    const { resumo, erro } = this.state;

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Diário de hidratação</Text>
            <Ionicons name="water" size={23} color="#FFFFFF" />
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.titleRow}>
              <View>
                <Text style={styles.title}>Hidratação</Text>
                <Text style={styles.subtitle}>Acompanhe o consumo do dia</Text>
              </View>

              <TouchableOpacity
                style={styles.newButton}
                onPress={this.abrirNovoRegistro}
              >
                <Text style={styles.newButtonText}>+ Registrar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryTop}>
                <View>
                  <Text style={styles.summaryLabel}>Consumido hoje</Text>
                  <Text style={styles.summaryValue}>
                    {resumo.totalHojeMl} / {resumo.metaDiariaMl} ml
                  </Text>
                </View>
                <Text style={styles.percentage}>{resumo.percentual}%</Text>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${resumo.percentual}%` },
                  ]}
                />
              </View>

              <Text style={styles.summaryFooter}>
                {resumo.quantidadeRegistros} registro(s) hoje
              </Text>
            </View>

            {erro ? <Text style={styles.error}>{erro}</Text> : null}

            <Text style={styles.sectionTitle}>Histórico</Text>
            {this.renderRegistros()}
          </ScrollView>

          <BottomNavbar active="home" />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F28C1B" },
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  header: {
    height: 58,
    backgroundColor: "#F28C1B",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },
  content: { padding: 16, paddingBottom: 110 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: { color: "#111827", fontSize: 25, fontWeight: "900" },
  subtitle: { color: "#6B7280", fontSize: 13, marginTop: 3 },
  newButton: {
    backgroundColor: "#F28C1B",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  newButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },
  summaryCard: {
    backgroundColor: "#E0F2FE",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#7DD3FC",
    padding: 16,
    marginBottom: 18,
  },
  summaryTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: { color: "#0369A1", fontWeight: "800", fontSize: 13 },
  summaryValue: { color: "#0C4A6E", fontWeight: "900", fontSize: 22, marginTop: 3 },
  percentage: { color: "#0284C7", fontSize: 23, fontWeight: "900" },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#BAE6FD",
    overflow: "hidden",
    marginTop: 14,
  },
  progressFill: { height: "100%", backgroundColor: "#0EA5E9" },
  summaryFooter: { color: "#0369A1", fontSize: 12, marginTop: 8 },
  sectionTitle: { color: "#111827", fontSize: 18, fontWeight: "900", marginBottom: 10 },
  error: {
    backgroundColor: "#FEE2E2",
    color: "#B91C1C",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    fontWeight: "700",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emptyTitle: { color: "#111827", fontSize: 17, fontWeight: "900", marginTop: 10 },
  emptyText: { color: "#6B7280", textAlign: "center", lineHeight: 19, marginTop: 5 },
});
