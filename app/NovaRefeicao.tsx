import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface NovaRefeicaoProps {
  onVoltar: () => void;
}

export default function NovaRefeicao({ onVoltar }: NovaRefeicaoProps) {
  return (
    <SafeAreaView style={styles.container}>
      {/* 1. CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onVoltar}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova refeição</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 2. TIPO DE REFEIÇÃO */}
        <Text style={styles.sectionTitle}>Tipo de refeição</Text>
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[styles.segmentBtn, styles.segmentBtnActive]}
          >
            <Text style={styles.segmentTextActive}>Café da manhã</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.segmentBtn}>
            <Text style={styles.segmentText}>Almoço</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.segmentBtn}>
            <Text style={styles.segmentText}>Lanche</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentBtn, { borderRightWidth: 0 }]}
          >
            <Text style={styles.segmentText}>Jantar</Text>
          </TouchableOpacity>
        </View>

        {/* 3. NOME DA REFEIÇÃO */}
        <Text style={styles.sectionTitle}>Nome da refeição</Text>
        <TextInput
          style={styles.input}
          placeholder="Minha refeição"
          defaultValue="Minha refeição"
        />

        {/* 4. BUSCAR ALIMENTOS */}
        <Text style={styles.sectionTitle}>Adicionar alimentos</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar alimento"
            placeholderTextColor="#A0A0A0"
          />
          <Feather name="search" size={20} color="#888" />
        </View>

        {/* 5. LISTA PARA ADICIONAR (+) */}
        <View style={styles.listContainer}>
          <View style={styles.foodItemRow}>
            <View>
              <Text style={styles.foodName}>Frango grelhado</Text>
              <Text style={styles.foodDetails}>165 kcal / 100g</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Feather name="plus" size={18} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.foodItemRow}>
            <View>
              <Text style={styles.foodName}>Arroz integral</Text>
              <Text style={styles.foodDetails}>111 kcal / 100g</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Feather name="plus" size={18} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.foodItemRow}>
            <View>
              <Text style={styles.foodName}>Feijão carioca</Text>
              <Text style={styles.foodDetails}>76 kcal / 100g</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Feather name="plus" size={18} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.foodItemRow}>
            <View>
              <Text style={styles.foodName}>Batata doce cozida</Text>
              <Text style={styles.foodDetails}>86 kcal / 100g</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Feather name="plus" size={18} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.foodItemRow}>
            <View>
              <Text style={styles.foodName}>Ovo cozido</Text>
              <Text style={styles.foodDetails}>78 kcal / unidade</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Feather name="plus" size={18} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={[styles.foodItemRow, { borderBottomWidth: 0 }]}>
            <View>
              <Text style={styles.foodName}>Abacate</Text>
              <Text style={styles.foodDetails}>160 kcal / 100g</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Feather name="plus" size={18} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 6. ITENS JÁ ADICIONADOS (LIXEIRA) */}
        <Text style={styles.sectionTitle}>Itens adicionados</Text>
        <View style={styles.listContainer}>
          <View style={styles.addedItemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.foodName}>Frango grelhado</Text>
              <Text style={styles.foodDetails}>150 g</Text>
            </View>
            <Text style={styles.addedCalories}>248 kcal</Text>
            <TouchableOpacity style={styles.trashButton}>
              <Feather name="trash-2" size={16} color="#FF3B30" />
            </TouchableOpacity>
          </View>

          <View style={styles.addedItemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.foodName}>Arroz integral</Text>
              <Text style={styles.foodDetails}>1 xícara</Text>
            </View>
            <Text style={styles.addedCalories}>200 kcal</Text>
            <TouchableOpacity style={styles.trashButton}>
              <Feather name="trash-2" size={16} color="#FF3B30" />
            </TouchableOpacity>
          </View>

          <View style={[styles.addedItemRow, { borderBottomWidth: 0 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.foodName}>Salada verde</Text>
              <Text style={styles.foodDetails}>1 prato</Text>
            </View>
            <Text style={styles.addedCalories}>100 kcal</Text>
            <TouchableOpacity style={styles.trashButton}>
              <Feather name="trash-2" size={16} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 7. RODAPÉ */}
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total da refeição</Text>
            <Text style={styles.totalValue}>548 kcal</Text>
          </View>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Salvar refeição</Text>
          </TouchableOpacity>
        </View>

        {/* Espaço para não cortar o final na rolagem */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* 8. BARRA DE NAVEGAÇÃO INFERIOR COM OS 6 BOTÕES */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tab}>
          <Feather name="home" size={22} color="#A0A0A0" />
          <Text style={styles.tabText}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <MaterialCommunityIcons name="dumbbell" size={22} color="#A0A0A0" />
          <Text style={styles.tabText}>Treinos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <Feather name="target" size={22} color="#A0A0A0" />
          <Text style={styles.tabText}>Metas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <Feather name="map" size={22} color="#A0A0A0" />
          <Text style={styles.tabText}>Mapa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabActive}>
          <MaterialCommunityIcons
            name="silverware-fork-knife"
            size={22}
            color="#FF8C00"
          />
          <Text style={styles.tabTextActive}>Refeições</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <Feather name="user" size={22} color="#A0A0A0" />
          <Text style={styles.tabText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 12,
  },
  segmentedControl: {
    flexDirection: "row",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFF",
    overflow: "hidden",
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
  },
  segmentBtnActive: {
    backgroundColor: "#FF8C00",
  },
  segmentText: {
    fontSize: 12,
    color: "#888",
  },
  segmentTextActive: {
    fontSize: 12,
    color: "#FFF",
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 15,
    fontSize: 14,
    color: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 24,
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
  },
  listContainer: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 15,
  },
  foodItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  foodName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  foodDetails: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  addedItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  addedCalories: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginRight: 15,
  },
  trashButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFD1D1",
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    marginTop: 25,
    backgroundColor: "#FFF5EB",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FFE4CC",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#FF8C00",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
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
});
// ... (mantenha os imports e o resto do código)

function BottomTabs() {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity style={styles.tab}>
        <Feather name="home" size={20} color="#A0A0A0" />
        <Text style={styles.tabText}>Início</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab}>
        <MaterialCommunityIcons name="dumbbell" size={20} color="#A0A0A0" />
        <Text style={styles.tabText}>Treinos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab}>
        <Feather name="target" size={20} color="#A0A0A0" />
        <Text style={styles.tabText}>Metas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab}>
        <Feather name="map" size={20} color="#A0A0A0" />
        <Text style={styles.tabText}>Mapa</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabActive}>
        <MaterialCommunityIcons name="silverware-fork-knife" size={20} color="#FF8C00" />
        <Text style={styles.tabTextActive}>Refeições</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab}>
        <Feather name="user" size={20} color="#A0A0A0" />
        <Text style={styles.tabText}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

// ... (não esqueça de adicionar <BottomTabs /> dentro da sua view principal no NovaRefeicao)
