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

// ==========================================
// 1. INTERFACES (As regras do TypeScript)
// ==========================================
interface HeaderProps {
  title: string;
  iconName: React.ComponentProps<typeof Feather>["name"];
  onBackPress?: () => void; // Adicionamos a opção de clicar no botão de voltar
}

interface FoodCardProps {
  name: string;
  portion: string;
  calories: number;
  iconColor?: string;
  isLast?: boolean;
}

interface FoodItem {
  id: string;
  name: string;
  portion: string;
  calories: number;
  iconColor?: string;
}

interface MealSectionProps {
  title: string;
  totalCalories: number;
  foods: FoodItem[];
  onAddPress: () => void; // Ação para quando clicar no "+" da refeição
}

// ==========================================
// 2. COMPONENTES (As nossas peças de Lego)
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
  iconColor = "#FFE4CC",
  isLast = false,
}: FoodCardProps) {
  return (
    <View style={[styles.foodCard, isLast && styles.lastCard]}>
      <View style={styles.foodInfoContainer}>
        {/* Quadradinho com o ícone de prato/talheres no centro */}
        <View style={[styles.iconPlaceholder, { backgroundColor: iconColor }]}>
          <MaterialCommunityIcons
            name="silverware-fork-knife"
            size={18}
            color="#FF8C00"
          />
        </View>

        <View>
          <Text style={styles.foodName}>{name}</Text>
          <Text style={styles.portion}>{portion}</Text>
        </View>
      </View>
      <Text style={styles.calories}>{calories} kcal</Text>
    </View>
  );
}

function MealSection({
  title,
  totalCalories,
  foods,
  onAddPress,
}: MealSectionProps) {
  return (
    <View style={styles.mealContainer}>
      <View style={styles.mealHeader}>
        <Text style={styles.mealTitle}>{title}</Text>
        <View style={styles.mealHeaderRight}>
          <Text style={styles.mealTotal}>{totalCalories} kcal</Text>
          <TouchableOpacity onPress={onAddPress}>
            <Feather name="plus" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardWrapper}>
        {foods.map((food, index) => (
          <FoodCard
            key={food.id}
            name={food.name}
            portion={food.portion}
            calories={food.calories}
            iconColor={food.iconColor}
            isLast={index === foods.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

function BottomTabs() {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity style={styles.tab}>
        <Feather name="home" size={24} color="#A0A0A0" />
        <Text style={styles.tabText}>Início</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab}>
        <Feather name="activity" size={24} color="#A0A0A0" />
        <Text style={styles.tabText}>Treinos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabActive}>
        <Feather name="shopping-bag" size={24} color="#FF8C00" />
        <Text style={styles.tabTextActive}>Refeições</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab}>
        <Feather name="check-circle" size={24} color="#A0A0A0" />
        <Text style={styles.tabText}>Metas</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab}>
        <Feather name="user" size={24} color="#A0A0A0" />
        <Text style={styles.tabText}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

// ==========================================
// 3. TELA PRINCIPAL (Onde tudo se junta)
// ==========================================
export default function App() {
  // === O NOSSO INTERRUPTOR DE TELAS ===
  const [telaAtual, setTelaAtual] = useState("PlanoAlimentar");

  // Dados das comidas (Mock)
  const cafeDaManha = [
    {
      id: "1",
      name: "Aveia com banana",
      portion: "1 porção",
      calories: 280,
      iconColor: "#FFF0E6",
    },
    {
      id: "2",
      name: "Ovo mexido",
      portion: "2 unidades",
      calories: 140,
      iconColor: "#FFF0E6",
    },
  ];

  const almoco = [
    {
      id: "3",
      name: "Frango grelhado",
      portion: "150 g",
      calories: 250,
      iconColor: "#FFF0E6",
    },
    {
      id: "4",
      name: "Arroz integral",
      portion: "1 xícara",
      calories: 200,
      iconColor: "#FFF0E6",
    },
    {
      id: "5",
      name: "Feijão",
      portion: "1 concha",
      calories: 130,
      iconColor: "#FFF0E6",
    },
    {
      id: "6",
      name: "Salada verde",
      portion: "1 prato",
      calories: 100,
      iconColor: "#E6F4EA",
    },
  ];

  const lancheDaTarde = [
    {
      id: "7",
      name: "Iogurte natural",
      portion: "1 pote",
      calories: 120,
      iconColor: "#F3E8FF",
    },
    {
      id: "8",
      name: "Castanhas",
      portion: "15 g",
      calories: 90,
      iconColor: "#FFF0E6",
    },
  ];

  const jantar = [
    {
      id: "9",
      name: "Salmão grelhado",
      portion: "150 g",
      calories: 250,
      iconColor: "#FFF0E6",
    },
    {
      id: "10",
      name: "Batata doce",
      portion: "100 g",
      calories: 150,
      iconColor: "#FFF0E6",
    },
  ];

  // ==========================================
  // SE A TELA FOR "NOVA REFEIÇÃO", MOSTRA ISSO:
  // ==========================================
  if (telaAtual === "NovaRefeicao") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#FF8C00" />
        <Header
          title="Nova refeição"
          iconName="trash-2"
          onBackPress={() => setTelaAtual("PlanoAlimentar")} // O botão de voltar muda o interruptor!
        />
        <View style={styles.novaRefeicaoContainer}>
          <Text style={styles.novaRefeicaoTexto}>
            A tela de Nova Refeição será construída aqui!
          </Text>
          <TouchableOpacity
            style={styles.botaoLaranja}
            onPress={() => setTelaAtual("PlanoAlimentar")}
          >
            <Text style={styles.botaoLaranjaTexto}>
              Voltar para Plano Alimentar
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // SE A TELA FOR "PLANO ALIMENTAR", MOSTRA ISSO:
  // ==========================================
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FF8C00" />

      <Header title="Plano Alimentar" iconName="calendar" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.dateText}>Hoje, 18 de junho</Text>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Resumo do dia</Text>
          <View style={styles.macrosContainer}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>1.850</Text>
              <Text style={styles.macroLabel}>Calorias</Text>
              <Text style={styles.macroMeta}>meta 2.000</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>180g</Text>
              <Text style={styles.macroLabel}>Proteínas</Text>
              <Text style={styles.macroMeta}>meta 150g</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>210g</Text>
              <Text style={styles.macroLabel}>Carboidratos</Text>
              <Text style={styles.macroMeta}>meta 220g</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>60g</Text>
              <Text style={styles.macroLabel}>Gorduras</Text>
              <Text style={styles.macroMeta}>meta 65g</Text>
            </View>
          </View>
        </View>

        {/* Repare que eu adicionei o "onAddPress" em cada seção para abrir a tela nova */}
        <MealSection
          title="Café da manhã"
          totalCalories={420}
          foods={cafeDaManha}
          onAddPress={() => setTelaAtual("NovaRefeicao")}
        />
        <MealSection
          title="Almoço"
          totalCalories={680}
          foods={almoco}
          onAddPress={() => setTelaAtual("NovaRefeicao")}
        />
        <MealSection
          title="Lanche da tarde"
          totalCalories={210}
          foods={lancheDaTarde}
          onAddPress={() => setTelaAtual("NovaRefeicao")}
        />
        <MealSection
          title="Jantar"
          totalCalories={400}
          foods={jantar}
          onAddPress={() => setTelaAtual("NovaRefeicao")}
        />

        {/* BOTÃO GRANDE PARA ADICIONAR REFEIÇÃO NO FINAL DA TELA */}
        <TouchableOpacity
          style={styles.botaoAdicionarRefeicao}
          onPress={() => setTelaAtual("NovaRefeicao")}
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
// 4. ESTILOS (O CSS da tela)
// ==========================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    backgroundColor: "#FF8C00",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    padding: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  summaryBox: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  macrosContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  macroItem: {
    alignItems: "center",
    flex: 1,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  macroLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  macroMeta: {
    fontSize: 10,
    color: "#A0A0A0",
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: "#E0E0E0",
  },
  mealContainer: {
    marginBottom: 20,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  mealHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  mealTotal: {
    fontSize: 14,
    color: "#666",
  },
  cardWrapper: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  foodCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  lastCard: {
    borderBottomWidth: 0,
  },
  foodInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  foodName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  portion: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  calories: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  tab: {
    alignItems: "center",
  },
  tabActive: {
    alignItems: "center",
  },
  tabText: {
    fontSize: 10,
    color: "#A0A0A0",
    marginTop: 4,
  },
  tabTextActive: {
    fontSize: 10,
    color: "#FF8C00",
    marginTop: 4,
    fontWeight: "500",
  },

  /* --- NOVOS ESTILOS PARA OS BOTÕES DE NOVA REFEIÇÃO --- */
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
  novaRefeicaoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  novaRefeicaoTexto: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  botaoLaranja: {
    backgroundColor: "#FF8C00",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  botaoLaranjaTexto: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
