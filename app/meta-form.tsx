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

import MetaForm from "../src/components/metas/MetaForm";
import { MetaFormulario } from "../src/models/Meta";
import LocalSearchParamsAdapter, {
    LocalSearchParamReader,
    LocalSearchParamsProps,
} from "../src/navigation/LocalSearchParamsAdapter";
import MetaService from "../src/services/MetaService";

const formInicial: MetaFormulario = {
  titulo: "",
  categoria: "",
  valorAtual: "",
  valorDesejado: "",
  unidade: "",
  dataLimite: "",
  observacoes: "",
  relacionadoTipo: "",
  relacionadoId: "",
};

interface MetaFormState {
  form: MetaFormulario;
  erro: string;
  carregando: boolean;
  salvando: boolean;
}

class MetaFormScreen extends Component<LocalSearchParamsProps, MetaFormState> {
  private readonly metaService = new MetaService();
  private readonly paramReader: LocalSearchParamReader;

  constructor(props: LocalSearchParamsProps) {
    super(props);

    this.paramReader = new LocalSearchParamReader(props.params);
    this.state = {
      form: { ...formInicial },
      erro: "",
      carregando: false,
      salvando: false,
    };
  }

  componentDidMount() {
    this.carregarMetaParaEditar();
  }

  private get id() {
    return this.paramReader.get("id") || null;
  }

  private carregarMetaParaEditar = async () => {
    if (!this.id) {
      return;
    }

    try {
      this.setState({ carregando: true });

      const meta = await this.metaService.buscarMeta(this.id);

      if (!meta) {
        this.setState({ erro: "Meta nao encontrada." });
        return;
      }

      this.setState({
        form: {
          titulo: meta.titulo,
          categoria: meta.categoria,
          valorAtual: String(meta.valorAtual),
          valorDesejado: String(meta.valorDesejado),
          unidade: meta.unidade,
          dataLimite: meta.dataLimite,
          observacoes: meta.observacoes,
          relacionadoTipo: meta.relacionadoTipo || "",
          relacionadoId: meta.relacionadoId || "",
        },
      });
    } catch (error) {
      this.setState({
        erro: error instanceof Error ? error.message : "Erro ao carregar meta.",
      });
    } finally {
      this.setState({ carregando: false });
    }
  };

  private alterarCampo = (campo: keyof MetaFormulario, valor: string) => {
    this.setState((estadoAtual) => ({
      form: {
        ...estadoAtual.form,
        [campo]: valor,
      },
    }));
  };

  private salvarMeta = async () => {
    const { form } = this.state;

    try {
      this.setState({ salvando: true });

      await this.metaService.salvarMeta({
        id: this.id,
        titulo: form.titulo,
        categoria: form.categoria,
        valorAtual: form.valorAtual,
        valorDesejado: form.valorDesejado,
        unidade: form.unidade,
        dataLimite: form.dataLimite,
        observacoes: form.observacoes,
        relacionadoTipo: form.relacionadoTipo || null,
        relacionadoId: form.relacionadoId || null,
      });

      router.replace("/metas");
    } catch (error) {
      this.setState({
        erro: error instanceof Error ? error.message : "Erro ao salvar meta.",
      });
    } finally {
      this.setState({ salvando: false });
    }
  };

  private cancelar = () => {
    router.replace("/metas");
  };

  render() {
    const { form, erro, carregando, salvando } = this.state;

    if (carregando) {
      return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <Text style={styles.loading}>Carregando meta...</Text>
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.replace("/metas")}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>FitMatch</Text>

            <Ionicons name="ellipsis-vertical" size={22} color="#FFFFFF" />
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <MetaForm
              form={form}
              editandoId={this.id}
              erro={salvando ? "Salvando meta..." : erro}
              onChange={this.alterarCampo}
              onSubmit={this.salvarMeta}
              onCancel={this.cancelar}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

export default LocalSearchParamsAdapter.connect(MetaFormScreen);

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
