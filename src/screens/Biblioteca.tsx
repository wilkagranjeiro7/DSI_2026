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
    imagem:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "2",
    nome: "Flexão de Braço",
    musculo: "Peito e Ombros",
    imagem:
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "3",
    nome: "Remada Curvada",
    musculo: "Costas e Bíceps",
    imagem:
      "https://images.unsplash.com/photo-1603287611837-f2146f5de308?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "4",
    nome: "Agachamento Livre",
    musculo: "Pernas",
    imagem:
      "https://images.unsplash.com/photo-1574673139082-c3b8d6659c2b?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "5",
    nome: "Desenvolvimento",
    musculo: "Ombros e Tríceps",
    imagem:
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "6",
    nome: "Leg Press 45°",
    musculo: "Quadríceps e Glúteos",
    imagem:
      "https://images.unsplash.com/photo-1534367958040-27e0bd3d2a97?q=80&w=300&auto=format&fit=crop",
  },
];

export default function BibliotecaScreen() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <View style={{ marginLeft: 15 }}>
            <Text style={styles.subtitle}>Sua biblioteca de</Text>
            <Text style={styles.title}>Exercícios</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.profileBadge}>
          <Ionicons name="person" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Busca */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#F28C1B" />
        <TextInput
          placeholder="O que vamos treinar hoje?"
          style={styles.input}
          placeholderTextColor="#999"
        />
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
      </View>

      {/* Lista Principal */}
      <FlatList
        data={EXERCICIOS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardInfo}>
              <Image
                source={{ uri: item.imagem }}
                style={styles.exerciseImage}
              />
              <View>
                <Text style={styles.exerciseTitle}>{item.nome}</Text>
                <Text style={styles.exerciseSub}>{item.musculo}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="chevron-forward" size={20} color="#F28C1B" />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 25,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 8,
    backgroundColor: "#FFF",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  subtitle: { fontSize: 14, color: "#8E8EA0" },
  title: { fontSize: 28, fontWeight: "bold", color: "#111827" },
  profileBadge: { backgroundColor: "#F28C1B", padding: 10, borderRadius: 12 },
  searchBox: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
  },
  input: { marginLeft: 12, flex: 1, fontSize: 16 },
  filterWrapper: { marginBottom: 20, height: 45 },
  filterTab: {
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#FFF",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#EEE",
    justifyContent: "center",
  },
  filterTabActive: { backgroundColor: "#F28C1B", borderColor: "#F28C1B" },
  filterText: { color: "#666", fontWeight: "600" },
  filterTextActive: { color: "#FFF" },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    elevation: 4,
  },
  cardInfo: { flexDirection: "row", alignItems: "center" },
  exerciseImage: { width: 70, height: 70, borderRadius: 15, marginRight: 15 },
  exerciseTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  exerciseSub: { fontSize: 14, color: "#8E8EA0" },
  actionBtn: { backgroundColor: "#FDF2E9", padding: 10, borderRadius: 12 },
});
