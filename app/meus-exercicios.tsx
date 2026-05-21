import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
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
  "Superior",
  "Inferior",
  "Cardio",
  "Abdômen",
  "Alongamento",
];

const EXERCICIOS_PADRAO: Exercicio[] = [
  // --- AQUECIMENTO E ALONGAMENTO ---
  {
    id: "40",
    nome: "Rotação de Ombros",
    grupo: "Pré-Treino • Superior",
    seriesRep: "15 voltas (frente e trás)",
    categoria: "Alongamento",
    instrucoes:
      "Levante os ombros perto das orelhas e faça círculos grandes girando para trás 15 vezes. Depois, faça o mesmo girando para frente.",
  },
  {
    id: "41",
    nome: "Rotação de Tronco",
    grupo: "Pré-Treino • Core e Costas",
    seriesRep: "30 seg alternando",
    categoria: "Alongamento",
    instrucoes:
      "Com pés afastados, gire o tronco para os lados sem parar. Deixe os braços soltos e relaxados para baterem levemente no corpo a cada giro.",
  },
  {
    id: "42",
    nome: "Balanço de Pernas",
    grupo: "Pré-Treino • Inferior",
    seriesRep: "15 vezes (cada perna)",
    categoria: "Alongamento",
    instrucoes:
      "Apoie uma mão na parede. Balance a outra perna esticada para frente e para trás, como um pêndulo de relógio. Troque o lado.",
  },
  {
    id: "43",
    nome: "Polichinelos",
    grupo: "Pré-Treino • Corpo Todo",
    seriesRep: "30 a 40 seg",
    categoria: "Alongamento",
    instrucoes:
      "Pule afastando os pés e batendo as mãos acima da cabeça. Volte pulando com pés juntos e braços ao lado do corpo.",
  },
  {
    id: "30",
    nome: "Alongamento de Ombros",
    grupo: "Relaxamento • Parte Superior",
    seriesRep: "30 seg cada braço",
    categoria: "Alongamento",
    instrucoes:
      "Estique o braço direito cruzando o peito. Use a mão esquerda para puxar esse braço contra você. Mantenha os ombros abaixados e segure a posição.",
  },
  {
    id: "33",
    nome: "Alongamento de Quadríceps",
    grupo: "Relaxamento • Parte Inferior",
    seriesRep: "30 seg cada perna",
    categoria: "Alongamento",
    instrucoes:
      "Em pé, dobre um joelho e puxe o pé para trás com a mão, em direção ao bumbum. Tente deixar os joelhos coladinhos um no outro.",
  },

  // --- TREINO SUPERIOR ---
  {
    id: "14",
    nome: "Supino Reto (Barra ou Halter)",
    grupo: "Academia • Peitoral e Tríceps",
    seriesRep: "4 séries • 10 rep",
    categoria: "Superior",
    instrucoes:
      "Deite-se no banco com pés firmes no chão. Desça o peso devagar (3s) até encostar levemente no peito e empurre para cima (1s). Mantenha os ombros colados no banco.",
  },
  {
    id: "15",
    nome: "Puxada Alta (Pulldown)",
    grupo: "Academia • Costas e Bíceps",
    seriesRep: "4 séries • 12 rep",
    categoria: "Superior",
    instrucoes:
      "Incline o tronco levemente para trás, estufe o peito e puxe a barra em direção à parte alta do peito. Imagine que quer encostar um cotovelo no outro nas costas.",
  },
  {
    id: "16",
    nome: "Desenvolvimento com Halteres",
    grupo: "Academia • Ombros",
    seriesRep: "3 séries • 12 rep",
    categoria: "Superior",
    instrucoes:
      "Sente-se com as costas apoiadas. Empurre os pesos acima da cabeça (sem bater um no outro) e desça devagar até a altura das orelhas.",
  },
  {
    id: "17",
    nome: "Rosca Direta com Halteres",
    grupo: "Academia/Casa • Bíceps",
    seriesRep: "3 séries • 12 a 15 rep",
    categoria: "Superior",
    instrucoes:
      "Cole os cotovelos nas costelas. Dobre os braços trazendo o peso até os ombros in 1s e desça devagar. O cotovelo não pode ir para frente nem para trás.",
  },
  {
    id: "18",
    nome: "Tríceps Pulley (Polia)",
    grupo: "Academia • Tríceps",
    seriesRep: "4 séries • 12 rep",
    categoria: "Superior",
    instrucoes:
      "Incline o corpo levemente para frente. Empurre a barra para baixo até esticar totalmente os braços. Volte dobrando o braço só até 90 graus. Cotovelo fixo na cintura!",
  },

  // --- TREINO INFERIOR ---
  {
    id: "1",
    nome: "Agachamento Livre (Barra)",
    grupo: "Academia • Pernas Geral",
    seriesRep: "4 séries • 10 a 12 rep",
    categoria: "Inferior",
    instrucoes:
      "Jogue o quadril para trás e dobre os joelhos até as coxas ficarem paralelas ao chão. Desça devagar (3s) controlando o peso, e suba rápido (1s). Peito sempre estufado!",
  },
  {
    id: "2",
    nome: "Leg Press 45°",
    grupo: "Academia • Quadríceps e Glúteos",
    seriesRep: "4 séries • 12 rep",
    categoria: "Inferior",
    instrucoes:
      "Traga a plataforma até os joelhos formarem 90 graus (desça em 3s). Empurre de volta, mas NUNCA estique os joelhos 100% até travar para proteger suas articulações.",
  },
  {
    id: "3",
    nome: "Cadeira Extensora",
    grupo: "Academia • Quadríceps",
    seriesRep: "3 séries • 15 rep",
    categoria: "Inferior",
    instrucoes:
      "Chute o peso para cima esticando as pernas. Segure no alto por 1 segundo (para fritar a coxa) e desça bem devagar, resistindo ao peso.",
  },
  {
    id: "4",
    nome: "Agachamento Búlgaro",
    grupo: "Academia • Quadríceps e Glúteos",
    seriesRep: "3 séries • 10 a 12 rep (cada perna)",
    categoria: "Inferior",
    instrucoes:
      "Com um pé apoiado no banco atrás, desça o quadril in linha reta até o joelho de trás quase tocar o chão. Incline o tronco levemente à frente para focar nos glúteos.",
  },
  {
    id: "5",
    nome: "Elevação Pélvica",
    grupo: "Academia • Glúteos",
    seriesRep: "4 séries • 12 a 15 rep",
    categoria: "Inferior",
    instrucoes:
      "Apoiando as costas no banco, empurre o chão com os calcanhares e levante o quadril. Esprema o bumbum lá em cima por 2 segundos e desça devagar.",
  },
  {
    id: "6",
    nome: "Mesa Flexora",
    grupo: "Academia • Posteriores de Coxa",
    seriesRep: "4 séries • 12 rep",
    categoria: "Inferior",
    instrucoes:
      "Dobre os joelhos trazendo o rolinho em direção ao bumbum com força. Na hora de voltar, desça as pernas bem devagar para não soltar o peso de vez.",
  },

  // --- CARDIO E ABDÔMEN ---
  {
    id: "19",
    nome: "Corrida na Esteira",
    grupo: "Academia • Aeróbico",
    seriesRep: "1 sessão • 20 min",
    categoria: "Cardio",
    instrucoes:
      "Mantenha postura ereta e olhe para frente. Tente pisar com o meio do pé, e não com o calcanhar, para reduzir o impacto nos joelhos.",
  },
  {
    id: "22",
    nome: "Abdominal Supra",
    grupo: "Geral • Fortalecimento de Core",
    seriesRep: "3 séries • 25 rep",
    categoria: "Abdômen",
    instrucoes:
      "Tire apenas os ombros do chão espremendo a barriga. Olhe para um ponto fixo no teto. Não puxe o pescoço com as mãos, quem faz força é o abdômen!",
  },
];

export default function MeusExerciciosScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const treinoSelecionado = params.treinoSelecionado as string | undefined;

  const [filtroAtivo, setFiltroAtivo] = useState<string>("Todos");
  const [busca, setBusca] = useState<string>("");

  const exerciciosFiltrados = useMemo(() => {
    let lista = EXERCICIOS_PADRAO;
    if (treinoSelecionado) {
      const nome = treinoSelecionado.toLowerCase();
      if (nome.includes("superior"))
        lista = lista.filter((ex) => ex.categoria === "Superior");
      else if (nome.includes("inferior"))
        lista = lista.filter((ex) => ex.categoria === "Inferior");
      else if (nome.includes("cardio"))
        lista = lista.filter((ex) => ex.categoria === "Cardio");
      else if (nome.includes("abdômen") || nome.includes("abdomen"))
        lista = lista.filter((ex) => ex.categoria === "Abdômen");
      else if (nome.includes("alongamento"))
        lista = lista.filter((ex) => ex.categoria === "Alongamento");
    } else if (filtroAtivo !== "Todos") {
      lista = lista.filter((ex) => ex.categoria === filtroAtivo);
    }
    if (busca)
      lista = lista.filter((ex) =>
        ex.nome.toLowerCase().includes(busca.toLowerCase()),
      );
    return lista;
  }, [filtroAtivo, busca, treinoSelecionado]);

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
          <View style={{ flex: 1 }}>
            <Text style={styles.mainTitle} numberOfLines={1}>
              {treinoSelecionado || "Biblioteca"}
            </Text>
            <Text style={styles.subTitleHeader}>
              {treinoSelecionado
                ? "Exercícios do treino"
                : "Biblioteca de exercícios"}
            </Text>
          </View>
          <TouchableOpacity style={styles.btnNovoExercicio}>
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

        {!treinoSelecionado && (
          <View style={styles.filterWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
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
        )}

        <FlatList
          data={exerciciosFiltrados}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={true}
          renderItem={({ item }) => (
            <View style={styles.cardFigma}>
              <TouchableOpacity
                style={styles.cardInfoContainer}
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
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      {/* BARRA DE NAVEGAÇÃO INFERIOR */}
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
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  cardInfoContainer: { flexDirection: "row", alignItems: "center" },
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

  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFF",
    paddingBottom: 25,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 12,
    color: "#A0A0A0",
    marginTop: 4,
    fontWeight: "500",
  },
});
