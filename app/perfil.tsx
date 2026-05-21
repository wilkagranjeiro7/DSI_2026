import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { auth, db } from "../src/utils/firebaseConfig";

const colors = {
  primary: "#F28C1B",
  background: "#FFFFFF",
  textDark: "#1E293B",
  textSoft: "#64748B",
  white: "#FFFFFF",
};

export default function PerfilScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: "",
    memberSince: "jan/2024",
    streak: "12 dias",
  });
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<string | null>(null);

  // Estados para o Controle do Registro de Sono
  const [modalSonoVisivel, setModalSonoVisivel] = useState(false);
  const [horasSono, setHorasSono] = useState("");
  const [salvandoSono, setSalvandoSono] = useState(false);

  // Novos Estados para os Modais de Biorritmo e Atividades
  const [modalBiorritmoVisivel, setModalBiorritmoVisivel] = useState(false);
  const [modalAtividadesVisivel, setModalAtividadesVisivel] = useState(false);

  // Estados Automáticos vindos do histórico de treinos
  const [treinouHoje, setTreinouHoje] = useState(false);
  const [caloriasDoTreino, setCaloriasDoTreino] = useState(0);

  // Busca dados do Firebase de forma dinâmica
  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const dadosBanco = userDoc.data();
          setUserData({
            name: dadosBanco.name || "João Silva",
            memberSince: dadosBanco.memberSince || "jan/2024",
            streak: dadosBanco.streak || "12 dias",
          });

          if (dadosBanco.horasSono) {
            setHorasSono(dadosBanco.horasSono.toString());
          }

          // Verifica de forma automática se há treino registrado para hoje
          const hoje = new Date().toISOString().split("T")[0];
          if (
            dadosBanco.ultimoTreino === hoje ||
            dadosBanco.treinouHoje === true
          ) {
            setTreinouHoje(true);
            setCaloriasDoTreino(dadosBanco.caloriasTreino || 300);
          } else {
            setTreinouHoje(false);
            setCaloriasDoTreino(0);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Salva o sono no Firebase
  const handleSalvarSono = async () => {
    if (!horasSono.trim()) {
      alert("Por favor, digite a quantidade de horas dormidas.");
      return;
    }

    try {
      setSalvandoSono(true);
      const user = auth.currentUser;

      if (user) {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, { horasSono: horasSono }, { merge: true });
      }

      alert("Horas de Sono registrada");
      setModalSonoVisivel(false);
      fetchUserData(); // Recarrega a tela para atualizar o Biorritmo na hora
    } catch (error: any) {
      console.error("Erro ao salvar sono:", error);
      alert("Erro ao salvar: " + error.message);
    } finally {
      setSalvandoSono(false);
    }
  };

  // Lógica da foto de perfil
  const escolherImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Precisamos de permissão para acessar suas fotos.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  const handleMenuPress = (label: string) => {
    if (label === "Treinos") {
      router.push("/meus-treinos"); // Corrigido para abrir a tela de fichas de treinos!
    } else if (label === "Sono") {
      setModalSonoVisivel(true);
    } else if (label === "Biorritmo") {
      setModalBiorritmoVisivel(true);
    } else if (label === "Atividades") {
      setModalAtividadesVisivel(true);
    }
  };

  // Calcula a barra de energia com base nas horas de sono
  const getPorcentagemEnergia = () => {
    const horas = parseFloat(horasSono);
    if (isNaN(horas)) return 50;
    if (horas >= 8) return 100;
    if (horas >= 6) return 75;
    return 35;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cabeçalho com Gradiente */}
        <LinearGradient
          colors={["#F28C1B", "#FFB966"]}
          style={styles.headerGradient}
        >
          <View style={styles.headerTopRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <Ionicons name="chevron-back" size={24} color={colors.textDark} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Perfil</Text>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons
                name="notifications"
                size={24}
                color={colors.textDark}
              />
            </TouchableOpacity>
          </View>

          {/* Avatar Centralizado */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              {image ? (
                <Image source={{ uri: image }} style={styles.avatarImage} />
              ) : (
                <Image
                  source={{ uri: "https://via.placeholder.com/150" }}
                  style={styles.avatarImage}
                />
              )}
              <TouchableOpacity
                style={styles.cameraBadge}
                onPress={escolherImagem}
              >
                <Ionicons name="camera" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Informações do Usuário */}
        <View style={styles.profileInfoContainer}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <>
              <Text style={styles.userName}>{userData.name}</Text>

              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={colors.textDark}
                    style={styles.statIcon}
                  />
                  <View>
                    <Text style={styles.statLabel}>Membro desde</Text>
                    <Text style={styles.statValueOrange}>
                      {userData.memberSince}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.statBox}>
                  <MaterialCommunityIcons
                    name="fire"
                    size={20}
                    color="#F28C1B"
                    style={styles.statIcon}
                  />
                  <View>
                    <Text style={styles.statLabel}>Sequência atual</Text>
                    <Text style={styles.statValueOrange}>
                      {userData.streak}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Lista de Opções do Menu */}
        <View style={styles.menuContainer}>
          {[
            { label: "Metas de hoje", icon: "target", lib: "Feather" },
            { label: "Biorritmo", icon: "heart-outline", lib: "Ionicons" },
            { label: "Atividades", icon: "run", lib: "MaterialCommunityIcons" },
            {
              label: "Treinos",
              icon: "dumbbell",
              lib: "MaterialCommunityIcons",
            },
            { label: "Sono", icon: "bed-outline", lib: "Ionicons" },
            {
              label: "Configurações",
              icon: "settings-outline",
              lib: "Ionicons",
            },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.label)}
            >
              <View style={styles.menuItemLeft}>
                {item.lib === "Feather" && (
                  <Feather
                    name={item.icon as any}
                    size={20}
                    color={colors.textDark}
                  />
                )}
                {item.lib === "Ionicons" && (
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={colors.textDark}
                  />
                )}
                {item.lib === "MaterialCommunityIcons" && (
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={20}
                    color={colors.textDark}
                  />
                )}
                <Text style={styles.menuItemLabel}>{item.label}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.textSoft}
              />
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.btnLogOut} onPress={handleSignOut}>
            <Ionicons
              name="exit-outline"
              size={20}
              color={colors.primary}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.btnLogOutText}>Sair da conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL PARA ADICIONAR HORAS DE SONO */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalSonoVisivel}
        onRequestClose={() => setModalSonoVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Registrar Sono 🛌</Text>
            <Text style={styles.modalSubtitle}>
              Quantas horas você dormiu na última noite?
            </Text>

            <TextInput
              style={styles.inputSono}
              placeholder="Ex: 6 ou 7.5"
              keyboardType="numeric"
              value={horasSono}
              onChangeText={setHorasSono}
            />

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.btnCancelar]}
                onPress={() => setModalSonoVisivel(false)}
              >
                <Text style={styles.btnTextCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.btnSalvar]}
                onPress={handleSalvarSono}
                disabled={salvandoSono}
              >
                {salvandoSono ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.btnTextSalvar}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL DO BIORRITMO AUTOMÁTICO */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalBiorritmoVisivel}
        onRequestClose={() => setModalBiorritmoVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Seu Biorritmo 🧬</Text>
            <Text style={styles.modalSubtitle}>
              Nível de energia atual baseado nos seus dados:
            </Text>

            {/* Barra de Energia Física baseada no Sono */}
            <View style={styles.biorritmoBlock}>
              <Text style={styles.biorritmoLabel}>
                ⚡ Energia Física ({getPorcentagemEnergia()}%)
              </Text>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${getPorcentagemEnergia()}%` },
                  ]}
                />
              </View>
            </View>

            {/* Barra de Recuperação Muscular MUDANDO SOZINHA se treinou hoje */}
            <View style={styles.biorritmoBlock}>
              <Text style={styles.biorritmoLabel}>
                💪 Recuperação Muscular ({treinouHoje ? "40%" : "100%"})
              </Text>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: treinouHoje ? "40%" : "100%",
                      backgroundColor: treinouHoje ? "#EF4444" : "#10B981",
                    },
                  ]}
                />
              </View>
            </View>

            <Text style={styles.biorritmoDica}>
              {treinouHoje
                ? "🧘 Você já treinou hoje! Seus músculos estão em processo de reconstrução. Hora de descansar e comer bem."
                : "🔥 Nenhum treino pesado detectado hoje ainda. Ótimo momento para ir queimar calorias!"}
            </Text>

            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.btnSalvar,
                { width: "100%", marginTop: 10 },
              ]}
              onPress={() => setModalBiorritmoVisivel(false)}
            >
              <Text style={{ color: colors.white, fontWeight: "600" }}>
                Entendido
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL DE ATIVIDADES AUTOMÁTICO */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalAtividadesVisivel}
        onRequestClose={() => setModalAtividadesVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Suas Atividades Extra 🏃‍♀️</Text>
            <Text style={styles.modalSubtitle}>
              Resumo de movimentação física geral de hoje:
            </Text>

            {/* Card de Treinos Concluídos Puxando Dados */}
            <View
              style={[
                styles.atividadeItemCard,
                {
                  backgroundColor: treinouHoje ? "#ECFDF5" : "#FFF7ED",
                  borderColor: treinouHoje ? "#A7F3D0" : "#FFEDD5",
                },
              ]}
            >
              <MaterialCommunityIcons
                name="dumbbell"
                size={24}
                color={treinouHoje ? "#10B981" : colors.primary}
              />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.atividadeTitle}>
                  Musculação / Exercícios
                </Text>
                <Text style={styles.atividadeSub}>
                  {treinouHoje
                    ? `✅ Feito hoje (+${caloriasDoTreino} kcal)`
                    : "❌ Nenhum exercício feito hoje"}
                </Text>
              </View>
            </View>

            <View style={styles.atividadeItemCard}>
              <MaterialCommunityIcons
                name="walk"
                size={24}
                color={colors.primary}
              />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.atividadeTitle}>Passos do Dia</Text>
                <Text style={styles.atividadeSub}>
                  {treinouHoje
                    ? "8.210 / 10.000 passos"
                    : "2.120 / 10.000 passos"}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.btnCancelar,
                { width: "100%", marginTop: 15 },
              ]}
              onPress={() => setModalAtividadesVisivel(false)}
            >
              <Text style={{ color: colors.textDark, fontWeight: "600" }}>
                Fechar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: colors.textDark },
  avatarContainer: { alignItems: "center", marginTop: 20 },
  avatarWrapper: { position: "relative" },
  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: colors.white,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 4,
    backgroundColor: colors.white,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  profileInfoContainer: {
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  statBox: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  statIcon: { marginRight: 8 },
  statLabel: { fontSize: 12, color: colors.textSoft },
  statValueOrange: { fontSize: 13, fontWeight: "700", color: "#EA580C" },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 15,
  },
  menuContainer: { paddingHorizontal: 20, marginTop: 25 },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFedd5",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  menuItemLeft: { flexDirection: "row", alignItems: "center" },
  menuItemLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    marginLeft: 12,
  },
  btnLogOut: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFedd5",
    borderRadius: 12,
    height: 50,
    marginTop: 15,
    marginBottom: 30,
  },
  btnLogOutText: { color: "#EA580C", fontWeight: "600", fontSize: 15 },

  // Estilos Gerais dos Modais
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: colors.white,
    width: "85%",
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textDark,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    color: colors.textSoft,
    textAlign: "center",
    marginBottom: 16,
  },
  modalButtonsRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnCancelar: { marginRight: 8, borderWidth: 1, borderColor: "#CBD5E1" },
  btnSalvar: { marginLeft: 8, backgroundColor: colors.primary },
  btnTextCancelar: { color: colors.textSoft, fontWeight: "600" },
  btnTextSalvar: { color: colors.white, fontWeight: "600" },

  // Estilos do Modal de Sono
  inputSono: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },

  // Estilos Exclusivos do Modal do Biorritmo
  biorritmoBlock: { width: "100%", marginBottom: 14 },
  biorritmoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textDark,
    marginBottom: 6,
  },
  barContainer: {
    width: "100%",
    height: 12,
    backgroundColor: "#E2E8F0",
    borderRadius: 6,
    overflow: "hidden",
  },
  barFill: { height: "100%", backgroundColor: colors.primary, borderRadius: 6 },
  biorritmoDica: {
    fontSize: 13,
    color: "#EA580C",
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 12,
    paddingHorizontal: 4,
  },

  // Estilos Exclusivos do Modal de Atividades (Vírgula adicionada na linha abaixo!)
  atividadeItemCard: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FFEDD5",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  atividadeTitle: { fontSize: 14, fontWeight: "bold", color: colors.textDark },
  atividadeSub: { fontSize: 12, color: colors.textSoft, marginTop: 2 },
});
