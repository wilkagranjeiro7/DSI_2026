import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// ==========================================
// 1. INTERFACES DO CRUD
// ==========================================
interface Alimento {
  id: string;
  nome: string;
  porcao: string;
  calorias: number;
  emoji?: string;
}

interface Refeicao {
  id: string;
  tipo: string;
  nome: string;
  itens: Alimento[];
}

interface NovaRefeicaoProps {
  refeicaoEditando?: Refeicao | null;
  onSalvar: (refeicao: Refeicao) => void;
  onDeletar?: (idRefeicao: string) => void;
  onVoltar: () => void;
}

export default function NovaRefeicao({
  refeicaoEditando,
  onSalvar,
  onDeletar,
  onVoltar,
}: NovaRefeicaoProps) {
  const isEditando = !!refeicaoEditando;

  // ==========================================
  // 2. ESTADOS
  // ==========================================
  const [tipoSelecionado, setTipoSelecionado] = useState(
    refeicaoEditando?.tipo || "Café da manhã",
  );
  const [nomeRefeicao, setNomeRefeicao] = useState(
    refeicaoEditando?.nome || "",
  );
  const [itensAdicionados, setItensAdicionados] = useState<Alimento[]>(
    refeicaoEditando?.itens || [],
  );

  // Estados do Modal (Janelinha de criar alimento)
  const [modalVisivel, setModalVisivel] = useState(false);
  const [customNome, setCustomNome] = useState("");
  const [customPorcao, setCustomPorcao] = useState("");
  const [customCalorias, setCustomCalorias] = useState("");

  const alimentosDisponiveis: Alimento[] = [
    {
      id: "1",
      nome: "Frango grelhado",
      porcao: "165 kcal / 100g",
      calorias: 165,
      emoji: "🍗",
    },
    {
      id: "2",
      nome: "Arroz integral",
      porcao: "111 kcal / 100g",
      calorias: 111,
      emoji: "🍚",
    },
    {
      id: "3",
      nome: "Feijão carioca",
      porcao: "76 kcal / 100g",
      calorias: 76,
      emoji: "🧆",
    },
    {
      id: "4",
      nome: "Batata doce cozida",
      porcao: "86 kcal / 100g",
      calorias: 86,
      emoji: "🍠",
    },
    {
      id: "5",
      nome: "Ovo cozido",
      porcao: "78 kcal / unidade",
      calorias: 78,
      emoji: "🥚",
    },
    {
      id: "6",
      nome: "Abacate",
      porcao: "160 kcal / 100g",
      calorias: 160,
      emoji: "🥑",
    },
  ];

  // ==========================================
  // 3. LÓGICA DO CRUD DE ALIMENTOS
  // ==========================================
  const adicionarAlimento = (alimento: Alimento) => {
    const novoItem = { ...alimento, id: Math.random().toString() };
    setItensAdicionados([...itensAdicionados, novoItem]);
  };

  const removerAlimento = (idParaRemover: string) => {
    setItensAdicionados(
      itensAdicionados.filter((item) => item.id !== idParaRemover),
    );
  };

  // Função para salvar o alimento criado pelo usuário na hora
  const salvarAlimentoCustomizado = () => {
    if (!customNome.trim() || !customCalorias.trim()) {
      Alert.alert(
        "Aviso",
        "Preencha pelo menos o nome e as calorias do alimento.",
      );
      return;
    }

    const novoAlimento: Alimento = {
      id: Math.random().toString(),
      nome: customNome,
      porcao: customPorcao || "1 porção",
      calorias: parseInt(customCalorias) || 0,
      emoji: "🍽️", // Colocamos um emoji padrão de prato
    };

    // Adiciona direto na refeição que ele está montando
    setItensAdicionados([...itensAdicionados, novoAlimento]);

    // Limpa os campos e fecha a janelinha
    setCustomNome("");
    setCustomPorcao("");
    setCustomCalorias("");
    setModalVisivel(false);
  };

  const handleSalvar = () => {
    if (!nomeRefeicao.trim()) {
      Alert.alert("Aviso", "Por favor, dê um nome para a sua refeição.");
      return;
    }
    const refeicaoPronta: Refeicao = {
      id: isEditando ? refeicaoEditando.id : Math.random().toString(),
      tipo: tipoSelecionado,
      nome: nomeRefeicao,
      itens: itensAdicionados,
    };
    onSalvar(refeicaoPronta);
  };

  const handleDeletar = () => {
    Alert.alert(
      "Excluir Refeição",
      "Tem certeza que deseja apagar essa refeição inteira?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () =>
            onDeletar && refeicaoEditando && onDeletar(refeicaoEditando.id),
        },
      ],
    );
  };

  const totalCalorias = itensAdicionados.reduce(
    (total, item) => total + item.calorias,
    0,
  );

  // ==========================================
  // 4. VISUAL
  // ==========================================
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FF8C00" />

      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onVoltar}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditando ? "Editar refeição" : "Nova refeição"}
        </Text>
        {isEditando ? (
          <TouchableOpacity onPress={handleDeletar}>
            <Feather name="trash-2" size={24} color="#FFF" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Tipo de refeição</Text>
        <View style={styles.tipoContainer}>
          {["Café da manhã", "Almoço", "Lanche", "Jantar"].map((tipo) => (
            <TouchableOpacity
              key={tipo}
              style={[
                styles.tipoButton,
                tipoSelecionado === tipo && styles.tipoButtonActive,
              ]}
              onPress={() => setTipoSelecionado(tipo)}
            >
              <Text
                style={[
                  styles.tipoButtonText,
                  tipoSelecionado === tipo && styles.tipoButtonTextActive,
                ]}
              >
                {tipo}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Nome da refeição</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Minha refeição ou Jantar leve"
          placeholderTextColor="#9CA3AF"
          value={nomeRefeicao}
          onChangeText={setNomeRefeicao}
        />

        {/* ITENS DA REFEIÇÃO (Modo Edição) */}
        {isEditando && (
          <>
            <Text style={styles.sectionTitle}>Itens da refeição</Text>
            {itensAdicionados.length > 0 ? (
              <View style={styles.cardList}>
                {itensAdicionados.map((item, index) => (
                  <ItemComida
                    key={item.id}
                    nome={item.nome}
                    porcao={`${item.calorias} kcal`}
                    calorias={item.calorias}
                    emoji={item.emoji}
                    acao="remover"
                    onPressAcao={() => removerAlimento(item.id)}
                    isLast={index === itensAdicionados.length - 1}
                  />
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>Nenhum item adicionado.</Text>
            )}
          </>
        )}

        {/* BUSCAR ALIMENTOS */}
        <Text style={styles.sectionTitle}>Adicionar alimentos</Text>
        <View style={styles.searchContainer}>
          <Feather
            name="search"
            size={20}
            color="#9CA3AF"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar alimento"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* LISTA DE ALIMENTOS DISPONÍVEIS */}
        <View style={styles.cardList}>
          {alimentosDisponiveis.map((item, index) => (
            <ItemComida
              key={item.id}
              nome={item.nome}
              porcao={item.porcao}
              calorias={item.calorias}
              emoji={item.emoji}
              acao="adicionar"
              onPressAcao={() => adicionarAlimento(item)}
              isLast={index === alimentosDisponiveis.length - 1}
            />
          ))}
        </View>

        {/* BOTÃO MÁGICO: CRIAR ALIMENTO PERSONALIZADO */}
        <TouchableOpacity
          style={styles.btnCriarPersonalizado}
          onPress={() => setModalVisivel(true)}
        >
          <Feather name="plus" size={16} color="#FF8C00" />
          <Text style={styles.btnCriarPersonalizadoTexto}>
            Criar alimento personalizado
          </Text>
        </TouchableOpacity>

        {/* ITENS ADICIONADOS (Modo Criação) */}
        {!isEditando && (
          <>
            <Text style={styles.sectionTitle}>Itens adicionados</Text>
            {itensAdicionados.length > 0 ? (
              <View style={styles.cardList}>
                {itensAdicionados.map((item, index) => (
                  <ItemComida
                    key={item.id}
                    nome={item.nome}
                    porcao={`${item.calorias} kcal`}
                    calorias={item.calorias}
                    emoji={item.emoji}
                    acao="remover"
                    onPressAcao={() => removerAlimento(item.id)}
                    isLast={index === itensAdicionados.length - 1}
                  />
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>
                Adicione alimentos clicando no "+" acima.
              </Text>
            )}
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* RODAPÉ FIXO */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total da refeição</Text>
          <Text style={styles.totalValue}>{totalCalorias} kcal</Text>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
          <Text style={styles.saveButtonText}>
            {isEditando ? "Salvar alterações" : "Salvar refeição"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ========================================== */}
      {/* MODAL (JANELINHA) DE ALIMENTO PERSONALIZADO */}
      {/* ========================================== */}
      <Modal visible={modalVisivel} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo Alimento</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Nome (ex: Pão Caseiro)"
              placeholderTextColor="#9CA3AF"
              value={customNome}
              onChangeText={setCustomNome}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Porção (ex: 1 fatia)"
              placeholderTextColor="#9CA3AF"
              value={customPorcao}
              onChangeText={setCustomPorcao}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Calorias (ex: 120)"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={customCalorias}
              onChangeText={setCustomCalorias}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => setModalVisivel(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalBtnSave}
                onPress={salvarAlimentoCustomizado}
              >
                <Text style={styles.modalBtnSaveText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// COMPONENTE PARA REUTILIZAR AS LINHAS DE COMIDA
function ItemComida({
  nome,
  porcao,
  calorias,
  emoji,
  acao,
  onPressAcao,
  isLast = false,
}: any) {
  return (
    <View style={[styles.foodItem, isLast && { borderBottomWidth: 0 }]}>
      <View style={styles.foodItemLeft}>
        {emoji && (
          <View style={styles.emojiBox}>
            <Text style={{ fontSize: 20 }}>{emoji}</Text>
          </View>
        )}
        <View>
          <Text style={styles.foodItemName}>{nome}</Text>
          <Text style={styles.foodItemPortion}>{porcao}</Text>
        </View>
      </View>
      <View style={styles.foodItemRight}>
        {acao === "remover" && calorias ? (
          <View style={{ marginRight: 12 }}>
            <Text style={styles.foodItemCalories}>{calorias} kcal</Text>
          </View>
        ) : null}
        {acao === "adicionar" ? (
          <TouchableOpacity
            style={styles.actionButtonAdd}
            onPress={onPressAcao}
          >
            <Feather name="plus" size={18} color="#FF8C00" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.actionButtonRemove}
            onPress={onPressAcao}
          >
            <Feather name="minus" size={18} color="#DC2626" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ==========================================
// 4. ESTILOS (Adicionado o visual da Janelinha)
// ==========================================
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    backgroundColor: "#FF8C00",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  content: { padding: 20 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    marginTop: 10,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontStyle: "italic",
    marginBottom: 10,
  },
  tipoContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 20,
    overflow: "hidden",
  },
  tipoButton: { flex: 1, paddingVertical: 10, alignItems: "center" },
  tipoButtonActive: { backgroundColor: "#FF8C00", borderRadius: 25 },
  tipoButtonText: { fontSize: 12, color: "#6B7280", fontWeight: "600" },
  tipoButtonTextActive: { color: "#FFF", fontWeight: "bold" },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111827",
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, paddingVertical: 14, fontSize: 15, color: "#111827" },
  cardList: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  foodItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  foodItemLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  emojiBox: {
    backgroundColor: "#F3F4F6",
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  foodItemName: { fontSize: 14, fontWeight: "700", color: "#111827" },
  foodItemPortion: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  foodItemRight: { flexDirection: "row", alignItems: "center" },
  foodItemCalories: { fontSize: 13, fontWeight: "700", color: "#111827" },
  actionButtonAdd: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FF8C00",
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonRemove: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#F9FAFB",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  totalLabel: { fontSize: 15, fontWeight: "700", color: "#111827" },
  totalValue: { fontSize: 15, fontWeight: "700", color: "#111827" },
  saveButton: {
    backgroundColor: "#FF8C00",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },

  // Estilos do Botão de Criar Alimento
  btnCriarPersonalizado: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: -10,
    marginBottom: 20,
  },
  btnCriarPersonalizadoTexto: {
    color: "#FF8C00",
    fontWeight: "bold",
    marginLeft: 8,
  },

  // Estilos do Modal (Janelinha Flutuante)
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    width: "85%",
    borderRadius: 16,
    padding: 24,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#111827",
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 15,
    color: "#111827",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalBtnCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    marginRight: 8,
  },
  modalBtnCancelText: { color: "#4B5563", fontWeight: "bold", fontSize: 15 },
  modalBtnSave: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#FF8C00",
    alignItems: "center",
    marginLeft: 8,
  },
  modalBtnSaveText: { color: "#FFF", fontWeight: "bold", fontSize: 15 },
});
