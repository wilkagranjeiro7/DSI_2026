import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router"; // Alterado para a versão de classe (imperativa)
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

// Mantendo os filtros organizados por categorias gerais de treino
const CATEGORIAS = [
  "Todos",
  "Hoje",
  "Superior",
  "Inferior",
  "Cardio",
  "Abdômen",
  "Alongamento",
];

// Apenas os CARDS DOS TREINOS (Sem misturar exercícios aqui dentro!)
const TREINOS = [
  {
    id: "1",
    nome: "Treino Superior",
    divisao: "Peito, ombro, costas e bíceps",
    duracao: "45 min",
    dias: "Seg/Qua",
    categoria: "Superior",
  },
  {
    id: "2",
    nome: "Treino Inferior",
    divisao: "Pernas, glúteos e panturrilha",
    duracao: "55 min",
    dias: "Ter/Qui",
    categoria: "Inferior",
  },
  {
    id: "3",
    nome: "Cardio HIIT",
    divisao: "Condicionamento e resistência",
    duracao: "30 min",
    dias: "Sex",
    categoria: "Cardio",
  },
  {
    id: "4",
    nome: "Foco no Core",
    divisao: "Fortalecimento de abdômen",
    duracao: "15 min",
    dias: "Seg/Qua/Sex",
    categoria: "Abdômen",
  },
  {
    id: "5",
    nome: "Mobilidade Geral",
    divisao: "Alongamento e flexibilidade",
    duracao: "20 min",
    dias: "Sáb/Dom",
    categoria: "Alongamento",
  },
];

// Interfaces para o TypeScript na Classe
interface Props {}

interface State {
  categoriaAtiva: string;
  busca: string;
}

export default class BibliotecaRoute extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // Inicialização do estado na POO
    this.state = {
      categoriaAtiva: "Todos",
      busca: "",
    };
  }

  // Métodos para atualizar o estado
  setCategoriaAtiva = (categoria: string): void => {
    this.setState({ categoriaAtiva: categoria });
  };

  setBusca = (texto: string): void => {
    this.setState({ busca: texto });
  };

  // Substitui o useMemo, calculando os treinos filtrados
  get treinosFiltrados() {
    const { categoriaAtiva, busca } = this.state;
    return TREINOS.filter((treino) => {
      const correspondeCategoria =
        categoriaAtiva === "Todos" || treino.categoria === categoriaAtiva;
      const correspondeBusca = treino.nome
        .toLowerCase()
        .includes(busca.toLowerCase());
      return correspondeCategoria && correspondeBusca;
    });
  }

  render() {
    const { categoriaAtiva, busca } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {/* Header Superior */}
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
          {/* Cabeçalho da Lista */}
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

          {/* Caixa de Busca */}
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={20} color="#A0A0A0" />
            <TextInput
              placeholder="Buscar treino"
              placeholderTextColor="#A0A0A0"
              style={styles.input}
              value={busca}
              onChangeText={this.setBusca}
            />
          </View>

          {/* Filtros em Pílula */}
          <View style={styles.filterWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {CATEGORIAS.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => this.setCategoriaAtiva(cat)}
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

          {/* Lista de Cards */}
          <FlatList
            data={this.treinosFiltrados}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.cardFigma}
                activeOpacity={0.7}
                onPress={() => {
                  // Passa a categoria do treino para a tela de exercícios filtrar automaticamente
                  router.push({
                    pathname: "/meus-exercicios",
                    params: {
                      treinoSelecionado: item.nome,
                      categoriaTreino: item.categoria,
                    },
                  });
                }}
              >
                <View style={styles.cardInfoContainer}>
                  <View style={styles.iconWrapper}>
                    <MaterialCommunityIcons
                      name="dumbbell"
                      size={24}
                      color="#F28C1B"
                    />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.workoutTitle}>{item.nome}</Text>
                    <Text style={styles.workoutSub}>{item.divisao}</Text>
                    <Text style={styles.workoutSpecs}>
                      {item.duracao} • {item.dias}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#C0C0C0"
                    style={{ alignSelf: "center" }}
                  />
                </View>

<<<<<<< HEAD
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
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      </SafeAreaView>
    );
  }
=======
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
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
      <BottomNavbar active="treinos" />
    </SafeAreaView>
  );
>>>>>>> 5c2f1d7c368c68b33a5a7df6588c91c81e1f6db9
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
