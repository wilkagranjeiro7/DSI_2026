import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth"; // Escutador de sessão dinâmica
import { doc, getDoc } from "firebase/firestore";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BottomNavbar from "../src/components/BottomNavbar";
import { auth, db } from "../src/utils/firebaseConfig";

// Paleta de cores oficial do FitMatch
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

function SmallCard({
  title,
  subtitle,
  icon,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress?: () => void;
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

      <View style={styles.smallIconArea}>{icon}</View>

      <View style={styles.smallCardContent}>
        <Text style={styles.smallCardTitle}>{title}</Text>
        <Text style={styles.smallCardSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>(""); 
  const [userPhoto, setUserPhoto] = useState<string | null>(null); // Armazena a foto do Supabase carregada do Firestore
  const [loadingName, setLoadingName] = useState<boolean>(true); 

  // 📝 ESTADOS PARA O TOAST CARD (AVISO DISCRETO NA HOME)
  const [toastVisivel, setToastVisivel] = useState(false);
  const [toastMensagem, setToastMensagem] = useState("");

  const mostrarAvisoDiscreto = (mensagem: string) => {
    setToastMensagem(mensagem);
    setToastVisivel(true);
    setTimeout(() => {
      setToastVisivel(false);
    }, 2500);
  };

  // 🔥 Escutador dinâmico: Atualiza os dados toda vez que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            let nomeExibicao = user.displayName || "Usuário";
            
            if (userDoc.exists()) {
              const dados = userDoc.data();
              if (dados.name) nomeExibicao = dados.name;
              
              // Recarrega a foto quebrando o cache com o timestamp atualizado
              if (dados.photoUrl) {
                setUserPhoto(`${dados.photoUrl}?t=${new Date().getTime()}`);
              } else {
                setUserPhoto(null);
              }
            }
            setUserName(nomeExibicao);
          } catch (error) {
            console.error("Erro ao buscar dados dinâmicos do usuário:", error);
          } finally {
            setLoadingName(false);
          }
        } else {
          setLoadingName(false);
        }
      });

      // Limpeza correta da inscrição ao perder o foco da tela
      return () => unsubscribe();
    }, [])
  );

  const handleSignOut = async () => {
    try {
      mostrarAvisoDiscreto("Saindo da conta... Até logo! 👋");
      // Aguarda 1 segundo para o usuário ler a mensagem antes de ir para o login
      setTimeout(async () => {
        await auth.signOut();
        router.replace("/login");
      }, 1000);
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color={colors.white} />
            </TouchableOpacity>
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
            <TouchableOpacity onPress={handleSignOut}>
              <Feather
                name="log-out"
                size={20}
                color={colors.white}
                style={{ marginLeft: 14 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Área de saudação dinâmica com foto real integrada */}
          <View style={styles.greetingRow}>
            <TouchableOpacity
              onPress={() => router.push("/perfil")}
              activeOpacity={0.8}
            >
              {userPhoto ? (
                <Image source={{ uri: userPhoto }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, { backgroundColor: "#D8D8EE", alignItems: 'center', justifyContent: 'center' }]}>
                  <Ionicons name="person" size={20} color={colors.textSoft} />
                </View>
              )}
            </TouchableOpacity>
            
            <View style={{ marginLeft: 12 }}>
              {loadingName ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={styles.greetingTitle}>
                  Olá, {userName}!
                </Text>
              )}
              <Text style={styles.greetingSubtitle}>Bem vinda ao FitMatch</Text>
            </View>
          </View>

          {/* Card principal com resumo do treino */}
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

            <TouchableOpacity style={styles.mainButton}>
              <Text style={styles.mainButtonText}>Iniciar treino</Text>
            </TouchableOpacity>

            <View style={styles.recentArea}>
              <Text style={styles.recentLabel}>Atividade recente</Text>
              <Text style={styles.recentDate}>Maio 04, 2026</Text>
            </View>
          </View>

          {/* Grade com atalhos rápidos */}
          <View style={styles.grid}>
            <SmallCard
              title="Biblioteca de Exercícios"
              subtitle="Veja todos os exercícios"
              onPress={() => router.push("/meus-exercicios")}
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
              icon={<Feather name="target" size={54} color={colors.primary} />}
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
        <BottomNavbar active="home" />
      </View>

      {/* 🌟 COMPONENTE DO CARD DE AVISO DISCRETO (TOAST DA HOME) */}
      {toastVisivel && (
        <View style={styles.toastCard}>
          <Ionicons name="information-circle" size={20} color={colors.primary} />
          <Text style={styles.toastText}>{toastMensagem}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary },
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary,
    height: 64,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  headerTitle: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "700",
    marginLeft: 12,
  },
  scrollContent: { padding: 16, paddingBottom: 110 }, 
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 18,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  greetingTitle: { fontSize: 24, fontWeight: "700", color: colors.text },
  greetingSubtitle: { fontSize: 15, color: colors.textSoft, marginTop: 2 },
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
  badgeText: { color: colors.white, fontSize: 13, fontWeight: "600" },
  mainCardTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
  },
  sectionBlock: { marginBottom: 14 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 2,
  },
  sectionText: { fontSize: 18, color: colors.text, lineHeight: 24 },
  mainButton: {
    alignSelf: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  mainButtonText: { color: colors.white, fontSize: 16, fontWeight: "700" },
  recentArea: { marginTop: 6 },
  recentLabel: { fontSize: 15, color: colors.text, marginBottom: 4 },
  recentDate: { fontSize: 18, fontWeight: "500", color: colors.text },
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
  smallBadgeText: { color: colors.white, fontSize: 12, fontWeight: "600" },
  smallIconArea: {
    height: 95,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ECECF7",
  },
  smallCardContent: { padding: 10 },
  smallCardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  smallCardSubtitle: { fontSize: 14, color: colors.text, lineHeight: 20 },
  toastCard: {
    position: "absolute",
    bottom: 100, 
    left: 20,
    right: 20,
    backgroundColor: "#1E293B", 
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 9999,
  },
  toastText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 10,
  },
});