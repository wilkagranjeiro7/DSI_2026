import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import React, { Component } from "react";
import {
  Alert,
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
import { db } from "../src/utils/firebaseConfig";

const colors = {
  primary: "#F28C1B",
  background: "#F3F4F6",
  white: "#FFFFFF",
  text: "#111827",
  textSoft: "#8E8EA0",
  border: "#E5E7EB",
};

interface CriarExercicioState {
  nome: string;
  grupoMuscular: string;
  equipamento: string;
  series: string;
  repeticoes: string;
  descanso: string;
  descricao: string;
}

class ExercicioFormData {
  constructor(private readonly state: CriarExercicioState) {}

  toFirestore() {
    return {
      nome: this.state.nome,
      grupoMuscular: this.state.grupoMuscular,
      equipamento: this.state.equipamento,
      series: this.state.series,
      repeticoes: this.state.repeticoes,
      descanso: this.state.descanso,
      descricao: this.state.descricao,
    };
  }
}

class CriarExerciciosScreen extends Component<
  LocalSearchParamsProps,
  CriarExercicioState
> {
  private readonly paramReader: LocalSearchParamReader;

  constructor(props: LocalSearchParamsProps) {
    super(props);

    this.paramReader = new LocalSearchParamReader(props.params);
    this.state = {
      nome: this.paramReader.get("nome"),
      grupoMuscular: this.paramReader.get("grupoMuscular"),
      equipamento: "",
      series: "",
      repeticoes: "",
      descanso: "",
      descricao: this.paramReader.get("instrucoes"),
    };
  }

  private get editando() {
    return this.paramReader.isTrue("editando");
  }

  private salvarEdicaoLocal = async () => {
    const raw = await AsyncStorage.getItem("edicoesPadrao");
    const edicoes = raw ? JSON.parse(raw) : {};

    edicoes[this.paramReader.get("id")] = {
      nome: this.state.nome,
      grupo: this.state.grupoMuscular,
      instrucoes: this.state.descricao,
    };

    await AsyncStorage.setItem("edicoesPadrao", JSON.stringify(edicoes));
  };

  private salvarExercicio = async (): Promise<void> => {
    if (this.state.nome === "") {
      Alert.alert("Atencao", "O nome do exercicio e obrigatorio!");
      return;
    }

    try {
      const formData = new ExercicioFormData(this.state);

      if (this.editando) {
        const isFirebase = this.paramReader.isTrue("isFirebase");

        if (isFirebase) {
          await updateDoc(
            doc(db, "exercicios", this.paramReader.get("id")),
            formData.toFirestore(),
          );
        } else {
          await this.salvarEdicaoLocal();
        }

        Alert.alert("Sucesso!", "Exercicio atualizado com sucesso.");
      } else {
        await addDoc(collection(db, "exercicios"), {
          ...formData.toFirestore(),
          dataCriacao: new Date(),
        });
        Alert.alert("Sucesso!", "Exercicio salvo com sucesso.");
      }

      router.back();
    } catch (erro) {
      console.error("Erro ao salvar:", erro);
      Alert.alert("Erro", "Nao foi possivel salvar.");
    }
  };

  render() {
    const {
      nome,
      grupoMuscular,
      equipamento,
      series,
      repeticoes,
      descanso,
      descricao,
    } = this.state;

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <View style={styles.headerLogo}>
              <MaterialCommunityIcons
                name="dumbbell"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.headerTitle}>FitMatch</Text>
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <Ionicons
                name="ellipsis-vertical"
                size={22}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.pageTitle}>
              {this.editando ? "Editar exercicio" : "Novo exercicio"}
            </Text>
            <Text style={styles.pageSubtitle}>
              {this.editando
                ? "Altere as informacoes do exercicio"
                : "Cadastre um exercicio para o treino"}
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome do exercicio</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex.: Desenvolvimento militar"
                placeholderTextColor="#A0A0A0"
                value={nome}
                onChangeText={(valor) => this.setState({ nome: valor })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Grupo muscular</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex.: Ombros, Costas..."
                placeholderTextColor="#A0A0A0"
                value={grupoMuscular}
                onChangeText={(valor) => this.setState({ grupoMuscular: valor })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Equipamento</Text>
              <TextInput
                style={styles.input}
                placeholder="Halteres"
                placeholderTextColor="#A0A0A0"
                value={equipamento}
                onChangeText={(valor) => this.setState({ equipamento: valor })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Series</Text>
              <TextInput
                style={styles.input}
                placeholder="4"
                keyboardType="numeric"
                placeholderTextColor="#A0A0A0"
                value={series}
                onChangeText={(valor) => this.setState({ series: valor })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Repeticoes</Text>
              <TextInput
                style={styles.input}
                placeholder="12"
                keyboardType="numeric"
                placeholderTextColor="#A0A0A0"
                value={repeticoes}
                onChangeText={(valor) => this.setState({ repeticoes: valor })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descanso</Text>
              <TextInput
                style={styles.input}
                placeholder="60 segundos"
                placeholderTextColor="#A0A0A0"
                value={descanso}
                onChangeText={(valor) => this.setState({ descanso: valor })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descricao / instrucoes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Execucao resumida do movimento"
                placeholderTextColor="#A0A0A0"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={descricao}
                onChangeText={(valor) => this.setState({ descricao: valor })}
              />
            </View>

            <TouchableOpacity
              style={styles.btnSalvar}
              activeOpacity={0.8}
              onPress={this.salvarExercicio}
            >
              <Text style={styles.btnSalvarText}>
                {this.editando ? "Atualizar" : "Salvar"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

export default LocalSearchParamsAdapter.connect(CriarExerciciosScreen);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    height: 60,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingTop: 10,
  },
  backButton: { padding: 4 },
  headerLogo: { flexDirection: "row", alignItems: "center" },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
    marginLeft: 8,
  },
  moreButton: { padding: 4 },
  scrollContent: { padding: 20, paddingBottom: 120 },
  pageTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 10,
  },
  pageSubtitle: { fontSize: 15, color: colors.textSoft, marginBottom: 25 },
  inputGroup: { marginBottom: 18 },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  textArea: { height: 100 },
  btnSalvar: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
    elevation: 2,
  },
  btnSalvarText: { color: colors.white, fontSize: 18, fontWeight: "bold" },
});
