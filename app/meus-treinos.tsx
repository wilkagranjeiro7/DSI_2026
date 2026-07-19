import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import React, { Component } from "react";
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
import BottomNavbar from "../src/components/BottomNavbar";
import { db } from "../src/utils/firebaseConfig";

class Treino {
  constructor(
    readonly id: string,
    readonly nome: string,
    readonly descricao: string,
    readonly info: string,
    readonly tipo: string,
    readonly diasSemana = "",
    readonly duracao = "",
    readonly observacoes = "",
  ) {}

  static fromFirestore(id: string, data: any) {
    return new Treino(
      id,
      data.nome || "Sem nome",
      data.objetivo || "Sem descricao",
      `${data.duracao || "Tempo N/A"} - ${data.dias || "Dias N/A"}`,
      data.tipo || "Forca",
      data.dias || "",
      data.duracao || "",
      data.observacoes || "",
    );
  }

  isFirebase() {
    return this.id.length > 10;
  }
}

class TreinoCatalogo {
  static readonly padrao: Treino[] = [
    new Treino(
      "0",
      "Treino de Alongamento",
      "Parte Superior e Inferior",
      "10 min - Aquecimento",
      "Alongamento",
    ),
    new Treino(
      "1",
      "Treino Superior",
      "Peito, ombro e triceps",
      "45 min - Seg/Qua",
      "Forca",
    ),
    new Treino(
      "2",
      "Treino Inferior",
      "Pernas e gluteos",
      "55 min - Ter/Qui",
      "Forca",
    ),
    new Treino(
      "3",
      "Cardio HIIT",
      "Condicionamento e resistencia",
      "30 min - Sex",
      "Cardio",
    ),
  ];

  static readonly filtros = [
    "Todos",
    "Meus Salvos",
    "Forca",
    "Cardio",
    "Alongamento",
  ];
}

class TreinoFilter {
  constructor(
    private readonly filtro: string,
    private readonly busca: string,
    private readonly locaisExcluidos: string[],
  ) {}

  apply(treinos: Treino[]) {
    return treinos.filter((item) => {
      if (this.locaisExcluidos.includes(item.id)) {
        return false;
      }

      const matchBusca = item.nome
        .toLowerCase()
        .includes(this.busca.toLowerCase());
      let matchFiltro = true;

      if (this.filtro === "Meus Salvos") {
        matchFiltro = item.isFirebase();
      } else if (this.filtro !== "Todos") {
        matchFiltro = item.tipo === this.filtro;
      }

      return matchBusca && matchFiltro;
    });
  }
}

class AlertPresenter {
  static info(title: string, message: string) {
    if (Platform.OS === "web") {
      window.alert(message);
      return;
    }

    Alert.alert(title, message);
  }

  static confirmDelete(nome: string, onConfirm: () => void) {
    if (Platform.OS === "web") {
      if (window.confirm(`Tem certeza que deseja excluir o "${nome}"?`)) {
        onConfirm();
      }
      return;
    }

    Alert.alert("Excluir Treino", `Tem certeza que deseja excluir o "${nome}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: onConfirm,
      },
    ]);
  }
}

interface MeusTreinosState {
  treinosList: Treino[];
  busca: string;
  filtro: string;
  locaisExcluidos: string[];
}

export default class MeusTreinosScreen extends Component<object, MeusTreinosState> {
  private unsubscribeTreinos?: Unsubscribe;

  state: MeusTreinosState = {
    treinosList: TreinoCatalogo.padrao,
    busca: "",
    filtro: "Todos",
    locaisExcluidos: [],
  };

  componentDidMount() {
    this.unsubscribeTreinos = onSnapshot(collection(db, "treinos"), (snapshot) => {
      const treinosFirebase = snapshot.docs.map((documento) =>
        Treino.fromFirestore(documento.id, documento.data()),
      );

      this.setState({
        treinosList: [...TreinoCatalogo.padrao, ...treinosFirebase],
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribeTreinos?.();
  }

  private get treinosFiltrados() {
    return new TreinoFilter(
      this.state.filtro,
      this.state.busca,
      this.state.locaisExcluidos,
    ).apply(this.state.treinosList);
  }

  private executarExclusao = async (id: string) => {
    if (id.length > 5) {
      try {
        await deleteDoc(doc(db, "treinos", id));
        AlertPresenter.info("Pronto!", "Treino apagado com sucesso.");
      } catch (erro: any) {
        console.error("ERRO FIREBASE: ", erro);
        AlertPresenter.info("Erro", "O Firebase nao deixou apagar.");
      }
      return;
    }

    this.setState((estadoAtual) => ({
      locaisExcluidos: [...estadoAtual.locaisExcluidos, id],
    }));
    AlertPresenter.info("Pronto!", "Treino apagado com sucesso.");
  };

  private handleExcluir = (id: string, nome: string) => {
    AlertPresenter.confirmDelete(nome, () => this.executarExclusao(id));
  };

  private handleEditar = (item: Treino) => {
    router.push({
      pathname: "/criar-treino",
      params: {
        id: item.id,
        nome: item.nome,
        objetivo: item.descricao,
        tipo: item.tipo,
        dias: item.diasSemana,
        duracao: item.duracao,
        observacoes: item.observacoes,
        editando: "true",
      },
    });
  };

  private renderHeader = () => (
    <>
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.title}>Meus treinos</Text>
          <Text style={styles.subtitle}>Gerencie seus planos de treino</Text>
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
          value={this.state.busca}
          onChangeText={(valor) => this.setState({ busca: valor })}
        />
      </View>

      <View style={styles.filters}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10 }}
        >
          {TreinoCatalogo.filtros.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.filterChip,
                this.state.filtro === item && styles.filterChipActive,
              ]}
              onPress={() => this.setState({ filtro: item })}
            >
              <Text
                style={[
                  styles.filterText,
                  this.state.filtro === item && styles.filterTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );

  private renderTreino = ({ item }: { item: Treino }) => (
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
          onPress={() => this.handleEditar(item)}
        >
          <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => this.handleExcluir(item.id, item.nome)}
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
          <Text style={styles.exerciseText}>Exercicios</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  render() {
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
            data={this.treinosFiltrados}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListHeaderComponent={this.renderHeader}
            renderItem={this.renderTreino}
          />
        </View>

        <BottomNavbar active="treinos" />
      </SafeAreaView>
    );
  }
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
});
