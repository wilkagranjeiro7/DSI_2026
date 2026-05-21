import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

export default function CriarTreinoScreen() {
  const router = useRouter();

  // Estados para capturar os dados do formulário
  const [nomeTreino, setNomeTreino] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [tipoTreino, setTipoTreino] = useState("");
  const [diasSemana, setDiasSemana] = useState("");
  const [duracao, setDuracao] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const handleSalvar = () => {
    // Aqui depois você adiciona a lógica para salvar no Firebase ou no seu estado global
    console.log({
      nomeTreino,
      objetivo,
      tipoTreino,
      diasSemana,
      duracao,
      observacoes,
    });

    // Volta para a tela anterior (Meus Treinos) após salvar
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Superior Laranja igual ao Figma */}
      <View style={styles.headerLaranja}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.logoText}>FitMatch</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* KeyboardAvoidingView para o teclado não cobrir os inputs em telas menores */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Títulos da Tela */}
          <Text style={styles.mainTitle}>Novo treino</Text>
          <Text style={styles.subTitleHeader}>
            Cadastre um treino personalizado
          </Text>

          {/* Campo: Nome do Treino */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do treino</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: Treino de força A"
              placeholderTextColor="#A0A0A0"
              value={nomeTreino}
              onChangeText={setNomeTreino}
            />
          </View>

          {/* Campo: Objetivo */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Objetivo</Text>
            <TextInput
              style={styles.input}
              placeholder="Hipertrofia"
              placeholderTextColor="#A0A0A0"
              value={objetivo}
              onChangeText={setObjetivo}
            />
          </View>

          {/* Campo: Tipo de treino */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo de treino</Text>
            <TextInput
              style={styles.input}
              placeholder="Força"
              placeholderTextColor="#A0A0A0"
              value={tipoTreino}
              onChangeText={setTipoTreino}
            />
          </View>

          {/* Campo: Dias da semana */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dias da semana</Text>
            <TextInput
              style={styles.input}
              placeholder="Seg, Qua e Sex"
              placeholderTextColor="#A0A0A0"
              value={diasSemana}
              onChangeText={setDiasSemana}
            />
          </View>

          {/* Campo: Duração estimada */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Duração estimada</Text>
            <TextInput
              style={styles.input}
              placeholder="45 minutos"
              placeholderTextColor="#A0A0A0"
              value={duracao}
              onChangeText={setDuracao}
            />
          </View>

          {/* Campo: Observações (Multiline/Maior) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Observações</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Anotações para execução"
              placeholderTextColor="#A0A0A0"
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
              value={observacoes}
              onChangeText={setObservacoes}
            />
          </View>

          {/* Botão Salvar Treino */}
          <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
            <Text style={styles.btnSalvarText}>Salvar treino</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  headerLaranja: {
    backgroundColor: "#F28C1B",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  logoText: { color: "#FFF", fontSize: 20, fontWeight: "bold" },
  content: { flex: 1, paddingHorizontal: 20 },

  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    marginTop: 20,
  },
  subTitleHeader: {
    fontSize: 13,
    color: "#707070",
    marginTop: 2,
    marginBottom: 25,
  },

  // Estrutura dos inputs do Figma
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 15,
    height: 48,
    fontSize: 15,
    color: "#333",
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },

  // Botão Salvar inferior
  btnSalvar: {
    backgroundColor: "#F28C1B",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  btnSalvarText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
