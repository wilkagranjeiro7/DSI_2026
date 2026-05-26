import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
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
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../src/utils/firebaseConfig"; // Mesma rota de antes!

interface Treino {
  id: string;
  nome: string;
  descricao: string;
  info: string;
  tipo: string;
  diasSemana?: string; // Para enviar pro editar depois
  duracao?: string; // Para enviar pro editar depois
}

// Lista padrão inicial
const TREINOS_PADRAO: Treino[] = [
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

// ADICIONADO: Filtro "Meus Salvos"
const FILTROS: string[] = [
  "Todos",
  "Meus Salvos",
  "Força",
  "Cardio",
  "Alongamento",
];

export default function MeusTreinosScreen() {
  const router = useRouter();

  const [treinosList, setTreinosList] = useState<Treino[]>(TREINOS_PADRAO);
  const [busca, setBusca] = useState<string>("");
  const [filtro, setFiltro] = useState<string>("Todos");

  // Caixinha para os treinos padrões que foram deletados
  const [locaisExcluidos, setLocaisExcluidos] = useState<string[]>([]);

  // Escutando a coleção de "treinos" no Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "treinos"), (snapshot) => {
      const treinosFirebase = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          nome: data.nome || "Sem nome",
          descricao: data.objetivo || "Sem descrição",
          info: `${data.duracao || "Tempo N/A"} • ${data.dias || "Dias N/A"}`,
          tipo: data.tipo || "Força", // Ex: Força, Cardio, etc.
          diasSemana: data.dias || "",
          duracao: data.duracao || "",
          ...data, // Guarda tudo para passar para o modo Editar
        } as Treino;
      });

      setTreinosList([...TREINOS_PADRAO, ...treinosFirebase]);
    });

    return () => unsubscribe();
  }, []);

  // Lógica dos filtros atualizada
  const treinosFiltrados = treinosList.filter((item) => {
    // 1. Esconde os que você excluiu localmente
    if (locaisExcluidos.includes(item.id)) return false;

    // 2. Filtro da busca digitada
    const matchBusca = item.nome.toLowerCase().includes(busca.toLowerCase());

    // 3. Filtro dos botões (Chips)
    let matchFiltro = true;
    if (filtro === "Meus Salvos") {
      matchFiltro = item.id.length > 10; // Só mostra os do Firebase
    } else if (filtro !== "Todos") {
      matchFiltro = item.tipo === filtro;
    }

    return matchBusca && matchFiltro;
  });

  const executarExclusao = async (id: string) => {
    if (id.length > 5) {
      // ID do Firebase
      try {
        await deleteDoc(doc(db, "treinos", id));
        if (Platform.OS === "web") {
          window.alert("Treino apagado com sucesso.");
        } else {
          Alert.alert("Pronto!", "Treino apagado com sucesso.");
        }
      } catch (erro: any) {
        console.error("ERRO FIREBASE: ", erro);
        if (Platform.OS === "web") {
          window.alert("Erro de Permissão: O Firebase não deixou apagar.");
        } else {
          Alert.alert("Erro", "O Firebase não deixou apagar.");
        }
      }
    } else {
      // ID da lista padrão
      setLocaisExcluidos((prev) => [...prev, id]);
      if (Platform.OS === "web") {
        window.alert("Treino apagado com sucesso.");
      } else {
        Alert.alert("Pronto!", "Treino apagado com sucesso.");
      }
    }
  };

  const handleExcluir = (id: string, nome: string) => {
    if (Platform.OS === "web") {
      const confirmou = window.confirm(
        `Tem certeza que deseja excluir o "${nome}"?`,
      );
      if (confirmou) {
        executarExclusao(id);
      }
    } else {
      Alert.alert(
        "Excluir Treino",
        `Tem certeza que deseja excluir o "${nome}"?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Excluir",
            style: "destructive",
            onPress: () => executarExclusao(id),
          },
        ],
      );
    }
  };

  const handleEditar = (item: Treino) => {
    // Manda os dados para a tela "criar-treino.tsx" que atualizamos antes
    router.push({
      pathname: "/criar-treino",
      params: {
        id: item.id,
        nome: item.nome,
        objetivo: item.descricao,
        tipo: item.tipo,
        dias: item.diasSemana || "",
        duracao: item.duracao || "",
        // Aqui você pode adicionar as observações se elas existirem no item
        editando: "true",
      },
    });
  };

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
        <FlatList
          data={treinosFiltrados}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponent={
            <>
              <View style={styles.titleRow}>
                <View>
                  <Text style={styles.title}>Meus treinos</Text>
                  <Text style={styles.subtitle}>
                    Gerencie seus planos de treino
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.newButton}
                  onPress={() => router.push("/criar-treino")}
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
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 10 }}
                >
                  {FILTROS.map((item) => (
                    <TouchableOpacity
                      key={item}
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
                  ))}
                </ScrollView>
              </View>
            </>
          }
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
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => handleEditar(item)}
                >
                  <Text style={styles.editText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleExcluir(item.id, item.nome)}
                >
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

        <TouchableOpacity style={styles.tabItem}>
          <Feather name="target" size={24} color="#A0A0A0" />
          <Text style={styles.tabText}>Metas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="map-outline" size={24} color="#A0A0A0" />
          <Text style={styles.tabText}>Mapa</Text>
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
  content: { flex: 1, padding: 20, paddingBottom: 0 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
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
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#FAFAFA",
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  iconBox: {
    backgroundColor: "#FFF3E0",
    padding: 10,
    borderRadius: 10,
    marginRight: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  cardDesc: { fontSize: 14, color: "#666", marginTop: 2 },
  cardInfo: { fontSize: 12, color: "#999", marginTop: 4 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 12,
    marginTop: 8,
  },
  editBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#E3F2FD",
  },
  editText: { color: "#1E88E5", fontWeight: "600" },
  deleteBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#FFEBEE",
  },
  deleteText: { color: "#E53935", fontWeight: "600" },
  exerciseBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#FFF3E0",
  },
  exerciseText: { color: "#F28C1B", fontWeight: "600" },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FFF",
  },
  tabItem: { alignItems: "center" },
  tabText: { fontSize: 12, color: "#A0A0A0", marginTop: 4 },
});
