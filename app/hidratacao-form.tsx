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

import RegistroHidratacaoForm from "../src/components/hidratacao/RegistroHidratacaoForm";
import { RegistroHidratacaoFormulario } from "../src/models/RegistroHidratacao";
import LocalSearchParamsAdapter, {
  LocalSearchParamReader,
  LocalSearchParamsProps,
} from "../src/navigation/LocalSearchParamsAdapter";
import RegistroHidratacaoService from "../src/services/RegistroHidratacaoService";

function doisDigitos(valor: number): string {
  return String(valor).padStart(2, "0");
}

function formularioAgora(): RegistroHidratacaoFormulario {
  const agora = new Date();

  return {
    quantidadeMl: "",
    tipoBebida: "agua",
    data: `${agora.getFullYear()}-${doisDigitos(agora.getMonth() + 1)}-${doisDigitos(agora.getDate())}`,
    hora: `${doisDigitos(agora.getHours())}:${doisDigitos(agora.getMinutes())}`,
    observacoes: "",
  };
}

function formularioDoIso(dataHora: string): Pick<RegistroHidratacaoFormulario, "data" | "hora"> {
  const data = new Date(dataHora);

  return {
    data: `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`,
    hora: `${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}`,
  };
}

function criarDataHoraValida(dataTexto: string, horaTexto: string): string {
  const partesData = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dataTexto.trim());
  const partesHora = /^(\d{2}):(\d{2})$/.exec(horaTexto.trim());

  if (!partesData || !partesHora) {
    throw new Error("Informe uma data e uma hora válidas.");
  }

  const ano = Number(partesData[1]);
  const mes = Number(partesData[2]);
  const dia = Number(partesData[3]);
  const hora = Number(partesHora[1]);
  const minuto = Number(partesHora[2]);
  const dataHora = new Date(ano, mes - 1, dia, hora, minuto, 0, 0);

  const componentesValidos =
    dataHora.getFullYear() === ano &&
    dataHora.getMonth() === mes - 1 &&
    dataHora.getDate() === dia &&
    dataHora.getHours() === hora &&
    dataHora.getMinutes() === minuto;

  if (!componentesValidos) {
    throw new Error("Informe uma data e uma hora válidas.");
  }

  return dataHora.toISOString();
}

interface HidratacaoFormState {
  form: RegistroHidratacaoFormulario;
  erro: string;
  carregando: boolean;
  salvando: boolean;
}

class HidratacaoFormScreen extends Component<LocalSearchParamsProps, HidratacaoFormState> {
  private readonly service = new RegistroHidratacaoService();
  private readonly paramReader: LocalSearchParamReader;

  constructor(props: LocalSearchParamsProps) {
    super(props);
    this.paramReader = new LocalSearchParamReader(props.params);
    this.state = {
      form: formularioAgora(),
      erro: "",
      carregando: false,
      salvando: false,
    };
  }

  componentDidMount() {
    this.carregarParaEdicao();
  }

  private get id(): string | null {
    return this.paramReader.get("id") || null;
  }

  private carregarParaEdicao = async () => {
    if (!this.id) {
      return;
    }

    try {
      this.setState({ carregando: true });
      const registro = await this.service.buscarRegistro(this.id);

      if (!registro) {
        this.setState({ erro: "Registro não encontrado." });
        return;
      }

      this.setState({
        form: {
          quantidadeMl: String(registro.quantidadeMl),
          tipoBebida: registro.tipoBebida,
          ...formularioDoIso(registro.dataHora),
          observacoes: registro.observacoes,
        },
      });
    } catch (error) {
      this.setState({
        erro:
          error instanceof Error
            ? error.message
            : "Não foi possível carregar o registro.",
      });
    } finally {
      this.setState({ carregando: false });
    }
  };

  private alterarCampo = (
    campo: keyof RegistroHidratacaoFormulario,
    valor: string,
  ) => {
    this.setState((estadoAtual) => ({
      form: { ...estadoAtual.form, [campo]: valor },
      erro: "",
    }));
  };

  private salvar = async () => {
    const { form } = this.state;

    try {
      this.setState({ salvando: true, erro: "" });
      const dataHora = criarDataHoraValida(form.data, form.hora);

      await this.service.salvarRegistro({
        id: this.id,
        quantidadeMl: form.quantidadeMl.replace(",", "."),
        tipoBebida: form.tipoBebida,
        dataHora,
        observacoes: form.observacoes,
      });

      router.replace("/hidratacao");
    } catch (error) {
      this.setState({
        erro:
          error instanceof Error
            ? error.message
            : "Não foi possível salvar o registro.",
      });
    } finally {
      this.setState({ salvando: false });
    }
  };

  render() {
    const { form, erro, carregando, salvando } = this.state;

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.replace("/hidratacao")}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Diário de hidratação</Text>
            <Ionicons name="water" size={23} color="#FFFFFF" />
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            {carregando ? (
              <Text style={styles.loading}>Carregando registro...</Text>
            ) : (
              <RegistroHidratacaoForm
                form={form}
                editando={Boolean(this.id)}
                mensagem={erro}
                salvando={salvando}
                onChange={this.alterarCampo}
                onSubmit={this.salvar}
                onCancel={() => router.replace("/hidratacao")}
              />
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

export default LocalSearchParamsAdapter.connect(HidratacaoFormScreen);

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
  content: { padding: 16, paddingBottom: 40 },
  loading: { color: "#6B7280", textAlign: "center", marginTop: 35, fontWeight: "700" },
});
