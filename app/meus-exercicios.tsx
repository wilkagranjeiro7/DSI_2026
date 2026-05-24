import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
      "Excelente exercício para liberar a tensão acumulada na região do pescoço e trapézio, preparando as articulações superiores para o treino e melhorando a postura.",
  },
  {
    id: "41",
    nome: "Rotação de Tronco",
    grupo: "Pré-Treino • Core e Costas",
    seriesRep: "2 séries • 30 segundos",
    categoria: "Alongamento",
    instrucoes:
      "Movimento dinâmico que aquece a coluna vertebral e ativa a musculatura do core, promovendo maior mobilidade articular e prevenindo dores lombares.",
  },
  {
    id: "42",
    nome: "Balanço de Pernas",
    grupo: "Pré-Treino • Inferior",
    seriesRep: "2 séries • 15 vezes cada",
    categoria: "Alongamento",
    instrucoes:
      "Ideal para soltar a articulação do quadril e promover o aquecimento dinâmico dos membros inferiores antes de treinos intensos ou sessões de corrida.",
  },
  {
    id: "43",
    nome: "Polichinelos",
    grupo: "Pré-Treino • Corpo Todo",
    seriesRep: "3 séries • 45 segundos",
    categoria: "Alongamento",
    instrucoes:
      "Exercício cardiovascular clássico que eleva a frequência cardíaca, estimula a circulação sanguínea e aquece o corpo inteiro de forma rápida e eficiente.",
  },
  {
    id: "30",
    nome: "Alongamento de Ombros",
    grupo: "Relaxamento • Parte Superior",
    seriesRep: "1 série • 30 segundos",
    categoria: "Alongamento",
    instrucoes:
      "Movimento estático focado no relaxamento da musculatura dos ombros e braços. É ideal para o pós-treino de superiores ou para aliviar tensões do dia a dia.",
  },
  {
    id: "33",
    nome: "Alongamento de Quadríceps",
    grupo: "Relaxamento • Parte Inferior",
    seriesRep: "1 série • 30 segundos",
    categoria: "Alongamento",
    instrucoes:
      "Focado no alongamento da parte frontal da coxa. Muito importante para melhorar a flexibilidade, relaxar a musculatura e prevenir encurtamentos articulares.",
  },
  {
    id: "14",
    nome: "Supino Reto (Barra ou Halter)",
    grupo: "Academia • Peitoral e Tríceps",
    seriesRep: "4 séries • 10 a 12 repetições",
    categoria: "Superior",
    instrucoes:
      "Um dos exercícios mais completos e tradicionais para a construção de força e volume no peitoral, recrutando também o tríceps e a parte frontal dos ombros.",
  },
  {
    id: "15",
    nome: "Puxada Alta (Pulldown)",
    grupo: "Academia • Costas e Bíceps",
    seriesRep: "4 séries • 12 repetições",
    categoria: "Costas",
    instrucoes:
      "Exercício fundamental para o desenvolvimento da largura das costas (dorsais). Ajuda a melhorar a postura e desenvolve a força necessária para exercícios de puxada.",
  },
  {
    id: "16",
    nome: "Desenvolvimento com Halteres",
    grupo: "Academia • Ombros",
    seriesRep: "3 séries • 12 repetições",
    categoria: "Superior",
    instrucoes:
      "Focado na construção de ombros fortes e desenhados. Trabalha intensamente as porções frontal e lateral dos deltoides, melhorando a estabilidade da cintura escapular.",
  },
  {
    id: "17",
    nome: "Rosca Direta com Halteres",
    grupo: "Academia/Casa • Bíceps",
    seriesRep: "3 séries • 12 repetições",
    categoria: "Superior",
    instrucoes:
      "O movimento clássico para isolar e desenvolver os bíceps. Promove o ganho de força e definição na parte frontal dos braços de forma simples e direta.",
  },
  {
    id: "18",
    nome: "Polia de Tríceps (Polia)",
    grupo: "Academia • Tríceps",
    seriesRep: "3 séries • 15 repetições",
    categoria: "Superior",
    instrucoes:
      "Excelente exercício para isolar a musculatura do tríceps, ajudando a tonificar, fortalecer e dar volume à parte de trás do braço.",
  },
  {
    id: "1",
    nome: "Agachamento Livre (Barra)",
    grupo: "Academia • Pernas Geral",
    seriesRep: "4 séries • 10 repetições",
    categoria: "Inferior",
    instrucoes:
      "Considerado o rei dos exercícios de perna. Trabalha simultaneamente quadríceps, glúteos e core, sendo essencial para ganho de força global e massa muscular.",
  },
  {
    id: "2",
    nome: "Leg Press 45°",
    grupo: "Academia • Quadríceps e Glúteos",
    seriesRep: "4 séries • 12 repetições",
    categoria: "Inferior",
    instrucoes:
      "Ótima alternativa para focar no trabalho pesado de pernas (quadríceps e glúteos) oferecendo um maior suporte e estabilidade para a região da coluna lombar.",
  },
  {
    id: "3",
    nome: "Cadeira Extensora",
    grupo: "Academia • Quadríceps",
    seriesRep: "3 séries • 15 repetições",
    categoria: "Inferior",
    instrucoes:
      "Exercício isolado focado 100% no quadríceps. Perfeito para definir a parte frontal da coxa, fortalecer a articulação do joelho e trabalhar até a falha muscular.",
  },
  {
    id: "4",
    nome: "Agachamento Búlgaro",
    grupo: "Academia • Quadríceps e Glúteos",
    seriesRep: "3 séries • 10 repetições cada perna",
    categoria: "Inferior",
    instrucoes:
      "Movimento unilateral poderoso que exige equilíbrio e recruta intensamente os glúteos e quadríceps de cada perna individualmente, corrigindo assimetrias.",
  },
  {
    id: "5",
    nome: "Elevação Pélvica",
    grupo: "Academia • Glúteos",
    seriesRep: "4 séries • 12 a 15 repetições",
    categoria: "Inferior",
    instrucoes:
      "O exercício número um para focar no desenvolvimento dos glúteos. Permite trabalhar com bastante carga, ativando a musculatura de forma profunda e eficaz.",
  },
  {
    id: "6",
    nome: "Mesa Flexora",
    grupo: "Academia • Posteriores de Coxa",
    seriesRep: "4 séries • 12 repetições",
    categoria: "Inferior",
    instrucoes:
      "Focado no isolamento da parte de trás da coxa (isquiotibiais). Essencial para prevenir lesões nos joelhos e equilibrar a força das pernas em relação aos quadríceps.",
  },
  {
    id: "19",
    nome: "Corrida na Esteira",
    grupo: "Academia • Aeróbico",
    seriesRep: "1 sessão • 20 a 30 min",
    categoria: "Cardio",
    instrucoes:
      "Excelente atividade aeróbica contínua. Ajuda na queima de calorias, melhora do condicionamento cardiovascular, resistência física e saúde do coração.",
  },
  {
    id: "22",
    nome: "Supra abdominal",
    grupo: "Geral • Fortalecimento de Core",
    seriesRep: "4 séries • 20 repetições",
    categoria: "Abdômen",
    instrucoes:
      "Focado no fortalecimento direto da parede abdominal. Um core forte melhora a sua postura diária e ajuda a estabilizar o corpo em praticamente todos os outros exercícios.",
  },
];

export default function MeusExerciciosScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const treinoSelecionado = params.treinoSelecionado as string | undefined;

  const [exerciciosList, setExerciciosList] =
    useState<Exercicio[]>(EXERCICIOS_PADRAO);
  const [filtroAtivo, setFiltroAtivo] = useState<string>("Todos");
  const [busca, setBusca] = useState<string>("");
  const [concluidos, setConcluidos] = useState<string[]>([]);
  const [locaisExcluidos, setLocaisExcluidos] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      const carregarConcluidos = async () => {
        try {
          const salvos = await AsyncStorage.getItem("exerciciosConcluidos");
          if (salvos) {
            setConcluidos(JSON.parse(salvos));
          }
        } catch (erro) {
          console.error("Erro ao carregar os exercícios concluídos:", erro);
        }
      };
      carregarConcluidos();
    }, []),
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "exercicios"), (snapshot) => {
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
        else if (grupoCheck.includes("costas") || grupoCheck.includes("dorsal"))
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

      setExerciciosList([...EXERCICIOS_PADRAO, ...exerciciosFirebase]);
    });

    return () => unsubscribe();
  }, []);

  const toggleConcluido = async (id: string) => {
    try {
      let novaLista;
      if (concluidos.includes(id)) {
        novaLista = concluidos.filter((i) => i !== id);
      } else {
        novaLista = [...concluidos, id];
        if (Platform.OS === "web") {
          window.alert("Exercício concluído com sucesso!");
        } else {
          Alert.alert("Parabéns!", "Exercício concluído com sucesso!");
        }
      }
      setConcluidos(novaLista);
      await AsyncStorage.setItem(
        "exerciciosConcluidos",
        JSON.stringify(novaLista),
      );
    } catch (erro) {
      console.error("Erro ao salvar checkbox:", erro);
    }
  };

  const exerciciosFiltrados = useMemo(() => {
    let lista = exerciciosList.filter((ex) => !locaisExcluidos.includes(ex.id));

    if (filtroAtivo === "Meus Salvos") {
      lista = lista.filter((ex) => ex.id.length > 10);
    } else if (filtroAtivo !== "Todos") {
      lista = lista.filter((ex) => ex.categoria === filtroAtivo);
    }

    if (busca) {
      lista = lista.filter((ex) =>
        ex.nome.toLowerCase().includes(busca.toLowerCase()),
      );
    }

    return lista;
  }, [filtroAtivo, busca, exerciciosList, locaisExcluidos]);

  // CORRIGIDO AQUI: executarExclusao escrito com 'x'
  const executarExclusao = async (id: string) => {
    if (id.length > 5) {
      try {
        await deleteDoc(doc(db, "exercicios", id));
        if (Platform.OS === "web") {
          window.alert("Exercício apagado com sucesso.");
        } else {
          Alert.alert("Pronto!", "Exercício apagado com sucesso.");
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
      setLocaisExcluidos((prev) => [...prev, id]);
      if (Platform.OS === "web") {
        window.alert("Exercício apagado com sucesso.");
      } else {
        Alert.alert("Pronto!", "Exercício apagado com sucesso.");
      }
    }
  };

  const handleExcluir = (id: string, nome: string) => {
    if (Platform.OS === "web") {
      const confirmou = window.confirm(
        `Tem certeza que deseja excluir "${nome}"?`,
      );
      if (confirmou) {
        executarExclusao(id); // CORRIGIDO AQUI: executarExclusao escrito com 'x'
      }
    } else {
      Alert.alert(
        "Excluir Exercício",
        `Tem certeza que deseja excluir "${nome}"?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Excluir",
            style: "destructive",
            onPress: () => executarExclusao(id), // CORRIGIDO AQUI: executarExclusao escrito com 'x'
          },
        ],
      );
    }
  };

  const handleEditar = (item: Exercicio) => {
    router.push({
      pathname: "/criar-exercicios",
      params: {
        id: item.id,
        nome: item.nome,
        grupoMuscular: item.grupo,
        instrucoes: item.instrucoes,
        editando: "true",
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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponent={
            <>
              <View style={styles.titleContainer}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.mainTitle} numberOfLines={1}>
                    Biblioteca de exercícios
                  </Text>
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
                  placeholder="Buscar exercício"
                  placeholderTextColor="#A0A0A0"
                  style={styles.input}
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
                    <Text style={styles.workoutSpecs}>{item.seriesRep}</Text>
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
