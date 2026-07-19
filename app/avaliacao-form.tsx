import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { Component } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import LocalSearchParamsAdapter, {
    LocalSearchParamReader,
    LocalSearchParamsProps,
} from "../src/navigation/LocalSearchParamsAdapter";
import { AvaliacaoFisicaService } from "../src/services/AvaliacaoFisicaService";

interface FormState {
  peso: string;
  altura: string;
  cintura: string;
  quadril: string;
  salvando: boolean;
  mensagemErro: string;
  mensagemSucesso: string;
}

class AvaliacaoFormScreen extends Component<LocalSearchParamsProps, FormState> {
  private readonly avaliacaoService = new AvaliacaoFisicaService();
  private readonly paramReader: LocalSearchParamReader;

  constructor(props: LocalSearchParamsProps) {
    super(props);
    this.paramReader = new LocalSearchParamReader(props.params);
    this.state = {
      peso: "",
      altura: "",
      cintura: "",
      quadril: "",
      salvando: false,
      mensagemErro: "",
      mensagemSucesso: "",
    };
  }

  componentDidMount() {
    this.carregarDadosParaEdicao();
  }

  private get id() {
    return this.paramReader.get("id") || null;
  }

  private carregarDadosParaEdicao = async () => {
    if (!this.id) return;

    try {
      
      const lista = await this.avaliacaoService.listar();
      const avaliacao = lista.find(item => item.id === this.id);

      if (avaliacao) {
        this.setState({
          peso: String(avaliacao.peso),
          altura: String(avaliacao.altura),
          cintura: avaliacao.cintura ? String(avaliacao.cintura) : "",
          quadril: avaliacao.quadril ? String(avaliacao.quadril) : "",
        });
      }
    } catch (error) {
      this.setState({ mensagemErro: "Erro ao buscar dados para edição." });
    }
  };

  private salvar = async () => {
    const { peso, altura, cintura, quadril } = this.state;
    this.setState({ mensagemErro: "", mensagemSucesso: "" });

    if (!peso || !altura) {
      this.setState({ mensagemErro: "Por favor, preencha Peso e Altura." });
      return;
    }

    try {
      this.setState({ salvando: true });

      await this.avaliacaoService.registrar({
        id: this.id || undefined,
        peso: parseFloat(peso),
        altura: parseFloat(altura),
        cintura: cintura ? parseFloat(cintura) : undefined,
        quadril: quadril ? parseFloat(quadril) : undefined,
        data: "", 
      });

      this.setState({ mensagemSucesso: "Dados biométricos salvos com sucesso!" });
      setTimeout(() => {
        router.replace("/avaliacoes");
      }, 1500);

    } catch (error) {
      this.setState({ 
        mensagemErro: error instanceof Error ? error.message : "Erro ao salvar os dados." 
      });
    } finally {
      if (!this.state.mensagemSucesso) {
        this.setState({ salvando: false });
      }
    }
  };

  render() {
    const { peso, altura, cintura, quadril, salvando, mensagemErro, mensagemSucesso } = this.state;

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.replace("/avaliacoes")} disabled={salvando}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{this.id ? "Editar Avaliação" : "Nova Avaliação"}</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            
            {mensagemErro ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={18} color="#DC2626" />
                <Text style={styles.errorText}>{mensagemErro}</Text>
              </View>
            ) : null}

            {mensagemSucesso ? (
              <View style={styles.successContainer}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#16A34A" />
                <Text style={styles.successText}>{mensagemSucesso}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Peso (kg)</Text>
              <TextInput
                style={[styles.input, mensagemErro && !peso ? styles.inputAlert : null]}
                placeholder="Ex: 75.5"
                keyboardType="decimal-pad"
                value={peso}
                onChangeText={(val) => this.setState({ peso: val.replace(/[^0-9,.]/g, ''), mensagemErro: "" })}
                editable={!salvando && !mensagemSucesso}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Altura (m)</Text>
              <TextInput
                style={[styles.input, mensagemErro && !altura ? styles.inputAlert : null]}
                placeholder="Ex: 1.75"
                keyboardType="decimal-pad"
                value={altura}
                onChangeText={(val) => this.setState({ altura: val.replace(/[^0-9,.]/g, ''), mensagemErro: "" })}
                editable={!salvando && !mensagemSucesso}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cintura (cm) - Opcional</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 84"
                keyboardType="decimal-pad"
                value={cintura}
                onChangeText={(val) => this.setState({ cintura: val.replace(/[^0-9,.]/g, '') })}
                editable={!salvando && !mensagemSucesso}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Quadril (cm) - Opcional</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 98"
                keyboardType="decimal-pad"
                value={quadril}
                onChangeText={(val) => this.setState({ quadril: val.replace(/[^0-9,.]/g, '') })}
                editable={!salvando && !mensagemSucesso}
              />
            </View>

            <TouchableOpacity 
              style={[styles.button, (salvando || mensagemSucesso) && styles.buttonDisabled]} 
              onPress={this.salvar} 
              disabled={salvando || !!mensagemSucesso}
            >
              <Text style={styles.buttonText}>
                {salvando ? "Enviando dados..." : mensagemSucesso ? "Pronto!" : "Salvar Registro"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FF8500" },
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  header: { height: 58, backgroundColor: "#FF8500", paddingHorizontal: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  content: { padding: 20 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, color: "#4B5563", marginBottom: 6, fontWeight: "600" },
  input: { backgroundColor: "#FFFFFF", height: 50, borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 12, paddingHorizontal: 16, color: "#111827" },
  inputAlert: { borderColor: "#EF4444", backgroundColor: "#FEF2F2" },
  button: { backgroundColor: "#FF8500", height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center", marginTop: 24 },
  buttonDisabled: { opacity: 0.6, backgroundColor: "#9CA3AF" },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  errorContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#FEE2E2", padding: 12, borderRadius: 12, marginBottom: 16, borderLeftWidth: 4, borderColor: "#DC2626" },
  errorText: { color: "#991B1B", fontSize: 13, fontWeight: "700", marginLeft: 8, flex: 1 },
  successContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#DCFCE7", padding: 12, borderRadius: 12, marginBottom: 16, borderLeftWidth: 4, borderColor: "#16A34A" },
  successText: { color: "#166534", fontSize: 13, fontWeight: "700", marginLeft: 8, flex: 1 },
});

export default LocalSearchParamsAdapter.connect(AvaliacaoFormScreen);