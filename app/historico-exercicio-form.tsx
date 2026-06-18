import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { Component } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import HistoricoExercicioForm from "../src/components/historico/HistoricoExercicioForm";
import { HistoricoExercicioFormulario } from "../src/models/HistoricoExercicio";
import LocalSearchParamsAdapter, {
  LocalSearchParamReader,
  LocalSearchParamsProps,
} from "../src/navigation/LocalSearchParamsAdapter";
import HistoricoExercicioService from "../src/services/HistoricoExercicioService";

class HistoricoFormDefaults {
  static hoje(): string {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  }

  static criar(): HistoricoExercicioFormulario {
    return {
      exercicioId: "",
      nomeExercicio: "",
      grupoMuscular: "",
      dataExecucao: this.hoje(),
      series: "",
      repeticoes: "",
      cargaKg: "",
      duracaoMinutos: "",
      observacoes: "",
    };
  }
}

interface HistoricoExercicioFormState {
  form: HistoricoExercicioFormulario;
  erro: string;
  carregando: boolean;
  salvando: boolean;
}

class HistoricoExercicioFormScreen extends Component<
  LocalSearchParamsProps,
  HistoricoExercicioFormState
> {
  private readonly historicoService = new HistoricoExercicioService();
  private readonly paramReader: LocalSearchParamReader;

  constructor(props: LocalSearchParamsProps) {
    super(props);

    this.paramReader = new LocalSearchParamReader(props.params);
    this.state = {
      form: HistoricoFormDefaults.criar(),
      erro: "",
      carregando: false,
      salvando: false,
    };
  }

  componentDidMount() {
    this.carregarHistoricoParaEditar();
  }

  private get id() {
    return this.paramReader.get("id") || null;
  }

  private carregarHistoricoParaEditar = async () => {
    if (!this.id) {
      return;
    }

    try {
      this.setState({ carregando: true });

      const historico = await this.historicoService.buscarHistorico(this.id);

      if (!historico) {
        this.setState({ erro: "Historico nao encontrado." });
        return;
      }

      this.setState({
        form: {
          exercicioId: historico.exercicioId || "",
          nomeExercicio: historico.nomeExercicio,
          grupoMuscular: historico.grupoMuscular,
          dataExecucao: historico.dataExecucao,
          series: String(historico.series),
          repeticoes: String(historico.repeticoes),
          cargaKg: String(historico.cargaKg),
          duracaoMinutos: String(historico.duracaoMinutos),
          observacoes: historico.observacoes,
        },
      });
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

  private alterarCampo = (
    campo: keyof HistoricoExercicioFormulario,
    valor: string,
  ) => {
    this.setState((estadoAtual) => ({
      form: {
        ...estadoAtual.form,
        [campo]: valor,
      },
    }));
  };

  private salvarHistorico = async () => {
    const { form } = this.state;

    try {
      this.setState({ salvando: true, erro: "" });

      await this.historicoService.salvarHistorico({
        id: this.id,
        exercicioId: form.exercicioId || null,
        nomeExercicio: form.nomeExercicio,
        grupoMuscular: form.grupoMuscular,
        dataExecucao: form.dataExecucao,
        series: form.series,
        repeticoes: form.repeticoes,
        cargaKg: form.cargaKg,
        duracaoMinutos: form.duracaoMinutos,
        observacoes: form.observacoes,
      });

      router.replace("/historico-exercicios");
    } catch (error) {
      this.setState({
        erro:
          error instanceof Error ? error.message : "Erro ao salvar historico.",
      });
    } finally {
      this.setState({ salvando: false });
    }
  };

  private cancelar = () => {
    router.replace("/historico-exercicios");
  };

  render() {
    const { form, erro, carregando, salvando } = this.state;

    if (carregando) {
      return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <Text style={styles.loading}>Carregando historico...</Text>
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.replace("/historico-exercicios")}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>FitMatch</Text>

            <Ionicons name="ellipsis-vertical" size={22} color="#FFFFFF" />
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <HistoricoExercicioForm
              form={form}
              editandoId={this.id}
              erro={salvando ? "Salvando historico..." : erro}
              onChange={this.alterarCampo}
              onSubmit={this.salvarHistorico}
              onCancel={this.cancelar}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

export default LocalSearchParamsAdapter.connect(HistoricoExercicioFormScreen);

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
    paddingBottom: 40,
  },
  loading: {
    textAlign: "center",
    marginTop: 40,
    fontWeight: "700",
    color: "#6B7280",
  },
});
