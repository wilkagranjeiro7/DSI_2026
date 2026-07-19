import { Feather } from "@expo/vector-icons";
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
// 1. INTERFACES
// ==========================================
interface HeaderProps {
  title: string;
  iconName: React.ComponentProps<typeof Feather>["name"];
  onBackPress?: () => void;
}

interface FoodCardProps {
  name: string;
  portion: string;
  calories: number;
  isLast?: boolean;
}

interface FoodItem {
  id: string;
  name: string;
  portion: string;
  calories: number;
}

interface MealSectionProps {
  title: string;
  totalCalories: number;
  foods: FoodItem[];
  onAddPress: () => void;
}

// ==========================================
// 2. COMPONENTES
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

// Card de comida sem o ícone do talher
function FoodCard({ name, portion, calories, isLast = false }: FoodCardProps) {
  return (
    <View style={[styles.foodCard, isLast && styles.lastCard]}>
      <View style={styles.foodInfoContainer}>
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
            isLast={index === foods.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

// BARRA COM 5 BOTÕES (Conforme o layout visual)
function BottomTabs() {
  return (
    <View style={styles.tabContainer}>
      {/* Exemplo deixando a aba Início ativa, já que Refeições não fica na tab bar */}
      <TouchableOpacity style={styles.tabActive}>
        <Feather name="home" size={20} color="#FF8C00" />
        <Text style={styles.tabTextActive}>Início</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab}>
        <Feather name="activity" size={20} color="#A0A0A0" />
        <Text style={styles.tabText}>Treinos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab}>
        <Feather name="check-circle" size={20} color="#A0A0A0" />
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
// 3. TELA PRINCIPAL
// ==========================================
export default function App() {
  const [telaAtual, setTelaAtual] = useState("PlanoAlimentar");

  const cafeDaManha = [
    { id: "1", name: "Aveia com banana", portion: "1 porção", calories: 280 },
    { id: "2", name: "Ovo mexido", portion: "2 unidades", calories: 140 },
  ];

  const almoco = [
    { id: "3", name: "Frango grelhado", portion: "150 g", calories: 250 },
    { id: "4", name: "Arroz integral", portion: "1 xícara", calories: 200 },
    { id: "5", name: "Feijão", portion: "1 concha", calories: 130 },
    { id: "6", name: "Salada verde", portion: "1 prato", calories: 100 },
  ];

  const lancheDaTarde = [
    { id: "7", name: "Iogurte natural", portion: "1 pote", calories: 120 },
    { id: "8", name: "Castanhas", portion: "15 g", calories: 90 },
  ];

  const jantar = [
    { id: "9", name: "Salmão grelhado", portion: "150 g", calories: 250 },
    { id: "10", name: "Batata doce", portion: "100 g", calories: 150 },
  ];

  if (telaAtual === "NovaRefeicao") {
    return <NovaRefeicao onVoltar={() => setTelaAtual("PlanoAlimentar")} />;
  }

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
              <Text style={styles.macroValue}>1.850</Text>
              <Text style={styles.macroLabel}>Calorias</Text>
              <Text style={styles.macroMeta}>Meta 2.000</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>180g</Text>
              <Text style={styles.macroLabel}>Proteínas</Text>
              <Text style={styles.macroMeta}>Meta 150g</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>210g</Text>
              <Text style={styles.macroLabel}>Carboidratos</Text>
              <Text style={styles.macroMeta}>Meta 220g</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>60g</Text>
              <Text style={styles.macroLabel}>Gorduras</Text>
              <Text style={styles.macroMeta}>Meta 65g</Text>
            </View>
          </View>
        </View>

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
// 4. ESTILOS
// ==========================================
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FAFAFA" },
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
  macroItem: { alignItems: "center", flex: 1 },
  macroValue: { fontSize: 16, fontWeight: "bold", color: "#333" },
  macroLabel: { fontSize: 12, color: "#666", marginTop: 2 },
  macroMeta: { fontSize: 10, color: "#A0A0A0", marginTop: 2 },
  divider: { width: 1, height: 30, backgroundColor: "#E0E0E0" },
  mealContainer: { marginBottom: 20 },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  mealTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  mealHeaderRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  mealTotal: { fontSize: 14, color: "#666" },
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  lastCard: { borderBottomWidth: 0 },
  foodInfoContainer: { flexDirection: "row", alignItems: "center" },
  foodName: { fontSize: 14, fontWeight: "600", color: "#333" },
  portion: { fontSize: 12, color: "#888", marginTop: 2 },
  calories: { fontSize: 14, fontWeight: "600", color: "#333" },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  tab: { alignItems: "center" },
  tabActive: { alignItems: "center" },
  tabText: { fontSize: 10, color: "#A0A0A0", marginTop: 4 },
  tabTextActive: {
    fontSize: 10,
    color: "#FF8C00",
    marginTop: 4,
    fontWeight: "500",
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
