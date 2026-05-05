import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CATEGORIAS = ["Todos", "Peito", "Pernas", "Braços", "Costas", "Cardio"];

const EXERCICIOS = [
  {
    id: "1",
    nome: "Supino Reto",
    musculo: "Peito e Tríceps",
    info: "Barra, Halteres",
    imagem:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "2",
    nome: "Agachamento Livre",
    musculo: "Quadríceps e Glúteos",
    info: "Barra",
    imagem:
      "https://images.unsplash.com/photo-1574673139082-c3b8d6659c2b?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "3",
    nome: "Flexão de Braço",
    musculo: "Peito e Tríceps",
    info: "Sem equipamento",
    imagem:
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "4",
    nome: "Remada Curvada",
    musculo: "Costas e Bíceps",
    info: "Barra",
    imagem:
      "https://images.unsplash.com/photo-1603287611837-f2146f5de308?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "5",
    nome: "Tríceps Testa",
    musculo: "Tríceps",
    info: "Halteres",
    imagem:
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=300&auto=format&fit=crop",
  },
];

export default function BibliotecaScreen() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho Laranja - Ícone de coração removido */}
      <View style={styles.headerLaranja}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>FitMatch</Text>
        </View>

        <TouchableOpacity style={styles.profileIcon}>
          <Ionicons name="person-circle" size={32} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.mainTitle}>Biblioteca de Exercícios</Text>

        {/* Busca */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={20} color="#F28C1B" />
            <TextInput
              placeholder="Pesquisar exercícios..."
              style={styles.input}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Filtros */}
        <View style={styles.filterWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CATEGORIAS.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategoriaAtiva(cat)}
                style={[
                  styles.filterTab,
                  categoriaAtiva === cat && styles.filterTabActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    categoriaAtiva === cat && styles.filterTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.settingsBtn}>
            <Ionicons name="options-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Lista de Exercícios */}
        <FlatList
          data={EXERCICIOS}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardInfo}>
                <Image
                  source={{ uri: item.imagem }}
                  style={styles.exerciseImage}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.exerciseTitle}>{item.nome}</Text>
                  <Text style={styles.exerciseSub}>{item.musculo}</Text>
                  <Text style={styles.exerciseDetail}>Info: {item.info}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#333" />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 150 }}
        />
      </View>

      {/* Botão de Adicionar Exercício Fixo */}
      <TouchableOpacity style={styles.addBtn}>
        <Text style={styles.addBtnText}>+ Adicionar Exercício</Text>
      </TouchableOpacity>

      {/* Barra de Navegação Inferior - Conexão com Início configurada */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/home")}
        >
          <Ionicons name="home-outline" size={24} color="#999" />
          <Text style={styles.navText}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="barbell" size={24} color="#F28C1B" />
          <Text style={[styles.navText, { color: "#F28C1B" }]}>Exercícios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="list-outline" size={24} color="#999" />
          <Text style={styles.navText}>Treinos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#999" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  headerLaranja: {
    backgroundColor: "#F28C1B",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  logoContainer: { flexDirection: "row", alignItems: "center" },
  logoText: { color: "#FFF", fontSize: 22, fontWeight: "bold" },
  profileIcon: { padding: 5 },
  content: { flex: 1, paddingHorizontal: 20 },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 20,
    marginBottom: 5,
  },
  searchContainer: { marginVertical: 15 },
  searchBox: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F28C1B",
  },
  input: { marginLeft: 10, flex: 1, fontSize: 16 },
  filterWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  filterTab: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    backgroundColor: "#EEE",
    marginRight: 8,
  },
  filterTabActive: { backgroundColor: "#F28C1B" },
  filterText: { color: "#666", fontWeight: "600" },
  filterTextActive: { color: "#FFF" },
  settingsBtn: { marginLeft: 5 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EEE",
    elevation: 2,
  },
  cardInfo: { flexDirection: "row", alignItems: "center" },
  exerciseImage: { width: 75, height: 75, borderRadius: 12, marginRight: 15 },
  textContainer: { flexShrink: 1 },
  exerciseTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  exerciseSub: { fontSize: 13, color: "#666" },
  exerciseDetail: { fontSize: 12, color: "#999" },
  addBtn: {
    position: "absolute",
    bottom: 90,
    left: 20,
    right: 20,
    backgroundColor: "#F28C1B",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    elevation: 4,
    zIndex: 10,
  },
  addBtnText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    paddingVertical: 10,
    backgroundColor: "#FFF",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: { alignItems: "center" },
  navText: { fontSize: 11, color: "#999", marginTop: 2 },
});
