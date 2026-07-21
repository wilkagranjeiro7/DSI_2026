import { Feather } from "@expo/vector-icons";
import type { Router } from "expo-router";
import { useRouter } from "expo-router";
import React from "react";
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
import { PlanoAlimentarService } from "../src/services/PlanoAlimentarService";

// ==========================================
// 1. CLASSES DE MODELO (antes eram interfaces)
// ==========================================

export class Alimento {
  id: string;
  nome: string;
  porcao: string;
  calorias: number;
  emoji?: string;

  constructor(
    id: string,
    nome: string,
    porcao: string,
    calorias: number,
    emoji?: string,
  ) {
    this.id = id;
    this.nome = nome;
    this.porcao = porcao;
    this.calorias = calorias;
    this.emoji = emoji;
  }

  // Cria uma cópia deste alimento com um novo id (usado ao adicionar à refeição,
  // pra não duplicar o id do item "catálogo")
  comNovoId(): Alimento {
    return new Alimento(
      Math.random().toString(),
      this.nome,
      this.porcao,
      this.calorias,
      this.emoji,
    );
  }
}

export class Refeicao {
  id: string;
  tipo: string;
  nome: string;
  itens: Alimento[];

  constructor(id: string, tipo: string, nome: string, itens: Alimento[]) {
    this.id = id;
    this.tipo = tipo;
    this.nome = nome;
    this.itens = itens;
  }
}

interface NovaRefeicaoProps {
  refeicaoEditando?: Refeicao | null;
  onSalvar: (refeicao: Refeicao) => void;
  onDeletar?: (idRefeicao: string) => void;
  onVoltar: () => void;
  router: Router; // necessário caso a tela seja acessada direto por rota
}

interface ItemComidaProps {
  nome: string;
  porcao: string;
  calorias: number;
  emoji?: string;
  acao: "adicionar" | "remover";
  onPressAcao: () => void;
  isLast?: boolean;
}

interface NovaRefeicaoState {
  tipoSelecionado: string;
  nomeRefeicao: string;
  itensAdicionados: Alimento[];
  salvando: boolean; // evita clique duplo no botão salvar
  modalVisivel: boolean;
  customNome: string;
  customPorcao: string;
  customCalorias: string;
}

// COMPONENTE PARA REUTILIZAR AS LINHAS DE COMIDA
class ItemComida extends React.Component<ItemComidaProps> {
  static defaultProps = {
    isLast: false,
  };

  render() {
    const { nome, porcao, calorias, emoji, acao, onPressAcao, isLast } =
      this.props;

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
}

// ==========================================
// 2. TELA PRINCIPAL (classe com o CRUD)
// ==========================================
class NovaRefeicaoScreen extends React.Component<
  NovaRefeicaoProps,
  NovaRefeicaoState
> {
  // Catálogo de alimentos disponíveis (não muda, então não precisa ir pro state)
  private readonly alimentosDisponiveis: Alimento[] = [
    new Alimento("1", "Frango grelhado", "165 kcal / 100g", 165, "🍗"),
    new Alimento("2", "Arroz integral", "111 kcal / 100g", 111, "🍚"),
    new Alimento("3", "Feijão carioca", "76 kcal / 100g", 76, "🧆"),
    new Alimento("4", "Batata doce cozida", "86 kcal / 100g", 86, "🍠"),
    new Alimento("5", "Ovo cozido", "78 kcal / unidade", 78, "🥚"),
    new Alimento("6", "Abacate", "160 kcal / 100g", 160, "🥑"),
  ];

  private readonly isEditando: boolean;

  constructor(props: NovaRefeicaoProps) {
    super(props);

    this.isEditando = !!props.refeicaoEditando;

    this.state = {
      tipoSelecionado: props.refeicaoEditando?.tipo || "Café da manhã",
      nomeRefeicao: props.refeicaoEditando?.nome || "",
      itensAdicionados: props.refeicaoEditando?.itens || [],
      salvando: false,
      modalVisivel: false,
      customNome: "",
      customPorcao: "",
      customCalorias: "",
    };
  }

  // ==========================================
  // 3. LÓGICA DO CRUD DE ALIMENTOS
  // ==========================================
  adicionarAlimento = (alimento: Alimento): void => {
    const novoItem = alimento.comNovoId();
    this.setState((prevState) => ({
      itensAdicionados: [...prevState.itensAdicionados, novoItem],
    }));
  };

  removerAlimento = (idParaRemover: string): void => {
    this.setState((prevState) => ({
      itensAdicionados: prevState.itensAdicionados.filter(
        (item) => item.id !== idParaRemover,
      ),
    }));
  };

  // Salva o alimento criado pelo usuário na hora
  salvarAlimentoCustomizado = (): void => {
    const { customNome, customPorcao, customCalorias, itensAdicionados } =
      this.state;

    if (!customNome.trim() || !customCalorias.trim()) {
      Alert.alert(
        "Aviso",
        "Preencha pelo menos o nome e as calorias do alimento.",
      );
      return;
    }

    const novoAlimento = new Alimento(
      Math.random().toString(),
      customNome,
      customPorcao || "1 porção",
      parseInt(customCalorias) || 0,
      "🍽️",
    );

    this.setState({
      itensAdicionados: [...itensAdicionados, novoAlimento],
      customNome: "",
      customPorcao: "",
      customCalorias: "",
      modalVisivel: false,
    });
  };

  // ==========================================
  // SALVAR NO FIREBASE (cria OU atualiza, sem duplicar)
  // ==========================================
  handleSalvar = async (): Promise<void> => {
    const { nomeRefeicao, tipoSelecionado, itensAdicionados } = this.state;
    const { refeicaoEditando, onSalvar } = this.props;

    if (!nomeRefeicao.trim()) {
      Alert.alert("Aviso", "Por favor, dê um nome para a sua refeição.");
      return;
    }

    const dadosRefeicao = {
      tipo: tipoSelecionado,
      nome: nomeRefeicao,
      itens: itensAdicionados,
    };

    this.setState({ salvando: true });
    try {
      if (this.isEditando && refeicaoEditando) {
        // Atualiza a refeição existente no Firestore (não cria uma nova)
        await PlanoAlimentarService.atualizarRefeicao(
          refeicaoEditando.id,
          dadosRefeicao as any,
        );
        Alert.alert("Sucesso", "Alterações salvas!");
      } else {
        // Cria uma refeição nova no Firestore
        await PlanoAlimentarService.salvarRefeicao(dadosRefeicao as any);
        Alert.alert("Sucesso", "Refeição salva no seu plano!");
      }

      // Avisa o componente pai (caso ele precise atualizar algo)
      onSalvar(
        new Refeicao(
          this.isEditando ? refeicaoEditando!.id : Math.random().toString(),
          dadosRefeicao.tipo,
          dadosRefeicao.nome,
          dadosRefeicao.itens,
        ),
      );
    } catch (error) {
      console.error("Erro ao salvar refeição:", error);
      Alert.alert("Erro", "Não foi possível salvar a refeição.");
    } finally {
      this.setState({ salvando: false });
    }
  };

  handleDeletar = (): void => {
    const { onDeletar, refeicaoEditando } = this.props;

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

  private totalCalorias(): number {
    return this.state.itensAdicionados.reduce(
      (total, item) => total + item.calorias,
      0,
    );
  }

  // ==========================================
  // 4. VISUAL
  // ==========================================
  render() {
    const { onVoltar, router } = this.props;
    const {
      tipoSelecionado,
      nomeRefeicao,
      itensAdicionados,
      salvando,
      modalVisivel,
      customNome,
      customPorcao,
      customCalorias,
    } = this.state;

    const totalCalorias = this.totalCalorias();

    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#FF8C00" />

        {/* CABEÇALHO */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => (onVoltar ? onVoltar() : router.back())}
          >
            <Feather name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {this.isEditando ? "Editar refeição" : "Nova refeição"}
          </Text>
          {this.isEditando ? (
            <TouchableOpacity onPress={this.handleDeletar}>
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
                onPress={() => this.setState({ tipoSelecionado: tipo })}
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
            onChangeText={(texto) => this.setState({ nomeRefeicao: texto })}
          />

          {this.isEditando && (
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
                      onPressAcao={() => this.removerAlimento(item.id)}
                      isLast={index === itensAdicionados.length - 1}
                    />
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyText}>Nenhum item adicionado.</Text>
              )}
            </>
          )}

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

          <View style={styles.cardList}>
            {this.alimentosDisponiveis.map((item, index) => (
              <ItemComida
                key={item.id}
                nome={item.nome}
                porcao={item.porcao}
                calorias={item.calorias}
                emoji={item.emoji}
                acao="adicionar"
                onPressAcao={() => this.adicionarAlimento(item)}
                isLast={index === this.alimentosDisponiveis.length - 1}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.btnCriarPersonalizado}
            onPress={() => this.setState({ modalVisivel: true })}
          >
            <Feather name="plus" size={16} color="#FF8C00" />
            <Text style={styles.btnCriarPersonalizadoTexto}>
              Criar alimento personalizado
            </Text>
          </TouchableOpacity>

          {!this.isEditando && (
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
                      onPressAcao={() => this.removerAlimento(item.id)}
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
          <TouchableOpacity
            style={[styles.saveButton, salvando && { opacity: 0.6 }]}
            onPress={this.handleSalvar}
            disabled={salvando}
          >
            <Text style={styles.saveButtonText}>
              {salvando
                ? "Salvando..."
                : this.isEditando
                  ? "Salvar alterações"
                  : "Salvar refeição"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* MODAL DE ALIMENTO PERSONALIZADO */}
        <Modal visible={modalVisivel} transparent={true} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Novo Alimento</Text>

              <TextInput
                style={styles.modalInput}
                placeholder="Nome (ex: Pão Caseiro)"
                placeholderTextColor="#9CA3AF"
                value={customNome}
                onChangeText={(texto) => this.setState({ customNome: texto })}
              />

              <TextInput
                style={styles.modalInput}
                placeholder="Porção (ex: 1 fatia)"
                placeholderTextColor="#9CA3AF"
                value={customPorcao}
                onChangeText={(texto) => this.setState({ customPorcao: texto })}
              />

              <TextInput
                style={styles.modalInput}
                placeholder="Calorias (ex: 120)"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={customCalorias}
                onChangeText={(texto) =>
                  this.setState({ customCalorias: texto })
                }
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalBtnCancel}
                  onPress={() => this.setState({ modalVisivel: false })}
                >
                  <Text style={styles.modalBtnCancelText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalBtnSave}
                  onPress={this.salvarAlimentoCustomizado}
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
}

// ==========================================
// 3. WRAPPER FUNCIONAL (só pra ligar o useRouter do expo-router à classe)
// ==========================================
// "useRouter" é um hook e só pode ser chamado dentro de uma função componente.
// Esse wrapper existe unicamente pra obter o router e passá-lo como prop pra
// classe — nenhuma regra de negócio vive aqui.
interface WrapperProps {
  refeicaoEditando?: Refeicao | null;
  onSalvar: (refeicao: Refeicao) => void;
  onDeletar?: (idRefeicao: string) => void;
  onVoltar: () => void;
}

export default function NovaRefeicao(props: WrapperProps) {
  const router = useRouter();
  return <NovaRefeicaoScreen {...props} router={router} />;
}

// ==========================================
// 4. ESTILOS
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
