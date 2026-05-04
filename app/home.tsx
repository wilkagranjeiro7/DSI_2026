import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; //
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

// Componente reutilizável para os cards menores da home
function SmallCard({
  title,
  subtitle,
  icon,
  onPress, //
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress?: () => void; //
}) {
  return (
    <TouchableOpacity
      style={styles.smallCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.smallBadge}>
        <Text style={styles.smallBadgeText}>Notificação</Text>
      </View>

      {/* Ícone principal do card */}
      <View style={styles.smallIconArea}>{icon}</View>

      <View style={styles.smallCardContent}>
        <Text style={styles.smallCardTitle}>{title}</Text>
        <Text style={styles.smallCardSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter(); // Hook para navegação do Expo Router

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

          {/* Grade com atalhos rápidos */}
          <View style={styles.grid}>
            {/* Atalho para a nova Biblioteca de Exercícios */}
            <SmallCard
              title="Biblioteca de Exercícios"
              subtitle="Veja todos os exercícios"
              onPress={() => router.push("/biblioteca")} //
              icon={
                <Ionicons
                  name="library-outline"
                  size={54}
                  color={colors.primary}
                />
              }
            />

            <SmallCard
              title="Estabelecer metas"
              subtitle="Defina objetivos de treino"
              icon={
                <Ionicons
                  name="target-outline" // Corrigido para evitar erro de tipo
                  size={54}
                  color={colors.primary}
                />
              }
            />

            <SmallCard
              title="Seu progresso"
              subtitle="Veja sua evolução"
              icon={
                <Ionicons
                  name="bar-chart-outline"
                  size={54}
                  color={colors.primary}
                />
              }
            />

            <SmallCard
              title="Treinos favoritos"
              subtitle="Acesse rapidamente"
              icon={
                <Ionicons
                  name="heart-outline"
                  size={54}
                  color={colors.primary}
                />
              }
            />
          </View>
        </ScrollView>

        {/* Barra de navegação inferior */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => router.push("/")}
          >
            <Ionicons name="home-outline" size={22} color={colors.primary} />
            <Text style={styles.tabText}>Início</Text>
          </TouchableOpacity>

          {/* Atalho também no ícone de Treinos para facilitar */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => router.push("/biblioteca")}
          >
            <MaterialCommunityIcons
              name="arm-flex-outline"
              size={22}
              color={colors.primary}
            />
            <Text style={styles.tabText}>Treinos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem}>
            <Ionicons name="list-outline" size={22} color={colors.primary} />
            <Text style={styles.tabText}>Metas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem}>
            <Ionicons
              name="settings-outline"
              size={22}
              color={colors.primary}
            />
            <Text style={styles.tabText}>Perfil</Text>
          </TouchableOpacity>
        </View>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 14,
  },
  smallCard: {
    width: "47%",
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    overflow: "hidden",
    minHeight: 210,
  },
  smallBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  smallBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  smallIconArea: {
    height: 95,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ECECF7",
  },
  smallCardContent: {
    padding: 10,
  },
  smallCardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  smallCardSubtitle: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: colors.tabBg,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 6,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 12,
    color: colors.text,
    marginTop: 2,
  },
});
