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
  emoji?: string;
  iconColor?: string;
  isLast?: boolean;
}

interface FoodItem {
  id: string;
  name: string;
  portion: string;
  calories: number;
  emoji?: string;
  iconColor?: string;
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

function FoodCard({
  name,
  portion,
  calories,
  emoji = "🍲",
  iconColor = "#FFF0E6",
  isLast = false,
}: FoodCardProps) {
  return (
    <View style={[styles.foodCard, isLast && styles.lastCard]}>
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
          <TouchableOpacity style={styles.addMealButton} onPress={onAddPress}>
            <Feather name="plus" size={18} color="#000" />
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
            emoji={food.emoji}
            iconColor={food.iconColor}
            isLast={index === foods.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

// BARRA COM 5 BOTÕES (Idêntica à imagem)
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
// 3. TELA PRINCIPAL
// ==========================================
export default function App() {
  const [telaAtual, setTelaAtual] = useState("PlanoAlimentar");

  const cafeDaManha = [
    {
      id: "1",
      name: "Aveia com banana",
      portion: "1 porção",
      calories: 280,
      emoji: "🥣",
      iconColor: "#FFF0F0",
    },
    {
      id: "2",
      name: "Ovo mexido",
      portion: "2 unidades",
      calories: 140,
      emoji: "🥚",
      iconColor: "#FFF9E6",
    },
  ];

  const almoco = [
    {
      id: "3",
      name: "Frango grelhado",
      portion: "150 g",
      calories: 250,
      emoji: "🍗",
      iconColor: "#FFF0E6",
    },
    {
      id: "4",
      name: "Arroz integral",
      portion: "1 xícara",
      calories: 200,
      emoji: "🍚",
      iconColor: "#FFF4E6",
    },
    {
      id: "5",
      name: "Feijão",
      portion: "1 concha",
      calories: 130,
      emoji: "🧆",
      iconColor: "#FFF4E6",
    },
    {
      id: "6",
      name: "Salada verde",
      portion: "1 prato",
      calories: 100,
      emoji: "🥬",
      iconColor: "#E6F4EA",
    },
  ];

  const lancheDaTarde = [
    {
      id: "7",
      name: "Iogurte natural",
      portion: "1 pote",
      calories: 120,
      emoji: "🥛",
      iconColor: "#F3E8FF",
    },
    {
      id: "8",
      name: "Castanhas",
      portion: "15 g",
      calories: 90,
      emoji: "🥜",
      iconColor: "#FFF0E6",
    },
  ];

  const jantar = [
    {
      id: "9",
      name: "Salmão grelhado",
      portion: "150 g",
      calories: 250,
      emoji: "🍣",
      iconColor: "#FFF0E6",
    },
    {
      id: "10",
      name: "Batata doce",
      portion: "100 g",
      calories: 150,
      emoji: "🍠",
      iconColor: "#FFF0E6",
    },
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

        {/* Caixa de Resumo com as Barras de Progresso */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Resumo do dia</Text>
          <View style={styles.macrosContainer}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>1.850</Text>
              <Text style={styles.macroLabel}>Calorias</Text>
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: "92%", backgroundColor: "#FF8C00" },
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

        {/* Mantive o jantar e o botão no final para você poder testar a tela toda, 
            mesmo que na imagem corte no lanche da tarde */}
        <MealSection
          title="Jantar"
          totalCalories={400}
          foods={jantar}
          onAddPress={() => setTelaAtual("NovaRefeicao")}
        />

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
});
