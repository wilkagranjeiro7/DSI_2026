import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import React, { Component } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BottomNavbar from "../src/components/BottomNavbar";
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

interface CriarTreinoState {
  nomeTreino: string;
  objetivo: string;
  tipoTreino: string;
  diasSemana: string;
  duracao: string;
  observacoes: string;
}

class TreinoFormData {
  constructor(private readonly state: CriarTreinoState) {}

  toFirestore() {
    return {
      nome: this.state.nomeTreino,
      objetivo: this.state.objetivo,
      tipo: this.state.tipoTreino,
      dias: this.state.diasSemana,
      duracao: this.state.duracao,
      observacoes: this.state.observacoes,
    };
  }
}

class CriarTreinoScreen extends Component<LocalSearchParamsProps, CriarTreinoState> {
  private readonly paramReader: LocalSearchParamReader;

  constructor(props: LocalSearchParamsProps) {
    super(props);

    this.paramReader = new LocalSearchParamReader(props.params);
    this.state = {
      nomeTreino: this.paramReader.get("nome"),
      objetivo: this.paramReader.get("objetivo"),
      tipoTreino: this.paramReader.get("tipo"),
      diasSemana: this.paramReader.get("dias"),
      duracao: this.paramReader.get("duracao"),
      observacoes: this.paramReader.get("observacoes"),
    };
  }

  private get editando() {
    return this.paramReader.isTrue("editando");
  }

  private showMessage(title: string, message: string) {
    if (Platform.OS === "web") {
      window.alert(message);
      return;
    }

    Alert.alert(title, message);
  }

  private handleSalvar = async () => {
    const { nomeTreino } = this.state;

    if (nomeTreino === "") {
      this.showMessage("Atencao", "O nome do treino e obrigatorio!");
      return;
    }

    try {
      const formData = new TreinoFormData(this.state);
      const id = this.paramReader.get("id");

      if (this.editando && id) {
        if (id.length > 10) {
          await updateDoc(doc(db, "treinos", id), formData.toFirestore());
        }

        this.showMessage("Sucesso!", "Treino atualizado com sucesso!");
      } else {
        await addDoc(collection(db, "treinos"), {
          ...formData.toFirestore(),
          dataCriacao: new Date(),
        });

        this.showMessage("Sucesso!", "Treino salvo com sucesso!");
      }

      router.back();
    } catch (erro) {
      console.error("Erro ao salvar treino: ", erro);
      this.showMessage("Erro", "Nao foi possivel salvar o treino.");
    }
  };

  render() {
    const {
      nomeTreino,
      objetivo,
      tipoTreino,
      diasSemana,
      duracao,
      observacoes,
    } = this.state;

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.headerLaranja}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.headerLogo}>
              <MaterialCommunityIcons
                name="dumbbell"
                size={24}
                color={colors.white}
              />
              <Text style={styles.logoText}>FitMatch</Text>
            </View>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="ellipsis-vertical" size={22} color={colors.white} />
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <Text style={styles.mainTitle}>
                {this.editando ? "Editar treino" : "Novo treino"}
              </Text>
              <Text style={styles.subTitleHeader}>
                {this.editando
                  ? "Altere as informacoes da sua ficha"
                  : "Cadastre um treino personalizado"}
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome do treino</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex.: Treino de forca A"
                  placeholderTextColor="#A0A0A0"
                  value={nomeTreino}
                  onChangeText={(valor) => this.setState({ nomeTreino: valor })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Objetivo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Hipertrofia"
                  placeholderTextColor="#A0A0A0"
                  value={objetivo}
                  onChangeText={(valor) => this.setState({ objetivo: valor })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tipo de treino</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Forca"
                  placeholderTextColor="#A0A0A0"
                  value={tipoTreino}
                  onChangeText={(valor) => this.setState({ tipoTreino: valor })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Dias da semana</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Seg, Qua e Sex"
                  placeholderTextColor="#A0A0A0"
                  value={diasSemana}
                  onChangeText={(valor) => this.setState({ diasSemana: valor })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Duracao estimada</Text>
                <TextInput
                  style={styles.input}
                  placeholder="45 minutos"
                  placeholderTextColor="#A0A0A0"
                  value={duracao}
                  onChangeText={(valor) => this.setState({ duracao: valor })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Observacoes</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Anotacoes para execucao"
                  placeholderTextColor="#A0A0A0"
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={observacoes}
                  onChangeText={(valor) => this.setState({ observacoes: valor })}
                />
              </View>

              <TouchableOpacity
                style={styles.btnSalvar}
                onPress={this.handleSalvar}
                activeOpacity={0.8}
              >
                <Text style={styles.btnSalvarText}>
                  {this.editando ? "Atualizar treino" : "Salvar treino"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>

          <BottomNavbar active="treinos" />
        </View>
      </SafeAreaView>
    );
  }
}

export default LocalSearchParamsAdapter.connect(CriarTreinoScreen);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary },
  container: { flex: 1, backgroundColor: colors.background },
  headerLaranja: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 60,
  },
  headerLogo: { flexDirection: "row", alignItems: "center" },
  iconButton: { padding: 4 },
  logoText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  content: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  mainTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 10,
  },
  subTitleHeader: {
    fontSize: 15,
    color: colors.textSoft,
    marginTop: 2,
    marginBottom: 25,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  btnSalvar: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  btnSalvarText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});
