import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface Treino {
  id: string;
  nome: string;
  descricao: string;
  info: string;
  tipo: string;
}

const TREINOS: Treino[] = [
  {
    id: "0",
    nome: "Treino de Alongamento",
    descricao: "Parte Superior e Inferior",
    info: "10 min • Aquecimento",
    tipo: "Alongamento",
  },
  {
    id: "1",
    nome: "Treino Superior",
    descricao: "Peito, ombro e tríceps",
    info: "45 min • Seg/Qua",
    tipo: "Força",
  },
  {
    id: "2",
    nome: "Treino Inferior",
    descricao: "Pernas e glúteos",
    info: "55 min • Ter/Qui",
    tipo: "Força",
  },
  {
    id: "3",
    nome: "Cardio HIIT",
    descricao: "Condicionamento e resistência",
    info: "30 min • Sex",
    tipo: "Cardio",
  },
];

const FILTROS: string[] = ["Todos", "Hoje", "Força", "Cardio", "Alongamento"];

export default function MeusTreinosScreen() {
  const router = useRouter();

  const [busca, setBusca] = useState<string>("");
  const [filtro, setFiltro] = useState<string>("Todos");

  const treinosFiltrados = TREINOS.filter((item) => {
    const matchBusca = item.nome.toLowerCase().includes(busca.toLowerCase());
    const matchFiltro = filtro === "Todos" || item.tipo === filtro;
    return matchBusca && matchFiltro;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FitMatch</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>Meus treinos</Text>
            <Text style={styles.subtitle}>Gerencie seus planos de treino</Text>
          </View>
          <TouchableOpacity
            style={styles.newButton}
            onPress={() => router.push("/novo-treino")}
          >
            <Text style={styles.newButtonText}>+ Novo treino</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Busca</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#9E9E9E" />
          <TextInput
            placeholder="Buscar treino"
            style={styles.searchInput}
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        <View style={styles.filters}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={true}
            data={FILTROS}
            keyExtractor={(item) => item}
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  filtro === item && styles.filterChipActive,
                ]}
                onPress={() => setFiltro(item)}
              >
                <Text
                  style={[
                    styles.filterText,
                    filtro === item && styles.filterTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <FlatList
          data={treinosFiltrados}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={true}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/meus-exercicios",
                  params: { treinoSelecionado: item.nome },
                })
              }
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons
                    name={item.tipo === "Alongamento" ? "yoga" : "dumbbell"}
                    size={26}
                    color="#F28C1B"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.nome}</Text>
                  <Text style={styles.cardDesc}>{item.descricao}</Text>
                  <Text style={styles.cardInfo}>{item.info}</Text>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity style={styles.editBtn}>
                  <Text style={styles.editText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn}>
                  <Text style={styles.deleteText}>Excluir</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.exerciseBtn}
                  onPress={() =>
                    router.push({
                      pathname: "/meus-exercicios",
                      params: { treinoSelecionado: item.nome },
                    })
                  }
                >
                  <Text style={styles.exerciseText}>Exercícios</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/")}
        >
          <Ionicons name="home-outline" size={24} color="#A0A0A0" />
          <Text style={styles.tabText}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <MaterialCommunityIcons name="dumbbell" size={24} color="#F28C1B" />
          <Text style={[styles.tabText, { color: "#F28C1B" }]}>Treinos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/perfil")}
        >
          <Ionicons name="person-outline" size={24} color="#A0A0A0" />
          <Text style={styles.tabText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    backgroundColor: "#F28C1B",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  content: { flex: 1, padding: 20 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 24, fontWeight: "bold" },
  subtitle: { fontSize: 14, color: "#707070" },
  newButton: {
    backgroundColor: "#F28C1B",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  newButtonText: { color: "#FFF", fontWeight: "bold" },
  label: { marginTop: 20, marginBottom: 6, color: "#606060" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchInput: { flex: 1, padding: 10 },
  filters: { marginVertical: 20 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F28C1B",
  },
  filterChipActive: { backgroundColor: "#F28C1B" },
  filterText: { color: "#F28C1B", fontWeight: "600" },
  filterTextActive: { color: "#FFF" },
  card: {
    borderWidth: 1,
    borderColor: "#EFEFEF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: { flexDirection: "row", gap: 12 },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FFF3E0",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: { fontWeight: "bold", fontSize: 16 },
  cardDesc: { fontSize: 13, color: "#707070" },
  cardInfo: { fontSize: 12, color: "#9E9E9E", marginTop: 2 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  editBtn: {
    borderWidth: 1,
    borderColor: "#F28C1B",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  editText: { color: "#F28C1B", fontWeight: "600" },
  deleteBtn: {
    borderWidth: 1,
    borderColor: "#FF5A5A",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  deleteText: { color: "#FF5A5A", fontWeight: "600" },
  exerciseBtn: {
    backgroundColor: "#F28C1B",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  exerciseText: { color: "#FFF", fontWeight: "600" },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFF",
    paddingBottom: 25,
  },
  tabItem: { alignItems: "center", justifyContent: "center" },
  tabText: { fontSize: 12, color: "#A0A0A0", marginTop: 4, fontWeight: "500" },
});
