import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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

import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../src/utils/firebaseConfig";

interface Exercicio {
  id: string;
  nome: string;
  grupo: string;
  seriesRep: string;
  categoria: string;
  instrucoes: string;
}

const FILTROS_EXERCICIOS: string[] = [
  "Todos",
  "Meus Salvos",
  "Superior",
  "Inferior",
  "Costas",
  "Cardio",
  "Abdômen",
  "Alongamento",
];

const EXERCICIOS_PADRAO: Exercicio[] = [
  {
    id: "40",
    nome: "Rotação de Ombros",
    grupo: "Pré-Treino • Superior",
    seriesRep: "2 séries • 15 voltas",
    categoria: "Alongamento",
    instrucoes:
      "Excelente exercício para liberar a tensão acumulada na região do pescoço e trapézio.",
  },
  {
    id: "41",
    nome: "Rotação de Tronco",
    grupo: "Pré-Treino • Core e Costas",
    seriesRep: "2 séries • 30 segundos",
    categoria: "Alongamento",
    instrucoes: "Movimento dinâmico que aquece a coluna vertebral.",
  },
  {
    id: "42",
    nome: "Balanço de Pernas",
    grupo: "Pré-Treino • Inferior",
    seriesRep: "2 séries • 15 vezes cada",
    categoria: "Alongamento",
    instrucoes: "Ideal para soltar a articulação do quadril.",
  },
  {
    id: "43",
    nome: "Polichinelos",
    grupo: "Pré-Treino • Corpo Todo",
    seriesRep: "3 séries • 45 segundos",
    categoria: "Alongamento",
    instrucoes: "Exercício cardiovascular clássico.",
  },
  {
    id: "30",
    nome: "Alongamento de Ombros",
    grupo: "Relaxamento • Parte Superior",
    seriesRep: "1 série • 30 segundos",
    categoria: "Alongamento",
    instrucoes: "Movimento estático focado no relaxamento.",
  },
  {
    id: "33",
    nome: "Alongamento de Quadríceps",
    grupo: "Relaxamento • Parte Inferior",
    seriesRep: "1 série • 30 segundos",
    categoria: "Alongamento",
    instrucoes: "Focado no alongamento da parte frontal da coxa.",
  },
  {
    id: "14",
    nome: "Supino Reto (Barra ou Halter)",
    grupo: "Academia • Peitoral e Tríceps",
    seriesRep: "4 séries • 10 a 12 repetições",
    categoria: "Superior",
    instrucoes: "Construção de força e volume no peitoral.",
  },
  {
    id: "15",
    nome: "Puxada Alta (Pulldown)",
    grupo: "Academia • Costas e Bíceps",
    seriesRep: "4 séries • 12 repetições",
    categoria: "Costas",
    instrucoes: "Desenvolvimento da largura das costas.",
  },
  {
    id: "16",
    nome: "Desenvolvimento com Halteres",
    grupo: "Academia • Ombros",
    seriesRep: "3 séries • 12 repetições",
    categoria: "Superior",
    instrucoes: "Focado na construção de ombros fortes.",
  },
  {
    id: "17",
    nome: "Rosca Direta com Halteres",
    grupo: "Academia/Casa • Bíceps",
    seriesRep: "3 séries • 12 repetições",
    categoria: "Superior",
    instrucoes: "Isolar e desenvolver os bíceps.",
  },
  {
    id: "18",
    nome: "Polia de Tríceps (Polia)",
    grupo: "Academia • Tríceps",
    seriesRep: "3 séries • 15 repetições",
    categoria: "Superior",
    instrucoes: "Isolar a musculatura do tríceps.",
  },
  {
    id: "1",
    nome: "Agachamento Livre (Barra)",
    grupo: "Academia • Pernas Geral",
    seriesRep: "4 séries • 10 repetições",
    categoria: "Inferior",
    instrucoes: "Rei dos exercícios de perna.",
  },
  {
    id: "2",
    nome: "Leg Press 45°",
    grupo: "Academia • Quadríceps e Glúteos",
    seriesRep: "4 séries • 12 repetições",
    categoria: "Inferior",
    instrucoes: "Trabalho pesado de pernas.",
  },
  {
    id: "3",
    nome: "Cadeira Extensora",
    grupo: "Academia • Quadríceps",
    seriesRep: "3 séries • 15 repetições",
    categoria: "Inferior",
    instrucoes: "Exercício isolado focado no quadríceps.",
  },
  {
    id: "4",
    nome: "Agachamento Búlgaro",
    grupo: "Academia • Quadríceps e Glúteos",
    seriesRep: "3 séries • 10 repetições cada perna",
    categoria: "Inferior",
    instrucoes: "Movimento unilateral poderoso.",
  },
  {
    id: "5",
    nome: "Elevação Pélvica",
    grupo: "Academia • Glúteos",
    seriesRep: "4 séries • 12 a 15 repetições",
    categoria: "Inferior",
    instrucoes: "Número um para glúteos.",
  },
  {
    id: "6",
    nome: "Mesa Flexora",
    grupo: "Academia • Posteriores de Coxa",
    seriesRep: "4 séries • 12 repetições",
    categoria: "Inferior",
    instrucoes: "Isolamento da parte de trás da coxa.",
  },
  {
    id: "19",
    nome: "Corrida na Esteira",
    grupo: "Academia • Aeróbico",
    seriesRep: "1 sessão • 20 a 30 min",
    categoria: "Cardio",
    instrucoes: "Melhora do condicionamento cardiovascular.",
  },
  {
    id: "22",
    nome: "Supra abdominal",
    grupo: "Geral • Fortalecimento de Core",
    seriesRep: "4 séries • 20 repetições",
    categoria: "Abdômen",
    instrucoes: "Fortalecimento direto da parede abdominal.",
  },
];

export default function MeusExerciciosScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const categoriaInicial = params.categoriaInicial as string;

  const [exerciciosList, setExerciciosList] =
    useState<Exercicio[]>(EXERCICIOS_PADRAO);
  const [filtroAtivo, setFiltroAtivo] = useState<string>(
    categoriaInicial || "Todos",
  );
  const [busca, setBusca] = useState<string>("");
  const [concluidos, setConcluidos] = useState<string[]>([]);
  const [locaisExcluidos, setLocaisExcluidos] = useState<string[]>([]);

  useEffect(() => {
    if (categoriaInicial) setFiltroAtivo(categoriaInicial);
  }, [categoriaInicial]);

  useFocusEffect(
    useCallback(() => {
      const carregarConcluidos = async () => {
        const salvos = await AsyncStorage.getItem("exerciciosConcluidos");
        if (salvos) setConcluidos(JSON.parse(salvos));
      };
      carregarConcluidos();
    }, []),
  );

  // CORREÇÃO: carrega edições locais dos padrões e mescla com Firebase
  useEffect(() => {
    const carregarEdicoesPadrao = async () => {
      const raw = await AsyncStorage.getItem("edicoesPadrao");
      return raw ? JSON.parse(raw) : {};
    };

    const unsubscribe = onSnapshot(
      collection(db, "exercicios"),
      async (snapshot) => {
        const edicoes = await carregarEdicoesPadrao();

        const exerciciosFirebase = snapshot.docs.map((doc) => {
          const data = doc.data();
          let cat = "Superior";
          const grupoCheck = (data.grupoMuscular || "").toLowerCase();
          if (
            grupoCheck.includes("perna") ||
            grupoCheck.includes("inferior") ||
            grupoCheck.includes("glúteo")
          )
            cat = "Inferior";
          else if (grupoCheck.includes("abd")) cat = "Abdômen";
          else if (
            grupoCheck.includes("cardio") ||
            grupoCheck.includes("esteira")
          )
            cat = "Cardio";
          else if (
            grupoCheck.includes("costas") ||
            grupoCheck.includes("dorsal")
          )
            cat = "Costas";
          else if (grupoCheck.includes("alongamento")) cat = "Alongamento";
          return {
            id: doc.id,
            nome: data.nome || "Sem nome",
            grupo: data.grupoMuscular || "Geral",
            seriesRep: `${data.series} séries • ${data.repeticoes}`,
            categoria: cat,
            instrucoes: data.descricao || "",
            ...data,
          } as Exercicio;
        });

        // Aplica edições locais nos exercícios padrão
        const padraoAtualizado = EXERCICIOS_PADRAO.map((ex) =>
          edicoes[ex.id] ? { ...ex, ...edicoes[ex.id] } : ex,
        );

        setExerciciosList([...padraoAtualizado, ...exerciciosFirebase]);
      },
    );
    return () => unsubscribe();
  }, []);

  const exerciciosFiltrados = useMemo(() => {
    let lista = exerciciosList.filter((ex) => !locaisExcluidos.includes(ex.id));
    if (filtroAtivo === "Meus Salvos")
      lista = lista.filter((ex) => ex.id.length > 10);
    else if (filtroAtivo !== "Todos")
      lista = lista.filter((ex) => ex.categoria === filtroAtivo);
    if (busca)
      lista = lista.filter((ex) =>
        ex.nome.toLowerCase().includes(busca.toLowerCase()),
      );
    return lista;
  }, [filtroAtivo, busca, exerciciosList, locaisExcluidos]);

  const toggleConcluido = async (id: string) => {
    const novaLista = concluidos.includes(id)
      ? concluidos.filter((i) => i !== id)
      : [...concluidos, id];
    setConcluidos(novaLista);
    await AsyncStorage.setItem(
      "exerciciosConcluidos",
      JSON.stringify(novaLista),
    );
  };

  const executarExclusao = async (id: string) => {
    if (id.length > 5) await deleteDoc(doc(db, "exercicios", id));
    else setLocaisExcluidos((prev) => [...prev, id]);
    Alert.alert("Pronto!", "Exercício apagado com sucesso.");
  };

  const handleExcluir = (id: string, nome: string) => {
    Alert.alert(
      "Excluir Exercício",
      `Tem certeza que deseja excluir "${nome}"?`,
      [
        { text: "Cancelar" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => executarExclusao(id),
        },
      ],
    );
  };

  // CORREÇÃO: adiciona flag isFirebase nos params
  const handleEditar = (item: Exercicio) => {
    const isFirebase = item.id.length > 10;
    router.push({
      pathname: "/criar-exercicios",
      params: {
        id: item.id,
        nome: item.nome,
        grupoMuscular: item.grupo,
        instrucoes: item.instrucoes,
        editando: "true",
        isFirebase: isFirebase ? "true" : "false",
      },
    });
  };

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
          data={exerciciosFiltrados}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <>
              <View style={styles.titleContainer}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.mainTitle}>Biblioteca de exercícios</Text>
                  <Text style={styles.subTitleHeader}>
                    Gerencie o seu treino
                  </Text>
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
                  placeholder="Buscar exercício"
                  value={busca}
                  onChangeText={setBusca}
                />
              </View>
              <View style={styles.filterWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {FILTROS_EXERCICIOS.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setFiltroAtivo(cat)}
                      style={styles.filterTabContainer}
                    >
                      <Text
                        style={[
                          styles.filterText,
                          filtroAtivo === cat && styles.filterTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                      {filtroAtivo === cat && (
                        <View style={styles.barrinhaLaranjaAtiva} />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </>
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.cardFigma,
                concluidos.includes(item.id) && styles.cardConcluido,
              ]}
            >
              <View style={styles.cardInfoContainer}>
                <TouchableOpacity
                  onPress={() => toggleConcluido(item.id)}
                  style={styles.checkbox}
                >
                  <Ionicons
                    name={
                      concluidos.includes(item.id)
                        ? "checkbox"
                        : "square-outline"
                    }
                    size={28}
                    color={concluidos.includes(item.id) ? "#4CAF50" : "#A0A0A0"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cardInfoTouchable}
                  onPress={() =>
                    router.push({ pathname: "/detalhes", params: { ...item } })
                  }
                >
                  <View style={styles.iconHalterBoxLaranja}>
                    <MaterialCommunityIcons
                      name={
                        item.categoria === "Alongamento" ? "yoga" : "dumbbell"
                      }
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
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
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
