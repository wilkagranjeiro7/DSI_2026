import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { Component } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BottomNavbar from "../src/components/BottomNavbar";

class TreinoBiblioteca {
  constructor(
    readonly id: string,
    readonly nome: string,
    readonly divisao: string,
    readonly duracao: string,
    readonly dias: string,
    readonly categoria: string,
  ) {}
}

class BibliotecaTreinoRepository {
  private readonly categorias = [
    "Todos",
    "Hoje",
    "Superior",
    "Inferior",
    "Cardio",
    "Abdomen",
    "Alongamento",
  ];

  private readonly treinos = [
    new TreinoBiblioteca(
      "1",
      "Treino Superior",
      "Peito, ombro, costas e biceps",
      "45 min",
      "Seg/Qua",
      "Superior",
    ),
    new TreinoBiblioteca(
      "2",
      "Treino Inferior",
      "Pernas, gluteos e panturrilha",
      "55 min",
      "Ter/Qui",
      "Inferior",
    ),
    new TreinoBiblioteca(
      "3",
      "Cardio HIIT",
      "Condicionamento e resistencia",
      "30 min",
      "Sex",
      "Cardio",
    ),
    new TreinoBiblioteca(
      "4",
      "Foco no Core",
      "Fortalecimento de abdomen",
      "15 min",
      "Seg/Qua/Sex",
      "Abdomen",
    ),
    new TreinoBiblioteca(
      "5",
      "Mobilidade Geral",
      "Alongamento e flexibilidade",
      "20 min",
      "Sab/Dom",
      "Alongamento",
    ),
  ];

  listarCategorias() {
    return this.categorias;
  }

  filtrar(categoriaAtiva: string, busca: string) {
    return this.treinos.filter((treino) => {
      const correspondeCategoria =
        categoriaAtiva === "Todos" || treino.categoria === categoriaAtiva;
      const correspondeBusca = treino.nome
        .toLowerCase()
        .includes(busca.toLowerCase());

      return correspondeCategoria && correspondeBusca;
    });
  }
}

interface BibliotecaState {
  categoriaAtiva: string;
  busca: string;
}

export default class BibliotecaRoute extends Component<object, BibliotecaState> {
  private readonly repository = new BibliotecaTreinoRepository();

  state: BibliotecaState = {
    categoriaAtiva: "Todos",
    busca: "",
  };

  private abrirTreino = (item: TreinoBiblioteca) => {
    router.push({
      pathname: "/meus-exercicios",
      params: {
        treinoSelecionado: item.nome,
        categoriaTreino: item.categoria,
      },
    });
  };

  private renderCategoria = (cat: string) => {
    const { categoriaAtiva } = this.state;

    return (
      <TouchableOpacity
        key={cat}
        onPress={() => this.setState({ categoriaAtiva: cat })}
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
    );
  };

  private renderTreino = ({ item }: { item: TreinoBiblioteca }) => (
    <TouchableOpacity
      style={styles.cardFigma}
      activeOpacity={0.7}
      onPress={() => this.abrirTreino(item)}
    >
      <View style={styles.cardInfoContainer}>
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons name="dumbbell" size={24} color="#F28C1B" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.workoutTitle}>{item.nome}</Text>
          <Text style={styles.workoutSub}>{item.divisao}</Text>
          <Text style={styles.workoutSpecs}>
            {item.duracao} - {item.dias}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color="#C0C0C0"
          style={{ alignSelf: "center" }}
        />
      </View>

      <View style={styles.actionButtonsRow}>
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={styles.btnOutlineText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={styles.btnOutlineText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  render() {
    const { categoriaAtiva, busca } = this.state;
    const treinosFiltrados = this.repository.filtrar(categoriaAtiva, busca);

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerLaranja}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.logoText}>FitMatch</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <View>
              <Text style={styles.mainTitle}>Meus treinos</Text>
              <Text style={styles.subTitleHeader}>
                Gerencie seus planos de treino
              </Text>
            </View>

            <TouchableOpacity
              style={styles.btnNovoTreino}
              onPress={() => router.push("/criar-treino")}
            >
              <Text style={styles.btnNovoTreinoText}>+ Novo treino</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={20} color="#A0A0A0" />
            <TextInput
              placeholder="Buscar treino"
              placeholderTextColor="#A0A0A0"
              style={styles.input}
              value={busca}
              onChangeText={(valor) => this.setState({ busca: valor })}
            />
          </View>

          <View style={styles.filterWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {this.repository.listarCategorias().map(this.renderCategoria)}
            </ScrollView>
          </View>

          <FlatList
            data={treinosFiltrados}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={this.renderTreino}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
        <BottomNavbar active="treinos" />
      </SafeAreaView>
    );
  }
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
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 15,
  },
  mainTitle: { fontSize: 24, fontWeight: "bold", color: "#111" },
  subTitleHeader: { fontSize: 13, color: "#707070", marginTop: 2 },
  btnNovoTreino: {
    backgroundColor: "#F28C1B",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  btnNovoTreinoText: { color: "#FFF", fontWeight: "bold", fontSize: 13 },
  searchBox: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 15,
    height: 46,
    alignItems: "center",
    marginBottom: 15,
  },
  input: { marginLeft: 10, flex: 1, fontSize: 15, color: "#333" },
  filterWrapper: { marginBottom: 15 },
  filterTab: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginRight: 8,
  },
  filterTabActive: { backgroundColor: "#FFEFE3", borderColor: "#F28C1B" },
  filterText: { color: "#707070", fontWeight: "600", fontSize: 14 },
  filterTextActive: { color: "#F28C1B" },
  cardFigma: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ECECEC",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  cardInfoContainer: { flexDirection: "row", marginBottom: 16 },
  iconWrapper: {
    backgroundColor: "#FFEFE3",
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  textContainer: { flex: 1, justifyContent: "center" },
  workoutTitle: { fontSize: 18, fontWeight: "bold", color: "#1A1A1A" },
  workoutSub: { fontSize: 14, color: "#707070", marginVertical: 2 },
  workoutSpecs: { fontSize: 12, color: "#A0A0A0" },
  actionButtonsRow: { flexDirection: "row", justifyContent: "flex-start" },
  btnOutline: {
    width: 90,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    paddingVertical: 6,
    alignItems: "center",
    marginRight: 8,
  },
  btnOutlineText: { color: "#707070", fontWeight: "600", fontSize: 14 },
});
