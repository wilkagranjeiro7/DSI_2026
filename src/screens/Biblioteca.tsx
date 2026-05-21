import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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

// Categorias/Filtros da tela de treinos
const CATEGORIAS = ["Todos", "Hoje", "Força", "Cardio"];

// Lista de Treinos simulando os dados do seu Figma
const TREINOS = [
  {
    id: "1",
    nome: "Treino Superior",
    divisao: "Peito, ombro e tríceps",
    duracao: "45 min",
    dias: "Seg/Qua",
    categoria: "Força",
  },
  {
    id: "2",
    nome: "Treino Inferior",
    divisao: "Pernas e glúteos",
    duracao: "55 min",
    dias: "Ter/Qui",
    categoria: "Força",
  },
  {
    id: "3",
    nome: "Cardio HIIT",
    divisao: "Condicionamento e resistência",
    duracao: "30 min",
    dias: "Sex",
    categoria: "Cardio",
  },
];

export default function MeusTreinosScreen() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [busca, setBusca] = useState("");

  // ESTRUTURA CHAVE: Esse estado controla se mostra o cadastro ou a lista
  const [exibirCadastro, setExibirCadastro] = useState(false);

  // Estados do formulário de Cadastro de Novo Treino
  const [nomeTreino, setNomeTreino] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [tipoTreino, setTipoTreino] = useState("");
  const [diasSemana, setDiasSemana] = useState("");
  const [duracao, setDuracao] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // Filtro de treinos por busca e categoria
  const treinosFiltrados = useMemo(() => {
    return TREINOS.filter((treino) => {
      const correspondeCategoria =
        categoriaAtiva === "Todos" || treino.categoria === categoriaAtiva;
      const correspondeBusca = treino.nome
        .toLowerCase()
        .includes(busca.toLowerCase());
      return correspondeCategoria && correspondeBusca;
    });
  }, [categoriaAtiva, busca]);

  const handleSalvarTreino = () => {
    console.log({
      nomeTreino,
      objetivo,
      tipoTreino,
      diasSemana,
      duracao,
      observacoes,
    });
    // Esconde o formulário e volta para a lista
    setExibirCadastro(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Superior Laranja - Funciona para as duas telas */}
      <View style={styles.headerLaranja}>
        <TouchableOpacity
          onPress={() => (exibirCadastro ? setExibirCadastro(false) : null)}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.logoText}>FitMatch</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* SE EXIBIR CADASTRO FOR TRUE: Mostra a Tela de Cadastrar Novo Treino */}
      {exibirCadastro ? (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <Text style={styles.mainTitle}>Novo treino</Text>
          <Text style={styles.subTitleHeader}>
            Cadastre um treino personalizado
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome do treino</Text>
            <TextInput
              placeholder="Ex.: Treino de força A"
              placeholderTextColor="#A0A0A0"
              style={styles.inputForm}
              value={nomeTreino}
              onChangeText={setNomeTreino}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Objetivo</Text>
            <TextInput
              placeholder="Hipertrofia"
              placeholderTextColor="#A0A0A0"
              style={styles.inputForm}
              value={objetivo}
              onChangeText={setObjetivo}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tipo de treino</Text>
            <TextInput
              placeholder="Força"
              placeholderTextColor="#A0A0A0"
              style={styles.inputForm}
              value={tipoTreino}
              onChangeText={setTipoTreino}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Dias da semana</Text>
            <TextInput
              placeholder="Seg, Qua e Sex"
              placeholderTextColor="#A0A0A0"
              style={styles.inputForm}
              value={diasSemana}
              onChangeText={setDiasSemana}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Duração estimada</Text>
            <TextInput
              placeholder="45 minutos"
              placeholderTextColor="#A0A0A0"
              style={styles.inputForm}
              value={duracao}
              onChangeText={setDuracao}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Observações</Text>
            <TextInput
              placeholder="Anotações para execução"
              placeholderTextColor="#A0A0A0"
              style={[styles.inputForm, styles.inputMultiline]}
              multiline={true}
              numberOfLines={4}
              value={observacoes}
              onChangeText={setObservacoes}
            />
          </View>

          <TouchableOpacity
            style={styles.btnSalvar}
            onPress={handleSalvarTreino}
          >
            <Text style={styles.btnSalvarText}>Salvar treino</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        // SE EXIBIR CADASTRO FOR FALSE: Mostra a sua lista normal de treinos
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <View>
              <Text style={styles.mainTitle}>Meus treinos</Text>
              <Text style={styles.subTitleHeader}>
                Gerencie seus planos de treino
              </Text>
            </View>

            {/* O BOTÃO QUE MUDA PARA A TELA DE CADASTRO */}
            <TouchableOpacity
              style={styles.btnNovoTreino}
              onPress={() => setExibirCadastro(true)} // <-- Ativa o formulário de cadastro
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
              onChangeText={setBusca}
            />
          </View>

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

          <FlatList
            data={treinosFiltrados}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.cardFigma}>
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
                </View>

                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity style={styles.btnOutline}>
                    <Text style={styles.btnOutlineText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnOutline}>
                    <Text style={styles.btnOutlineText}>Excluir</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnLaranjaCard}>
                    <Text style={styles.btnLaranjaCardText}>Exercícios</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      )}
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

  /* ESTILOS NOVOS DO FORMULÁRIO DE CADASTRO */
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
