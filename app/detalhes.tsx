import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
// Importações do Firebase mantidas
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../src/utils/firebaseConfig";

// SUA BIBLIOTECA DE TREINO ESTÁ DE VOLTA AQUI!
const obterInstrucoesDetalhadas = (nome: string) => {
  const nomeLower = nome.toLowerCase();

  if (nomeLower.includes("supino")) {
    return {
      passos: [
        "Deite-se no banco com os pés bem firmes no solo.",
        "Segure a barra com as mãos um pouco mais afastadas que os ombros.",
        "Desça a barra de forma controlada até tocar levemente o peito.",
        "Empurre para cima estendendo os braços, sem travar os cotovelos.",
      ],
      musculos: ["Peitoral Maior", "Tríceps", "Deltoide Anterior"],
    };
  }
  if (nomeLower.includes("puxada") || nomeLower.includes("pulldown")) {
    return {
      passos: [
        "Ajuste o rolo do aparelho para travar bem as suas coxas.",
        "Segure a barra com os braços esticados e tronco levemente inclinado.",
        "Puxe a barra em direção ao peito, esmagando as costas.",
        "Retorne subindo os braços devagar, controlando o peso.",
      ],
      musculos: ["Dorsal (Costas)", "Bíceps", "Trapézio"],
    };
  }
  if (nomeLower.includes("agachamento")) {
    return {
      passos: [
        "Pés na largura dos ombros, apontando levemente para fora.",
        "Desça jogando o quadril para trás, como se fosse sentar.",
        "Mantenha o peito aberto e o abdômen contraído.",
        "Suba empurrando o chão com os calcanhares.",
      ],
      musculos: ["Quadríceps", "Glúteos", "Posterior"],
    };
  }
  return {
    passos: [
      "Prepare o posicionamento inicial mantendo a coluna ereta.",
      "Execute o movimento principal focando na contração muscular.",
      "Retorne à posição inicial segurando o peso de forma controlada.",
    ],
    musculos: ["Músculo Principal"],
  };
};

export default function DetalhesExercicioScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const nomeExercicio = (params.nome as string) || "Exercício";
  const grupoMuscular = (params.grupo as string) || "Geral";
  const instrucoesBase =
    (params.instrucoes as string) ||
    "Siga o passo a passo abaixo para a execução correta.";
  const seriesFixas = (params.seriesRep as string) || "4 séries • 12 rep";

  // Usando a biblioteca de volta
  const detalhesDinamicos = obterInstrucoesDetalhadas(nomeExercicio);

  const [tempo, setTempo] = useState<number>(60);
  const [ativo, setAtivo] = useState<boolean>(false);
  const [salvando, setSalvando] = useState<boolean>(false);

  useEffect(() => {
    let intervalo: any = null;
    if (ativo && tempo > 0) {
      intervalo = setInterval(() => {
        setTempo((t) => t - 1);
      }, 1000);
    } else if (tempo === 0) {
      setAtivo(false);
      clearInterval(intervalo);
    }
    return () => clearInterval(intervalo);
  }, [ativo, tempo]);

  const handleConcluirExercicio = async () => {
    try {
      setSalvando(true);
      const user = auth.currentUser;

      if (user) {
        const hoje = new Date().toISOString().split("T")[0];
        const userRef = doc(db, "users", user.uid);

        await setDoc(
          userRef,
          {
            ultimoTreino: hoje,
            treinouHoje: true,
            caloriasTreino: 120,
          },
          { merge: true },
        );

        alert(`Exercício "${nomeExercicio}" marcado como feito! 🔥🏃‍♀️`);
        router.back();
      } else {
        alert("Nenhum usuário detectado para salvar o exercício.");
      }
    } catch (error: any) {
      console.error("Erro ao salvar conclusão do exercício:", error);
      alert("Erro ao salvar: " + error.message);
    } finally {
      setSalvando(false);
    }
  };

  const formatarTempo = (segundos: number): string => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins}:${segs < 10 ? "0" : ""}${segs}`;
  };

  const aumentarTempo = () => setTempo((t) => t + 15);
  const diminuirTempo = () => setTempo((t) => (t - 15 < 0 ? 0 : t - 15));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerLaranja}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do exercício</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Box Grande do Halter */}
        <View style={styles.bigHalterContainer}>
          <View style={styles.bigHalterBox}>
            <MaterialCommunityIcons name="dumbbell" size={64} color="#FFF" />
          </View>
          <Text style={styles.exerciseNameText}>{nomeExercicio}</Text>
          <Text style={styles.exerciseGroupText}>{grupoMuscular}</Text>
        </View>

        {/* Grid de Estatísticas e Temporizador */}
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Ionicons name="layers-outline" size={20} color="#F28C1B" />
            <Text style={styles.statValue}>{seriesFixas.split("•")[0]}</Text>
            <Text style={styles.statLabel}>Séries</Text>
          </View>

          <View style={styles.statItemTimer}>
            <View style={styles.timerControlesRow}>
              <TouchableOpacity onPress={diminuirTempo}>
                <Ionicons
                  name="remove-circle-outline"
                  size={24}
                  color="#F28C1B"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setAtivo(!ativo)}
                onLongPress={() => {
                  setAtivo(false);
                  setTempo(60); // Reseta para 60 segundos padrão
                }}
                delayLongPress={400}
                style={[styles.timerCirculo, ativo && styles.timerCirculoAtivo]}
              >
                <Text
                  style={[styles.timerTexto, ativo && styles.timerTextoAtivo]}
                >
                  {formatarTempo(tempo)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={aumentarTempo}>
                <Ionicons name="add-circle-outline" size={24} color="#F28C1B" />
              </TouchableOpacity>
            </View>
            <Text style={styles.statLabel}>Descanso</Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="repeat-outline" size={20} color="#F28C1B" />
            <Text style={styles.statValue}>{seriesFixas.split("•")[1]}</Text>
            <Text style={styles.statLabel}>Reps</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.descriptionText}>{instrucoesBase}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Execução passo a passo</Text>
          {detalhesDinamicos.passos.map((passo, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{passo}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.btnAction, salvando && { opacity: 0.7 }]}
          onPress={handleConcluirExercicio}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.btnActionText}>Concluir este Exercício 💪</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  headerLaranja: {
    backgroundColor: "#F28C1B",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  content: { flex: 1, paddingHorizontal: 20 },
  bigHalterContainer: { alignItems: "center", marginTop: 25 },
  bigHalterBox: {
    width: 140,
    height: 140,
    borderRadius: 28,
    backgroundColor: "#F28C1B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  exerciseNameText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A1A",
    textAlign: "center",
  },
  exerciseGroupText: { fontSize: 14, color: "#707070", marginTop: 4 },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingVertical: 15,
    marginTop: 25,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    alignItems: "center",
  },
  statItem: { alignItems: "center", flex: 1 },
  statItemTimer: { alignItems: "center", flex: 2 },
  statValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#8E8E93",
    marginTop: 2,
    fontWeight: "500",
  },
  timerControlesRow: { flexDirection: "row", alignItems: "center" },
  timerCirculo: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    borderWidth: 2,
    borderColor: "#E5E5EA",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  timerCirculoAtivo: { borderColor: "#F28C1B", backgroundColor: "#FFEFE3" },
  timerTexto: { fontSize: 13, fontWeight: "bold", color: "#636366" },
  timerTextoAtivo: { color: "#F28C1B" },
  section: { marginTop: 25 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 10,
  },
  descriptionText: { fontSize: 14, color: "#606060", lineHeight: 20 },
  stepRow: { flexDirection: "row", marginBottom: 12 },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#F28C1B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  stepNumberText: { color: "#FFF", fontSize: 11, fontWeight: "bold" },
  stepText: { flex: 1, fontSize: 14, color: "#404040" },
  btnAction: {
    backgroundColor: "#F28C1B",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 40,
  },
  btnActionText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});
