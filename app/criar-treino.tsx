import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
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

// Importações do Firebase
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../src/utils/firebaseConfig"; // Mesma rota de antes!

const colors = {
  primary: "#F28C1B",
  background: "#F3F4F6",
  white: "#FFFFFF",
  text: "#111827",
  textSoft: "#8E8EA0",
  border: "#E5E7EB",
};

export default function CriarTreinoScreen() {
  const router = useRouter();

  // Pegando os dados se o usuário veio pelo botão "Editar"
  const params = useLocalSearchParams();
  const editando = params.editando === "true";

  // Estados preenchidos com os dados existentes (se estiver editando)
  const [nomeTreino, setNomeTreino] = useState((params.nome as string) || "");
  const [objetivo, setObjetivo] = useState((params.objetivo as string) || "");
  const [tipoTreino, setTipoTreino] = useState((params.tipo as string) || "");
  const [diasSemana, setDiasSemana] = useState((params.dias as string) || "");
  const [duracao, setDuracao] = useState((params.duracao as string) || "");
  const [observacoes, setObservacoes] = useState(
    (params.observacoes as string) || "",
  );

  // A função que manda os dados do treino para a "cozinha" (Firebase)
  const handleSalvar = async () => {
    if (nomeTreino === "") {
      if (Platform.OS === "web")
        window.alert("O nome do treino é obrigatório!");
      else Alert.alert("Atenção", "O nome do treino é obrigatório!");
      return;
    }

    try {
      if (editando && params.id) {
        // Se já existe e é do Firebase (ID longo), nós ATUALIZAMOS
        if ((params.id as string).length > 10) {
          await updateDoc(doc(db, "treinos", params.id as string), {
            nome: nomeTreino,
            objetivo,
            tipo: tipoTreino,
            dias: diasSemana,
            duracao,
            observacoes,
          });
        }

        if (Platform.OS === "web")
          window.alert("Treino atualizado com sucesso!");
        else Alert.alert("Sucesso!", "Treino atualizado com sucesso.");
      } else {
        // Se for um NOVO treino, nós SALVAMOS na coleção "treinos"
        await addDoc(collection(db, "treinos"), {
          nome: nomeTreino,
          objetivo,
          tipo: tipoTreino,
          dias: diasSemana,
          duracao,
          observacoes,
          dataCriacao: new Date(),
        });

        if (Platform.OS === "web") window.alert("Treino salvo com sucesso!");
        else Alert.alert("Sucesso!", "Treino salvo com sucesso.");
      }

      router.back();
    } catch (erro) {
      console.error("Erro ao salvar treino: ", erro);
      if (Platform.OS === "web")
        window.alert("Não foi possível salvar o treino.");
      else Alert.alert("Erro", "Não foi possível salvar o treino.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* CABEÇALHO LARANJA */}
        <View style={styles.headerLaranja}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconButton}
          >
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
            {/* TÍTULOS DINÂMICOS: Mudam se for Editar ou Novo */}
            <Text style={styles.mainTitle}>
              {editando ? "Editar treino" : "Novo treino"}
            </Text>
            <Text style={styles.subTitleHeader}>
              {editando
                ? "Altere as informações da sua ficha"
                : "Cadastre um treino personalizado"}
            </Text>

            {/* FORMULÁRIO */}
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

            {/* BOTÃO SALVAR */}
            <TouchableOpacity
              style={styles.btnSalvar}
              onPress={handleSalvar}
              activeOpacity={0.8}
            >
              <Text style={styles.btnSalvarText}>
                {editando ? "Atualizar treino" : "Salvar treino"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* BARRA DE NAVEGAÇÃO INFERIOR */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => router.push("/home")}
          >
            <Ionicons name="home-outline" size={24} color={colors.textSoft} />
            <Text style={styles.tabText}>Início</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => router.push("/meus-treinos")}
          >
            <MaterialCommunityIcons
              name="dumbbell"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.tabText, { color: colors.primary }]}>
              Treinos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem}>
            <Feather name="target" size={24} color={colors.textSoft} />
            <Text style={styles.tabText}>Metas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem}>
            <Ionicons name="map-outline" size={24} color={colors.textSoft} />
            <Text style={styles.tabText}>Mapa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => router.push("/perfil")}
          >
            <Ionicons name="person-outline" size={24} color={colors.textSoft} />
            <Text style={styles.tabText}>Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

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

  bottomBar: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: colors.white,
    width: "100%",
    paddingBottom: 25,
  },
  tabItem: { alignItems: "center", justifyContent: "center" },
  tabText: {
    fontSize: 12,
    color: colors.textSoft,
    marginTop: 4,
    fontWeight: "500",
  },
});
