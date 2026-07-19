import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import NovaRefeicao from "./NovaRefeicao";

// ==========================================
// 1. INTERFACES (As regras do TypeScript para o CRUD)
// ==========================================
export interface Alimento {
  id: string;
  nome: string;
  porcao: string;
  calorias: number;
  emoji?: string;
  iconColor?: string;
}

export interface Refeicao {
  id: string;
  tipo: string;
  nome: string;
  itens: Alimento[];
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
  onPress?: () => void; // Adicionado para poder clicar na comida e editar
}

interface MealSectionProps {
  title: string;
  totalCalories: number;
  foods: Alimento[];
  onEditPress: () => void; // Adicionado para abrir a edição
}

// ==========================================
// 2. COMPONENTES VISUAIS
// ==========================================

function Header({ title, iconName, onBackPress }: HeaderProps) {
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

function FoodCard({
  name,
  portion,
  calories,
  emoji = "🍲",
  iconColor = "#FFF0E6",
  isLast = false,
  onPress,
}: FoodCardProps) {
  return (
    <TouchableOpacity
      style={[styles.foodCard, isLast && styles.lastCard]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.foodInfoContainer}>
        <View style={[styles.iconPlaceholder, { backgroundColor: iconColor }]}>
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

function MealSection({
  title,
  totalCalories,
  foods,
  onEditPress,
}: MealSectionProps) {
  return (
    <View style={styles.mealContainer}>
      <View style={styles.mealHeader}>
        <Text style={styles.mealTitle}>{title}</Text>
        <View style={styles.mealHeaderRight}>
          <Text style={styles.mealTotal}>{totalCalories} kcal</Text>
          <TouchableOpacity style={styles.addMealButton} onPress={onEditPress}>
            {/* O botão '+' agora serve para editar/adicionar itens nesta refeição */}
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
              onPress={onEditPress} // Clicar na comida também abre a edição!
            />
          ))
        ) : (
          <Text style={{ padding: 10, color: "#9CA3AF", fontStyle: "italic" }}>
            Nenhum alimento nesta refeição.
          </Text>
        )}
      </View>
    </View>
  );
}

// BARRA COM 5 BOTÕES
function BottomTabs() {
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

// ==========================================
// 3. TELA PRINCIPAL (Onde o CRUD funciona)
// ==========================================
export default function App() {
  const [telaAtual, setTelaAtual] = useState<"PlanoAlimentar" | "NovaRefeicao">(
    "PlanoAlimentar",
  );

  // Esse estado guarda a refeição que você clicou para editar
  const [refeicaoEditando, setRefeicaoEditando] = useState<Refeicao | null>(
    null,
  );

  // O nosso "Banco de Dados" temporário. Já deixei uma refeição de exemplo!
  const [refeicoes, setRefeicoes] = useState<Refeicao[]>([
    {
      id: "ref_1",
      tipo: "Café da manhã",
      nome: "Café reforçado",
      itens: [
        {
          id: "1",
          nome: "Aveia com banana",
          porcao: "1 porção",
          calorias: 280,
          emoji: "🥣",
          iconColor: "#FFF0F0",
        },
        {
          id: "2",
          nome: "Ovo mexido",
          porcao: "2 unidades",
          calorias: 140,
          emoji: "🥚",
          iconColor: "#FFF9E6",
        },
      ],
    },
  ]);

  // ==========================================
  // FUNÇÕES DO CRUD
  // ==========================================

  // CREATE (Criar) e UPDATE (Atualizar)
  const salvarRefeicao = (novaRefeicao: Refeicao) => {
    const existe = refeicoes.find((r) => r.id === novaRefeicao.id);

    if (existe) {
      // Se já existir, atualiza a lista
      setRefeicoes(
        refeicoes.map((r) => (r.id === novaRefeicao.id ? novaRefeicao : r)),
      );
    } else {
      // Se não existir, adiciona uma nova
      setRefeicoes([...refeicoes, novaRefeicao]);
    }

    setTelaAtual("PlanoAlimentar");
    setRefeicaoEditando(null);
  };

  // DELETE (Apagar)
  const deletarRefeicao = (idRefeicao: string) => {
    setRefeicoes(refeicoes.filter((r) => r.id !== idRefeicao));
    setTelaAtual("PlanoAlimentar");
    setRefeicaoEditando(null);
  };

  // ABRIR TELAS
  const abrirNovaRefeicao = () => {
    setRefeicaoEditando(null); // Limpa para criar do zero
    setTelaAtual("NovaRefeicao");
  };

  const abrirEditarRefeicao = (refeicao: Refeicao) => {
    setRefeicaoEditando(refeicao); // Manda os dados da refeição clicada
    setTelaAtual("NovaRefeicao");
  };

  // ==========================================
  // CONTROLE DE NAVEGAÇÃO
  // ==========================================
  if (telaAtual === "NovaRefeicao") {
    return (
      <NovaRefeicao
        refeicaoEditando={refeicaoEditando}
        onSalvar={salvarRefeicao}
        onDeletar={deletarRefeicao}
        onVoltar={() => {
          setTelaAtual("PlanoAlimentar");
          setRefeicaoEditando(null);
        }}
      />
    );
  }

  // ==========================================
  // CÁLCULOS DO RESUMO DO DIA
  // ==========================================
  const totalCaloriasDia = refeicoes.reduce((total, ref) => {
    return total + ref.itens.reduce((sum, item) => sum + item.calorias, 0);
  }, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FF8C00" />
      <Header title="Plano Alimentar" iconName="calendar" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.dateText}>Hoje, 15 de abril</Text>

        {/* Caixa de Resumo Dinâmica */}
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

            <View style={styles.divider} />

            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>180g</Text>
              <Text style={styles.macroLabel}>Proteínas</Text>
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: "100%", backgroundColor: "#FACC15" },
                  ]}
                />
              </View>
              <Text style={styles.macroMeta}>Meta 150g</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>210g</Text>
              <Text style={styles.macroLabel}>Carboidratos</Text>
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: "95%", backgroundColor: "#FACC15" },
                  ]}
                />
              </View>
              <Text style={styles.macroMeta}>Meta 220g</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>60g</Text>
              <Text style={styles.macroLabel}>Gorduras</Text>
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: "90%", backgroundColor: "#9CA3AF" },
                  ]}
                />
              </View>
              <Text style={styles.macroMeta}>Meta 65g</Text>
            </View>
          </View>
        </View>

        {/* LISTAGEM DAS REFEIÇÕES (Vindas do "Banco de Dados") */}
        {refeicoes.map((refeicao) => {
          const caloriasDaRefeicao = refeicao.itens.reduce(
            (total, item) => total + item.calorias,
            0,
          );

          return (
            <MealSection
              key={refeicao.id}
              title={`${refeicao.tipo} ${refeicao.nome ? `- ${refeicao.nome}` : ""}`}
              totalCalories={caloriasDaRefeicao}
              foods={refeicao.itens}
              onEditPress={() => abrirEditarRefeicao(refeicao)} // Clicar aqui abre a edição!
            />
          );
        })}

        {/* BOTÃO PARA CRIAR UMA NOVA DO ZERO */}
        <TouchableOpacity
          style={styles.botaoAdicionarRefeicao}
          onPress={abrirNovaRefeicao}
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
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
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
    marginBottom: 6,
    position: "relative",
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
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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
