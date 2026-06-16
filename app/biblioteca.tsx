import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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

class BibliotecaStateFactory {
  static create() {
    return {
      categoriaAtiva: "Todos",
      busca: "",
      exibirCadastro: false,
      nomeTreino: "",
      objetivo: "",
      tipoTreino: "",
      diasSemana: "",
      duracao: "",
      observacoes: "",
    };
  }
}

class BibliotecaRepository {
  private readonly categorias = ["Todos", "Hoje", "Forca", "Cardio"];

  private readonly treinos = [
    new TreinoBiblioteca(
      "1",
      "Treino Superior",
      "Peito, ombro e triceps",
      "45 min",
      "Seg/Qua",
      "Forca",
    ),
    new TreinoBiblioteca(
      "2",
      "Treino Inferior",
      "Pernas e gluteos",
      "55 min",
      "Ter/Qui",
      "Forca",
    ),
    new TreinoBiblioteca(
      "3",
      "Cardio HIIT",
      "Condicionamento e resistencia",
      "30 min",
      "Sex",
      "Cardio",
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

type BibliotecaState = ReturnType<typeof BibliotecaStateFactory.create>;

export default class MeusTreinosScreen extends Component<object, BibliotecaState> {
  private readonly repository = new BibliotecaRepository();

  state = BibliotecaStateFactory.create();

  private voltar = () => {
    if (this.state.exibirCadastro) {
      this.setState({ exibirCadastro: false });
    }
  };

  private salvarTreino = () => {
    console.log({
      nomeTreino: this.state.nomeTreino,
      objetivo: this.state.objetivo,
      tipoTreino: this.state.tipoTreino,
      diasSemana: this.state.diasSemana,
      duracao: this.state.duracao,
      observacoes: this.state.observacoes,
    });
    this.setState({ exibirCadastro: false });
  };

  private renderCategoria = (cat: string) => (
    <TouchableOpacity
      key={cat}
      onPress={() => this.setState({ categoriaAtiva: cat })}
      style={[
        styles.filterTab,
        this.state.categoriaAtiva === cat && styles.filterTabActive,
      ]}
    >
      <Text
        style={[
          styles.filterText,
          this.state.categoriaAtiva === cat && styles.filterTextActive,
        ]}
      >
        {cat}
      </Text>
    </TouchableOpacity>
  );

  private renderTreino = ({ item }: { item: TreinoBiblioteca }) => (
    <View style={styles.cardFigma}>
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
      </View>

      <View style={styles.actionButtonsRow}>
        <TouchableOpacity style={styles.btnOutline}>
          <Text style={styles.btnOutlineText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnOutline}>
          <Text style={styles.btnOutlineText}>Excluir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnLaranjaCard}>
          <Text style={styles.btnLaranjaCardText}>Exercicios</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  private renderCadastro() {
    return (
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text style={styles.mainTitle}>Novo treino</Text>
        <Text style={styles.subTitleHeader}>Cadastre um treino personalizado</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome do treino</Text>
          <TextInput
            placeholder="Ex.: Treino de forca A"
            placeholderTextColor="#A0A0A0"
            style={styles.inputForm}
            value={this.state.nomeTreino}
            onChangeText={(valor) => this.setState({ nomeTreino: valor })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Objetivo</Text>
          <TextInput
            placeholder="Hipertrofia"
            placeholderTextColor="#A0A0A0"
            style={styles.inputForm}
            value={this.state.objetivo}
            onChangeText={(valor) => this.setState({ objetivo: valor })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tipo de treino</Text>
          <TextInput
            placeholder="Forca"
            placeholderTextColor="#A0A0A0"
            style={styles.inputForm}
            value={this.state.tipoTreino}
            onChangeText={(valor) => this.setState({ tipoTreino: valor })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Dias da semana</Text>
          <TextInput
            placeholder="Seg, Qua e Sex"
            placeholderTextColor="#A0A0A0"
            style={styles.inputForm}
            value={this.state.diasSemana}
            onChangeText={(valor) => this.setState({ diasSemana: valor })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Duracao estimada</Text>
          <TextInput
            placeholder="45 minutos"
            placeholderTextColor="#A0A0A0"
            style={styles.inputForm}
            value={this.state.duracao}
            onChangeText={(valor) => this.setState({ duracao: valor })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Observacoes</Text>
          <TextInput
            placeholder="Anotacoes para execucao"
            placeholderTextColor="#A0A0A0"
            style={[styles.inputForm, styles.inputMultiline]}
            multiline={true}
            numberOfLines={4}
            value={this.state.observacoes}
            onChangeText={(valor) => this.setState({ observacoes: valor })}
          />
        </View>

        <TouchableOpacity style={styles.btnSalvar} onPress={this.salvarTreino}>
          <Text style={styles.btnSalvarText}>Salvar treino</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  private renderLista() {
    const treinosFiltrados = this.repository.filtrar(
      this.state.categoriaAtiva,
      this.state.busca,
    );

    return (
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
            onPress={() => this.setState({ exibirCadastro: true })}
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
            value={this.state.busca}
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
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerLaranja}>
          <TouchableOpacity onPress={this.voltar}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.logoText}>FitMatch</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>

        {this.state.exibirCadastro ? this.renderCadastro() : this.renderLista()}
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
  mainTitle: { fontSize: 24, fontWeight: "bold", color: "#111", marginTop: 10 },
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
  actionButtonsRow: { flexDirection: "row", justifyContent: "space-between" },
  btnOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: "center",
    marginRight: 8,
  },
  btnOutlineText: { color: "#707070", fontWeight: "600", fontSize: 14 },
  btnLaranjaCard: {
    flex: 1.2,
    backgroundColor: "#F28C1B",
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: "center",
  },
  btnLaranjaCardText: { color: "#FFF", fontWeight: "600", fontSize: 14 },
  inputContainer: { marginBottom: 16, marginTop: 10 },
  label: { fontSize: 14, fontWeight: "600", color: "#404040", marginBottom: 6 },
  inputForm: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 15,
    height: 48,
    fontSize: 15,
    color: "#333",
  },
  inputMultiline: { height: 90, textAlignVertical: "top", paddingTop: 12 },
  btnSalvar: {
    backgroundColor: "#F28C1B",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  btnSalvarText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});
