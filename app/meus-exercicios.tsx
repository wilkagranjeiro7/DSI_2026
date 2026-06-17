import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LocalSearchParamsAdapter, {
  LocalSearchParamReader,
  LocalSearchParamsProps,
} from "../src/navigation/LocalSearchParamsAdapter";
import { db } from "../src/utils/firebaseConfig";

class Exercicio {
  constructor(
    readonly id: string,
    readonly nome: string,
    readonly grupo: string,
    readonly seriesRep: string,
    readonly categoria: string,
    readonly instrucoes: string,
  ) {}

  static fromFirestore(id: string, data: any) {
    const categoria = ExercicioCategoryResolver.fromGrupo(data.grupoMuscular);

    return new Exercicio(
      id,
      data.nome || "Sem nome",
      data.grupoMuscular || "Geral",
      `${data.series} series - ${data.repeticoes}`,
      categoria,
      data.descricao || "",
    );
  }

  withEdit(edicao: Partial<Exercicio>) {
    return new Exercicio(
      this.id,
      edicao.nome || this.nome,
      edicao.grupo || this.grupo,
      edicao.seriesRep || this.seriesRep,
      edicao.categoria || this.categoria,
      edicao.instrucoes || this.instrucoes,
    );
  }

  isFirebase() {
    return this.id.length > 10;
  }
}

class ExercicioCategoryResolver {
  static fromGrupo(grupo: string = "") {
    const grupoCheck = grupo.toLowerCase();

    if (
      grupoCheck.includes("perna") ||
      grupoCheck.includes("inferior") ||
      grupoCheck.includes("gluteo") ||
      grupoCheck.includes("glúteo")
    ) {
      return "Inferior";
    }

    if (grupoCheck.includes("abd")) {
      return "Abdomen";
    }

    if (grupoCheck.includes("cardio") || grupoCheck.includes("esteira")) {
      return "Cardio";
    }

    if (grupoCheck.includes("costas") || grupoCheck.includes("dorsal")) {
      return "Costas";
    }

    if (grupoCheck.includes("alongamento")) {
      return "Alongamento";
    }

    return "Superior";
  }
}

class ExercicioCatalogo {
  static readonly filtros = [
    "Todos",
    "Meus Salvos",
    "Superior",
    "Inferior",
    "Costas",
    "Cardio",
    "Abdomen",
    "Alongamento",
  ];

  static readonly padrao: Exercicio[] = [
    new Exercicio(
      "40",
      "Rotacao de Ombros",
      "Pre-Treino - Superior",
      "2 series - 15 voltas",
      "Alongamento",
      "Excelente exercicio para liberar a tensao acumulada na regiao do pescoco e trapezio.",
    ),
    new Exercicio(
      "41",
      "Rotacao de Tronco",
      "Pre-Treino - Core e Costas",
      "2 series - 30 segundos",
      "Alongamento",
      "Movimento dinamico que aquece a coluna vertebral.",
    ),
    new Exercicio(
      "42",
      "Balanco de Pernas",
      "Pre-Treino - Inferior",
      "2 series - 15 vezes cada",
      "Alongamento",
      "Ideal para soltar a articulacao do quadril.",
    ),
    new Exercicio(
      "43",
      "Polichinelos",
      "Pre-Treino - Corpo Todo",
      "3 series - 45 segundos",
      "Alongamento",
      "Exercicio cardiovascular classico.",
    ),
    new Exercicio(
      "30",
      "Alongamento de Ombros",
      "Relaxamento - Parte Superior",
      "1 serie - 30 segundos",
      "Alongamento",
      "Movimento estatico focado no relaxamento.",
    ),
    new Exercicio(
      "33",
      "Alongamento de Quadriceps",
      "Relaxamento - Parte Inferior",
      "1 serie - 30 segundos",
      "Alongamento",
      "Focado no alongamento da parte frontal da coxa.",
    ),
    new Exercicio(
      "14",
      "Supino Reto (Barra ou Halter)",
      "Academia - Peitoral e Triceps",
      "4 series - 10 a 12 repeticoes",
      "Superior",
      "Construcao de forca e volume no peitoral.",
    ),
    new Exercicio(
      "15",
      "Puxada Alta (Pulldown)",
      "Academia - Costas e Biceps",
      "4 series - 12 repeticoes",
      "Costas",
      "Desenvolvimento da largura das costas.",
    ),
    new Exercicio(
      "16",
      "Desenvolvimento com Halteres",
      "Academia - Ombros",
      "3 series - 12 repeticoes",
      "Superior",
      "Focado na construcao de ombros fortes.",
    ),
    new Exercicio(
      "17",
      "Rosca Direta com Halteres",
      "Academia/Casa - Biceps",
      "3 series - 12 repeticoes",
      "Superior",
      "Isolar e desenvolver os biceps.",
    ),
    new Exercicio(
      "18",
      "Polia de Triceps (Polia)",
      "Academia - Triceps",
      "3 series - 15 repeticoes",
      "Superior",
      "Isolar a musculatura do triceps.",
    ),
    new Exercicio(
      "1",
      "Agachamento Livre (Barra)",
      "Academia - Pernas Geral",
      "4 series - 10 repeticoes",
      "Inferior",
      "Rei dos exercicios de perna.",
    ),
    new Exercicio(
      "2",
      "Leg Press 45",
      "Academia - Quadriceps e Gluteos",
      "4 series - 12 repeticoes",
      "Inferior",
      "Trabalho pesado de pernas.",
    ),
    new Exercicio(
      "3",
      "Cadeira Extensora",
      "Academia - Quadriceps",
      "3 series - 15 repeticoes",
      "Inferior",
      "Exercicio isolado focado no quadriceps.",
    ),
    new Exercicio(
      "4",
      "Agachamento Bulgaro",
      "Academia - Quadriceps e Gluteos",
      "3 series - 10 repeticoes cada perna",
      "Inferior",
      "Movimento unilateral poderoso.",
    ),
    new Exercicio(
      "5",
      "Elevacao Pelvica",
      "Academia - Gluteos",
      "4 series - 12 a 15 repeticoes",
      "Inferior",
      "Numero um para gluteos.",
    ),
    new Exercicio(
      "6",
      "Mesa Flexora",
      "Academia - Posteriores de Coxa",
      "4 series - 12 repeticoes",
      "Inferior",
      "Isolamento da parte de tras da coxa.",
    ),
    new Exercicio(
      "19",
      "Corrida na Esteira",
      "Academia - Aerobico",
      "1 sessao - 20 a 30 min",
      "Cardio",
      "Melhora do condicionamento cardiovascular.",
    ),
    new Exercicio(
      "22",
      "Supra abdominal",
      "Geral - Fortalecimento de Core",
      "4 series - 20 repeticoes",
      "Abdomen",
      "Fortalecimento direto da parede abdominal.",
    ),
  ];
}

class ExercicioFilter {
  constructor(
    private readonly filtroAtivo: string,
    private readonly busca: string,
    private readonly locaisExcluidos: string[],
  ) {}

  apply(exercicios: Exercicio[]) {
    let lista = exercicios.filter((ex) => !this.locaisExcluidos.includes(ex.id));

    if (this.filtroAtivo === "Meus Salvos") {
      lista = lista.filter((ex) => ex.isFirebase());
    } else if (this.filtroAtivo !== "Todos") {
      lista = lista.filter((ex) => ex.categoria === this.filtroAtivo);
    }

    if (this.busca) {
      lista = lista.filter((ex) =>
        ex.nome.toLowerCase().includes(this.busca.toLowerCase()),
      );
    }

    return lista;
  }
}

interface MeusExerciciosState {
  exerciciosList: Exercicio[];
  filtroAtivo: string;
  busca: string;
  concluidos: string[];
  locaisExcluidos: string[];
}

class MeusExerciciosScreen extends Component<
  LocalSearchParamsProps,
  MeusExerciciosState
> {
  private readonly paramReader: LocalSearchParamReader;
  private unsubscribeExercicios?: Unsubscribe;

  constructor(props: LocalSearchParamsProps) {
    super(props);

    this.paramReader = new LocalSearchParamReader(props.params);
    const categoriaInicial = this.paramReader.get("categoriaInicial", "Todos");

    this.state = {
      exerciciosList: ExercicioCatalogo.padrao,
      filtroAtivo: categoriaInicial,
      busca: "",
      concluidos: [],
      locaisExcluidos: [],
    };
  }

  componentDidMount() {
    this.carregarConcluidos();
    this.assinarExercicios();
  }

  componentWillUnmount() {
    this.unsubscribeExercicios?.();
  }

  private get exerciciosFiltrados() {
    return new ExercicioFilter(
      this.state.filtroAtivo,
      this.state.busca,
      this.state.locaisExcluidos,
    ).apply(this.state.exerciciosList);
  }

  private carregarConcluidos = async () => {
    const salvos = await AsyncStorage.getItem("exerciciosConcluidos");

    if (salvos) {
      this.setState({ concluidos: JSON.parse(salvos) });
    }
  };

  private carregarEdicoesPadrao = async () => {
    const raw = await AsyncStorage.getItem("edicoesPadrao");
    return raw ? JSON.parse(raw) : {};
  };

  private assinarExercicios() {
    this.unsubscribeExercicios = onSnapshot(
      collection(db, "exercicios"),
      async (snapshot) => {
        const edicoes = await this.carregarEdicoesPadrao();
        const exerciciosFirebase = snapshot.docs.map((documento) =>
          Exercicio.fromFirestore(documento.id, documento.data()),
        );
        const padraoAtualizado = ExercicioCatalogo.padrao.map((ex) =>
          edicoes[ex.id] ? ex.withEdit(edicoes[ex.id]) : ex,
        );

        this.setState({
          exerciciosList: [...padraoAtualizado, ...exerciciosFirebase],
        });
      },
    );
  }

  private toggleConcluido = async (id: string) => {
    const novaLista = this.state.concluidos.includes(id)
      ? this.state.concluidos.filter((item) => item !== id)
      : [...this.state.concluidos, id];

    this.setState({ concluidos: novaLista });
    await AsyncStorage.setItem("exerciciosConcluidos", JSON.stringify(novaLista));
  };

  private executarExclusao = async (id: string) => {
    if (id.length > 5) {
      await deleteDoc(doc(db, "exercicios", id));
    } else {
      this.setState((estadoAtual) => ({
        locaisExcluidos: [...estadoAtual.locaisExcluidos, id],
      }));
    }

    Alert.alert("Pronto!", "Exercicio apagado com sucesso.");
  };

  private handleExcluir = (id: string, nome: string) => {
    Alert.alert("Excluir Exercicio", `Tem certeza que deseja excluir "${nome}"?`, [
      { text: "Cancelar" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => this.executarExclusao(id),
      },
    ]);
  };

  private handleEditar = (item: Exercicio) => {
    router.push({
      pathname: "/criar-exercicios",
      params: {
        id: item.id,
        nome: item.nome,
        grupoMuscular: item.grupo,
        instrucoes: item.instrucoes,
        editando: "true",
        isFirebase: item.isFirebase() ? "true" : "false",
      },
    });
  };

  private abrirDetalhes = (item: Exercicio) => {
    router.push({
      pathname: "/detalhes",
      params: {
        id: item.id,
        nome: item.nome,
        grupo: item.grupo,
        seriesRep: item.seriesRep,
        categoria: item.categoria,
        instrucoes: item.instrucoes,
      },
    });
  };

  private renderHeader = () => (
    <>
      <View style={styles.titleContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.mainTitle}>Biblioteca de exercicios</Text>
          <Text style={styles.subTitleHeader}>Gerencie o seu treino</Text>
        </View>
        <TouchableOpacity
          style={styles.btnNovoExercicio}
          onPress={() => router.push("/criar-exercicios")}
        >
          <Text style={styles.btnNovoExercicioText}>+ Novo</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#A0A0A0" />
        <TextInput
          style={styles.input}
          placeholder="Buscar exercicio"
          value={this.state.busca}
          onChangeText={(valor) => this.setState({ busca: valor })}
        />
      </View>
      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {ExercicioCatalogo.filtros.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => this.setState({ filtroAtivo: cat })}
              style={styles.filterTabContainer}
            >
              <Text
                style={[
                  styles.filterText,
                  this.state.filtroAtivo === cat && styles.filterTextActive,
                ]}
              >
                {cat}
              </Text>
              {this.state.filtroAtivo === cat && (
                <View style={styles.barrinhaLaranjaAtiva} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );

  private renderExercicio = ({ item }: { item: Exercicio }) => {
    const concluido = this.state.concluidos.includes(item.id);

    return (
      <View style={[styles.cardFigma, concluido && styles.cardConcluido]}>
        <View style={styles.cardInfoContainer}>
          <TouchableOpacity
            onPress={() => this.toggleConcluido(item.id)}
            style={styles.checkbox}
          >
            <Ionicons
              name={concluido ? "checkbox" : "square-outline"}
              size={28}
              color={concluido ? "#4CAF50" : "#A0A0A0"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cardInfoTouchable}
            onPress={() => this.abrirDetalhes(item)}
          >
            <View style={styles.iconHalterBoxLaranja}>
              <MaterialCommunityIcons
                name={item.categoria === "Alongamento" ? "yoga" : "dumbbell"}
                size={30}
                color="#FFF"
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.workoutTitle}>{item.nome}</Text>
              <Text style={styles.workoutSub}>{item.grupo}</Text>
            </View>
          </TouchableOpacity>
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
        </View>
      </View>
    );
  };

  render() {
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
          <FlatList
            data={this.exerciciosFiltrados}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={this.renderHeader}
            renderItem={this.renderExercicio}
          />
        </View>
      </SafeAreaView>
    );
  }
}

export default LocalSearchParamsAdapter.connect(MeusExerciciosScreen);

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
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  mainTitle: { fontSize: 24, fontWeight: "bold", color: "#111" },
  subTitleHeader: { fontSize: 13, color: "#707070", marginTop: 2 },
  btnNovoExercicio: {
    backgroundColor: "#F28C1B",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  btnNovoExercicioText: { color: "#FFF", fontWeight: "bold", fontSize: 13 },
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
  filterTabContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
    alignItems: "center",
  },
  filterText: { color: "#707070", fontWeight: "600", fontSize: 15 },
  filterTextActive: { color: "#F28C1B", fontWeight: "bold" },
  barrinhaLaranjaAtiva: {
    width: "100%",
    height: 3,
    backgroundColor: "#F28C1B",
    borderRadius: 2,
    marginTop: 4,
  },
  cardFigma: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "#ECECEC",
  },
  cardConcluido: { borderColor: "#4CAF50" },
  cardInfoContainer: { flexDirection: "row", alignItems: "center" },
  cardInfoTouchable: { flex: 1, flexDirection: "row", alignItems: "center" },
  checkbox: { marginRight: 10, padding: 5 },
  iconHalterBoxLaranja: {
    width: 60,
    height: 60,
    borderRadius: 14,
    marginRight: 14,
    backgroundColor: "#F28C1B",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: { flex: 1, justifyContent: "center" },
  workoutTitle: { fontSize: 16, fontWeight: "bold", color: "#1A1A1A" },
  workoutSub: { fontSize: 13, color: "#707070", marginVertical: 2 },
  workoutSpecs: { fontSize: 12, color: "#A0A0A0" },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#ECECEC",
    paddingTop: 12,
    marginTop: 12,
  },
  editBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: "#E3F2FD",
  },
  editText: { color: "#1E88E5", fontWeight: "600" },
  deleteBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: "#FFEBEE",
  },
  deleteText: { color: "#E53935", fontWeight: "600" },
});
