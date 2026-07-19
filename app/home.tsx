import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { onAuthStateChanged, Unsubscribe, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { Component, ReactNode } from "react";
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

class HomeColors {
  static primary = "#F28C1B";
  static primaryDark = "#D97706";
  static background = "#F3F4F6";
  static card = "#F1F1FB";
  static white = "#FFFFFF";
  static text = "#111827";
  static textSoft = "#8E8EA0";
  static border = "#F28C1B";
  static tabBg = "#FFFFFF";
}

interface HomeUserProfile {
  userName: string;
  userPhoto: string | null;
}

class HomeUserReader {
  async read(user: User): Promise<HomeUserProfile> {
    let nomeExibicao = user.displayName || "Usuario";
    let userPhoto: string | null = null;

    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (userDoc.exists()) {
      const dados = userDoc.data();
      if (dados.nome) {
        nomeExibicao = dados.nome;
      } else if (dados.name) {
        nomeExibicao = dados.name;
      }

      if (dados.photoUrl) {
        userPhoto = `${dados.photoUrl}?t=${Date.now()}`;
      }
      return { userName: nomeExibicao, userPhoto };
    }

    const perfilDoc = await getDoc(doc(db, "perfis", user.uid));
    if (perfilDoc.exists()) {
      const dadosPerfil = perfilDoc.data();
      if (dadosPerfil.nome) {
        nomeExibicao = dadosPerfil.nome;
      }
      if (dadosPerfil.photoUrl) {
        userPhoto = `${dadosPerfil.photoUrl}?t=${Date.now()}`;
      }
    }
    return { userName: nomeExibicao, userPhoto };
  }
}

interface SmallCardProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  onPress?: () => void;
}

class SmallCard extends Component<SmallCardProps> {
  render() {
    const { title, subtitle, icon, onPress } = this.props;
    return (
      <TouchableOpacity
        style={styles.smallCard}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.smallBadge}>
          <Text style={styles.smallBadgeText}>Notificacao</Text>
        </View>
        <View style={styles.smallIconArea}>{icon}</View>
        <View style={styles.smallCardContent}>
          <Text style={styles.smallCardTitle}>{title}</Text>
          <Text style={styles.smallCardSubtitle}>{subtitle}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

interface HomeState {
  userName: string;
  userPhoto: string | null;
  loadingName: boolean;
  toastVisivel: boolean;
  toastMensagem: string;
}

export default class HomeScreen extends Component<object, HomeState> {
  private readonly userReader = new HomeUserReader();
  private unsubscribeAuth?: Unsubscribe;
  private toastTimer?: ReturnType<typeof setTimeout>;

  state: HomeState = {
    userName: "",
    userPhoto: null,
    loadingName: true,
    toastVisivel: false,
    toastMensagem: "",
  };

  componentDidMount() {
    this.unsubscribeAuth = onAuthStateChanged(auth, this.handleAuthState);
  }

  componentWillUnmount() {
    this.unsubscribeAuth?.();
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }

  private handleAuthState = async (user: User | null) => {
    if (!user) {
      this.setState({ loadingName: false });
      return;
    }
    try {
      const profile = await this.userReader.read(user);
      this.setState(profile);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      this.setState({ loadingName: false });
    }
  };

  private mostrarAvisoDiscreto = (mensagem: string) => {
    this.setState({ toastMensagem: mensagem, toastVisivel: true });
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.setState({ toastVisivel: false });
    }, 2500);
  };

  private handleSignOut = async () => {
    try {
      this.mostrarAvisoDiscreto("Saindo da conta...");
      setTimeout(async () => {
        await auth.signOut();
        router.replace("/login");
      }, 1000);
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  private renderAvatar() {
    const { userPhoto } = this.state;
    return (
      <TouchableOpacity
        onPress={() => router.push("/perfil")}
        activeOpacity={0.8}
      >
        {userPhoto ? (
          <Image source={{ uri: userPhoto }} style={styles.avatar} />
        ) : (
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: "#D8D8EE",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <Ionicons name="person" size={20} color={HomeColors.textSoft} />
          </View>
        )}
      </TouchableOpacity>
    );
  }

  render() {
    const { userName, loadingName, toastVisivel, toastMensagem } = this.state;

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialCommunityIcons
                name="dumbbell"
                size={24}
                color={HomeColors.white}
                style={{ marginLeft: 12 }}
              />
              <Text style={styles.headerTitle}>FitMatch</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={this.handleSignOut}>
                <Feather name="log-out" size={20} color={HomeColors.white} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.greetingRow}>
              {this.renderAvatar()}
              <View style={{ marginLeft: 12 }}>
                {loadingName ? (
                  <ActivityIndicator size="small" color={HomeColors.primary} />
                ) : (
                  <Text style={styles.greetingTitle}>Olá, {userName}!</Text>
                )}
                <Text style={styles.greetingSubtitle}>
                  Bem vinda ao FitMatch
                </Text>
              </View>
            </View>

            {/* Card Principal */}
            <View style={styles.mainCard}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Notificacao</Text>
              </View>
              <Text style={styles.mainCardTitle}>Seu treino de hoje</Text>
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>Aquecimento</Text>
                <Text style={styles.sectionText}>2 min de polichinelos</Text>
              </View>
              <TouchableOpacity style={styles.mainButton}>
                <Text style={styles.mainButtonText}>Iniciar treino</Text>
              </TouchableOpacity>
              <View style={styles.recentArea}>
                <Text style={styles.recentLabel}>Atividade recente</Text>
                <Text style={styles.recentDate}>Maio 04, 2026</Text>
              </View>
            </View>

            {/* Grid de Cards */}
            <View style={styles.grid}>
              <SmallCard
                title="Locais para treinar"
                subtitle="Encontre locais próximos"
                onPress={() => router.push("/locais")}
                icon={
                  <Ionicons
                    name="map-outline"
                    size={54}
                    color={HomeColors.primary}
                  />
                }
              />
              <SmallCard
                title="Estabelecer metas"
                subtitle="Defina objetivos de treino"
                onPress={() => router.push("/metas")}
                icon={
                  <Feather name="target" size={54} color={HomeColors.primary} />
                }
              />
              <SmallCard
                title="Refeições / Plano Alimentar"
                subtitle="Acompanhe sua alimentação"
                onPress={() => router.push("/plano-alimentar")}
                icon={
                  <Ionicons
                    name="nutrition-outline"
                    size={54}
                    color={HomeColors.primary}
                  />
                }
              />
              <SmallCard
                title="Dicas e bem-estar"
                subtitle="Cuide da sua saúde"
                onPress={() => router.push("/dicas")}
                icon={
                  <Ionicons
                    name="body-outline"
                    size={54}
                    color={HomeColors.primary}
                  />
                }
              />
            </View>
          </ScrollView>

          <BottomNavbar active="home" />
        </View>

        {toastVisivel && (
          <View style={styles.toastCard}>
            <Ionicons
              name="information-circle"
              size={20}
              color={HomeColors.primary}
            />
            <Text style={styles.toastText}>{toastMensagem}</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: HomeColors.primary },
  container: { flex: 1, backgroundColor: HomeColors.background },
  header: {
    backgroundColor: HomeColors.primary,
    height: 64,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  headerTitle: {
    color: HomeColors.white,
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
    borderColor: HomeColors.primary,
  },
  greetingTitle: { fontSize: 24, fontWeight: "700", color: HomeColors.text },
  greetingSubtitle: { fontSize: 15, color: HomeColors.textSoft, marginTop: 2 },
  mainCard: {
    backgroundColor: HomeColors.card,
    borderWidth: 1.5,
    borderColor: HomeColors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: HomeColors.primary,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: -14,
    marginLeft: -14,
    marginBottom: 12,
  },
  badgeText: { color: HomeColors.white, fontSize: 13, fontWeight: "600" },
  mainCardTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: HomeColors.text,
    marginBottom: 16,
  },
  sectionBlock: { marginBottom: 14 },
  sectionTitle: { fontSize: 22, fontWeight: "700", color: HomeColors.text },
  sectionText: { fontSize: 18, color: HomeColors.text },
  mainButton: {
    alignSelf: "center",
    backgroundColor: HomeColors.primary,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 8,
  },
  mainButtonText: { color: HomeColors.white, fontSize: 16, fontWeight: "700" },
  recentArea: { marginTop: 6 },
  recentLabel: { fontSize: 15, color: HomeColors.text },
  recentDate: { fontSize: 18, fontWeight: "500", color: HomeColors.text },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 14,
  },
  smallCard: {
    width: "47%",
    backgroundColor: HomeColors.card,
    borderWidth: 1.5,
    borderColor: HomeColors.border,
    borderRadius: 10,
    overflow: "hidden",
    minHeight: 210,
  },
  smallBadge: {
    alignSelf: "flex-start",
    backgroundColor: HomeColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  smallBadgeText: { color: HomeColors.white, fontSize: 12, fontWeight: "600" },
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
    color: HomeColors.text,
    marginBottom: 4,
  },
  smallCardSubtitle: { fontSize: 14, color: HomeColors.text, lineHeight: 20 },
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
    zIndex: 9999,
  },
  toastText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 10,
  },
});
