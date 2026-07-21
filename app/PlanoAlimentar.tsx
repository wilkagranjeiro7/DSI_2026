import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { PlanoAlimentarService } from "../src/services/PlanoAlimentarService";
import NovaRefeicao from "./NovaRefeicao";

// ==========================================
// 1. CLASSES DE MODELO
// ==========================================

export class Alimento {
  id: string;
  nome: string;
  porcao: string;
  calorias: number;
  emoji?: string;
  iconColor?: string;

  constructor(
    id: string,
    nome: string,
    porcao: string,
    calorias: number,
    emoji?: string,
    iconColor?: string,
  ) {
    this.id = id;
    this.nome = nome;
    this.porcao = porcao;
    this.calorias = calorias;
    this.emoji = emoji;
    this.iconColor = iconColor;
  }

  static fromPlain(obj: any): Alimento {
    return new Alimento(
      obj.id,
      obj.nome,
      obj.porcao,
      obj.calorias,
      obj.emoji,
      obj.iconColor,
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

  static fromPlain(obj: any): Refeicao {
    const itens = (obj.itens ?? []).map((item: any) =>
      Alimento.fromPlain(item),
    );
    return new Refeicao(obj.id, obj.tipo, obj.nome, itens);
  }

  totalCalorias(): number {
    return this.itens.reduce((total, item) => total + item.calorias, 0);
  }

  tituloExibicao(): string {
    return `${this.tipo} ${this.nome ? `- ${this.nome}` : ""}`;
  }
}

interface HeaderProps {
  title: string;
  iconName: React.ComponentProps<typeof Feather>["name"];
  onBackPress?: () => void;
}

interface FoodCardProps {
  name: string;
  portion: string;
  calories: number;
  emoji?: string;
  iconColor?: string;
  isLast?: boolean;
  onPress?: () => void;
}

interface MealSectionProps {
  title: string;
  totalCalories: number;
  foods: Alimento[];
  onEditPress: () => void;
  onFinalizar: () => void; // Nova propriedade
}

interface PlanoAlimentarState {
  telaAtual: "PlanoAlimentar" | "NovaRefeicao";
  refeicaoEditando: Refeicao | null;
  refeicoes: Refeicao[];
}

// ==========================================
// 2. COMPONENTES VISUAIS
// ==========================================

class Header extends React.Component<HeaderProps> {
  render() {
    const { title, iconName, onBackPress } = this.props;
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackPress}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity>
          <Feather name={iconName} size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    );
  }
}

class FoodCard extends React.Component<FoodCardProps> {
  static defaultProps = {
    emoji: "🍲",
    iconColor: "#FFF0E6",
    isLast: false,
  };

  render() {
    const { name, portion, calories, emoji, iconColor, isLast, onPress } =
      this.props;

    return (
      <TouchableOpacity
        style={[styles.foodCard, isLast && styles.lastCard]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.foodInfoContainer}>
          <View
            style={[styles.iconPlaceholder, { backgroundColor: iconColor }]}
          >
            <Text style={styles.emojiIcon}>{emoji}</Text>
          </View>

          <View>
            <Text style={styles.foodName}>{name}</Text>
            <Text style={styles.portion}>{portion}</Text>
          </View>
        </View>
        <Text style={styles.calories}>{calories} kcal</Text>
      </TouchableOpacity>
    );
  }
}

class MealSection extends React.Component<MealSectionProps> {
  render() {
    const { title, totalCalories, foods, onEditPress, onFinalizar } =
      this.props;

    return (
      <View style={styles.mealContainer}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealTitle}>{title}</Text>
          <View style={styles.mealHeaderRight}>
            <Text style={styles.mealTotal}>{totalCalories} kcal</Text>

            {/* Botão Finalizar */}
            <TouchableOpacity
              style={[
                styles.addMealButton,
                { borderColor: "#22c55e", marginRight: 8 },
              ]}
              onPress={onFinalizar}
            >
              <Feather name="check" size={18} color="#22c55e" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addMealButton}
              onPress={onEditPress}
            >
              <Feather name="plus" size={18} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardWrapper}>
          {foods.length > 0 ? (
            foods.map((food, index) => (
              <FoodCard
                key={food.id}
                name={food.nome}
                portion={food.porcao}
                calories={food.calorias}
                emoji={food.emoji}
                iconColor={food.iconColor}
                isLast={index === foods.length - 1}
                onPress={onEditPress}
              />
            ))
          ) : (
            <Text
              style={{ padding: 10, color: "#9CA3AF", fontStyle: "italic" }}
            >
              Nenhum alimento nesta refeição.
            </Text>
          )}
        </View>
      </View>
    );
  }
}

class BottomTabs extends React.Component {
  render() {
    return (
      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tabActive}>
          <Feather name="home" size={20} color="#FF8C00" />
          <Text style={styles.tabTextActive}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <MaterialCommunityIcons name="dumbbell" size={20} color="#A0A0A0" />
          <Text style={styles.tabText}>Treinos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Feather name="plus-circle" size={20} color="#A0A0A0" />
          <Text style={styles.tabText}>Metas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Feather name="map-pin" size={20} color="#A0A0A0" />
          <Text style={styles.tabText}>Mapa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Feather name="user" size={20} color="#A0A0A0" />
          <Text style={styles.tabText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

// ==========================================
// 3. TELA PRINCIPAL
// ==========================================
class PlanoAlimentarScreen extends React.Component<
  { onFocusRequest?: (callback: () => void) => void },
  PlanoAlimentarState
> {
  constructor(props: { onFocusRequest?: (callback: () => void) => void }) {
    super(props);
    this.state = {
      telaAtual: "PlanoAlimentar",
      refeicaoEditando: null,
      refeicoes: [],
    };

    if (this.props.onFocusRequest) {
      this.props.onFocusRequest(() => this.carregarRefeicoes());
    }
  }

  // CORREÇÃO: Transformando os dados "crus" em instâncias da classe Refeicao
  carregarRefeicoes = async (): Promise<void> => {
    try {
      const dados = await PlanoAlimentarService.buscarRefeicoes();
      // O map passa por cada item do Firebase e converte usando a função que você criou
      const refeicoesInstanciadas = dados.map((item: any) =>
        Refeicao.fromPlain(item),
      );
      this.setState({ refeicoes: refeicoesInstanciadas });
    } catch (error) {
      console.error("Erro ao carregar plano alimentar:", error);
    }
  };

  // Nova função para finalizar refeição
  finalizarRefeicao = async (refeicao: Refeicao) => {
    try {
      await PlanoAlimentarService.finalizarRefeicao(refeicao.id);
      Alert.alert("Parabéns!", "Refeição concluída!");
      router.push("/progresso");
    } catch (error) {
      console.error("Erro ao finalizar:", error);
      Alert.alert("Erro", "Não foi possível finalizar a refeição.");
    }
  };

  deletarRefeicao = async (idRefeicao: string): Promise<void> => {
    try {
      await PlanoAlimentarService.deletarRefeicao(idRefeicao);
      this.setState((prevState) => ({
        refeicoes: prevState.refeicoes.filter((r) => r.id !== idRefeicao),
      }));
      Alert.alert("Excluído", "A refeição foi removida do seu plano.");
    } catch (error) {
      console.error("Erro ao deletar refeição:", error);
      Alert.alert("Erro", "Não foi possível excluir a refeição.");
    } finally {
      this.setState({ telaAtual: "PlanoAlimentar", refeicaoEditando: null });
    }
  };

  abrirNovaRefeicao = (): void => {
    this.setState({ refeicaoEditando: null, telaAtual: "NovaRefeicao" });
  };

  abrirEditarRefeicao = (refeicao: Refeicao): void => {
    this.setState({ refeicaoEditando: refeicao, telaAtual: "NovaRefeicao" });
  };

  voltarParaLista = (): void => {
    this.setState({ telaAtual: "PlanoAlimentar", refeicaoEditando: null });
    this.carregarRefeicoes();
  };

  private totalCaloriasDia(): number {
    return this.state.refeicoes.reduce(
      (total, ref) => total + ref.totalCalorias(),
      0,
    );
  }

  render() {
    const { telaAtual, refeicaoEditando, refeicoes } = this.state;

    if (telaAtual === "NovaRefeicao") {
      return (
        <NovaRefeicao
          refeicaoEditando={refeicaoEditando as any}
          onSalvar={this.voltarParaLista}
          onDeletar={this.deletarRefeicao}
          onVoltar={this.voltarParaLista}
        />
      );
    }
    const totalCaloriasDia = this.totalCaloriasDia();

    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#FF8C00" />
        <Header title="Plano Alimentar" iconName="calendar" />

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.dateText}>Hoje, 15 de abril</Text>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Resumo do dia</Text>
            <View style={styles.macrosContainer}>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>{totalCaloriasDia}</Text>
                <Text style={styles.macroLabel}>Calorias</Text>
                <View style={styles.progressBarTrack}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${Math.min((totalCaloriasDia / 2000) * 100, 100)}%`,
                        backgroundColor: "#FF8C00",
                      },
                    ]}
                  />
                </View>
                <Text style={styles.macroMeta}>Meta 2.000</Text>
              </View>
              {/* ... (Demais itens de macro omitidos para concisão, manter o original) ... */}
            </View>
          </View>

          {refeicoes.map((refeicao) => (
            <MealSection
              key={refeicao.id}
              title={refeicao.tituloExibicao()}
              totalCalories={refeicao.totalCalorias()}
              foods={refeicao.itens}
              onEditPress={() => this.abrirEditarRefeicao(refeicao)}
              onFinalizar={() => this.finalizarRefeicao(refeicao)}
            />
          ))}

          <TouchableOpacity
            style={styles.botaoAdicionarRefeicao}
            onPress={this.abrirNovaRefeicao}
          >
            <Feather name="plus-circle" size={24} color="#FFF" />
            <Text style={styles.botaoAdicionarRefeicaoTexto}>
              Criar Nova Refeição
            </Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
        <BottomTabs />
      </SafeAreaView>
    );
  }
}

export default function PlanoAlimentar() {
  const screenRef = React.useRef<PlanoAlimentarScreen>(null);
  useFocusEffect(
    React.useCallback(() => {
      screenRef.current?.carregarRefeicoes();
    }, []),
  );
  return <PlanoAlimentarScreen ref={screenRef} />;
}

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
  dateText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 20,
  },
  summaryBox: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 15,
    color: "#111827",
  },
  macrosContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  macroItem: { alignItems: "center", flex: 1 },
  macroValue: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  macroLabel: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  progressBarTrack: {
    width: "80%",
    height: 4,
    backgroundColor: "#F3F4F6",
    borderRadius: 2,
    marginTop: 8,
  },
  progressBarFill: {
    position: "absolute",
    left: 0,
    top: 0,
    height: 4,
    borderRadius: 2,
  },
  macroMeta: { fontSize: 10, color: "#111827", fontWeight: "600" },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 2,
  },
  mealContainer: { marginBottom: 20 },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  mealTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  mealHeaderRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  mealTotal: { fontSize: 14, color: "#111827", fontWeight: "600" },
  addMealButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  cardWrapper: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  foodCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  lastCard: { borderBottomWidth: 0 },
  foodInfoContainer: { flexDirection: "row", alignItems: "center" },
  iconPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  emojiIcon: { fontSize: 24 },
  foodName: { fontSize: 15, fontWeight: "700", color: "#111827" },
  portion: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  calories: { fontSize: 14, fontWeight: "600", color: "#111827" },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  tab: { alignItems: "center" },
  tabActive: { alignItems: "center" },
  tabText: { fontSize: 10, color: "#9CA3AF", marginTop: 4, fontWeight: "500" },
  tabTextActive: {
    fontSize: 10,
    color: "#FF8C00",
    marginTop: 4,
    fontWeight: "600",
  },
  botaoAdicionarRefeicao: {
    backgroundColor: "#FF8C00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  botaoAdicionarRefeicaoTexto: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
