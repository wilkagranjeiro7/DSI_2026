import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Paleta de cores usada na tela inicial
const colors = {
  primary: "#F28C1B",
  primaryDark: "#D97706",
  background: "#F3F4F6",
  card: "#F1F1FB",
  white: "#FFFFFF",
  text: "#111827",
  textSoft: "#8E8EA0",
  border: "#F28C1B",
  tabBg: "#FFFFFF",
};

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Cabeçalho principal da tela */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
            <MaterialCommunityIcons
              name="dumbbell"
              size={24}
              color={colors.white}
              style={{ marginLeft: 12 }}
            />
            <Text style={styles.headerTitle}>FitMatch</Text>
          </View>

          <View style={styles.headerRight}>
            <Feather name="help-circle" size={20} color={colors.white} />
            <Feather
              name="log-out"
              size={20}
              color={colors.white}
              style={{ marginLeft: 14 }}
            />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Área de saudação do usuário */}
          <View style={styles.greetingRow}>
            <View style={styles.avatar} />
            <View>
              <Text style={styles.greetingTitle}>Olá, Ana!</Text>
              <Text style={styles.greetingSubtitle}>Bem vinda ao FitMatch</Text>
            </View>
          </View>

          {/* Card principal com resumo do treino do dia */}
          <View style={styles.mainCard}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Notificação</Text>
            </View>

            <Text style={styles.mainCardTitle}>Seu treino de hoje</Text>

            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Aquecimento</Text>
              <Text style={styles.sectionText}>2 min de polichinelos</Text>
            </View>

            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Alongamento</Text>
              <Text style={styles.sectionText}>5 min de alongamento</Text>
            </View>

            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Treino</Text>
              <Text style={styles.sectionText}>3x flexão</Text>
              <Text style={styles.sectionText}>3x agachamento</Text>
            </View>

            {/* Botão para iniciar o treino */}
            <TouchableOpacity style={styles.mainButton}>
              <Text style={styles.mainButtonText}>Iniciar treino</Text>
            </TouchableOpacity>

            <View style={styles.recentArea}>
              <Text style={styles.recentLabel}>Atividade recente</Text>
              <Text style={styles.recentDate}>Abril 15, 2026</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    height: 64,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "700",
    marginLeft: 12,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 18,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#D8D8EE",
    marginRight: 12,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  greetingSubtitle: {
    fontSize: 15,
    color: colors.textSoft,
    marginTop: 2,
  },
  mainCard: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: -14,
    marginLeft: -14,
    marginBottom: 12,
  },
  badgeText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "600",
  },
  mainCardTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
  },
  sectionBlock: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 2,
  },
  sectionText: {
    fontSize: 18,
    color: colors.text,
    lineHeight: 24,
  },
  mainButton: {
    alignSelf: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  mainButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  recentArea: {
    marginTop: 6,
  },
  recentLabel: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 4,
  },
  recentDate: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.text,
  },
});