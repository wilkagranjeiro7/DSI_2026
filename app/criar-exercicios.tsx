import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
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

import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../src/utils/firebaseConfig";

const colors = {
  primary: "#F28C1B",
  background: "#F3F4F6",
  white: "#FFFFFF",
  text: "#111827",
  textSoft: "#8E8EA0",
  border: "#E5E7EB",
};

export default function CriarExerciciosScreen() {
  const router = useRouter();

  const params = useLocalSearchParams();
  const editando = params.editando === "true";

  const [nome, setNome] = useState<string>((params.nome as string) || "");
  const [grupoMuscular, setGrupoMuscular] = useState<string>(
    (params.grupoMuscular as string) || "",
  );
  const [equipamento, setEquipamento] = useState<string>("");
  const [series, setSeries] = useState<string>("");
  const [repeticoes, setRepeticoes] = useState<string>("");
  const [descanso, setDescanso] = useState<string>("");
  const [descricao, setDescricao] = useState<string>(
    (params.instrucoes as string) || "",
  );

  const salvarExercicio = async (): Promise<void> => {
    if (nome === "") {
      Alert.alert("Atenção", "O nome do exercício é obrigatório!");
      return;
    }

    try {
      if (editando) {
        const isFirebase = params.isFirebase === "true";

        if (isFirebase) {
          await updateDoc(doc(db, "exercicios", params.id as string), {
            nome,
            grupoMuscular,
            equipamento,
            series,
            repeticoes,
            descanso,
            descricao,
          });
        } else {
          const raw = await AsyncStorage.getItem("edicoesPadrao");
          const edicoes = raw ? JSON.parse(raw) : {};
          edicoes[params.id as string] = {
            nome,
            grupo: grupoMuscular,
            instrucoes: descricao,
          };
          await AsyncStorage.setItem("edicoesPadrao", JSON.stringify(edicoes));
        }

        Alert.alert("Sucesso!", "Exercício atualizado com sucesso.");
      } else {
        await addDoc(collection(db, "exercicios"), {
          nome,
          grupoMuscular,
          equipamento,
          series,
          repeticoes,
          descanso,
          descricao,
          dataCriacao: new Date(),
        });
        Alert.alert("Sucesso!", "Exercício salvo com sucesso.");
      }

      router.back();
    } catch (erro) {
      console.error("Erro ao salvar:", erro);
      Alert.alert("Erro", "Não foi possível salvar.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
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
            {editando ? "Editar exercício" : "Novo exercício"}
          </Text>
          <Text style={styles.pageSubtitle}>
            {editando
              ? "Altere as informações do exercício"
              : "Cadastre um exercício para o treino"}
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do exercício</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: Desenvolvimento militar"
              placeholderTextColor="#A0A0A0"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Grupo muscular</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: Ombros, Costas..."
              placeholderTextColor="#A0A0A0"
              value={grupoMuscular}
              onChangeText={setGrupoMuscular}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Equipamento</Text>
            <TextInput
              style={styles.input}
              placeholder="Halteres"
              placeholderTextColor="#A0A0A0"
              value={equipamento}
              onChangeText={setEquipamento}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Séries</Text>
            <TextInput
              style={styles.input}
              placeholder="4"
              keyboardType="numeric"
              placeholderTextColor="#A0A0A0"
              value={series}
              onChangeText={setSeries}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Repetições</Text>
            <TextInput
              style={styles.input}
              placeholder="12"
              keyboardType="numeric"
              placeholderTextColor="#A0A0A0"
              value={repeticoes}
              onChangeText={setRepeticoes}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descanso</Text>
            <TextInput
              style={styles.input}
              placeholder="60 segundos"
              placeholderTextColor="#A0A0A0"
              value={descanso}
              onChangeText={setDescanso}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição / instruções</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Execução resumida do movimento"
              placeholderTextColor="#A0A0A0"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={descricao}
              onChangeText={setDescricao}
            />
          </View>

          <TouchableOpacity
            style={styles.btnSalvar}
            activeOpacity={0.8}
            onPress={salvarExercicio}
          >
            <Text style={styles.btnSalvarText}>
              {editando ? "Atualizar" : "Salvar"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

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
