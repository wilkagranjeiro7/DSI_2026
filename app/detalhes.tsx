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

// NOVO: Importando a memória do celular
import AsyncStorage from "@react-native-async-storage/async-storage";

// BIBLIOTECA COMPLETA DE TODOS OS EXERCÍCIOS
const obterInstrucoesDetalhadas = (nome: string) => {
  const nomeLower = nome.toLowerCase();

  // --- AQUECIMENTO E ALONGAMENTO ---
  if (
    nomeLower.includes("rotação de ombros") ||
    nomeLower.includes("rotacao de ombros")
  ) {
    return {
      passos: [
        "Fique em pé ou sentada com a coluna bem reta e os braços relaxados.",
        "Eleve os ombros em direção às orelhas.",
        "Puxe os ombros para trás juntando as omoplatas, depois para baixo e para frente.",
        "Faça o círculo de forma ampla e controlada, respirando fundo.",
      ],
      musculos: ["Deltoide", "Trapézio", "Pescoço"],
    };
  }
  if (
    nomeLower.includes("rotação de tronco") ||
    nomeLower.includes("rotacao de tronco")
  ) {
    return {
      passos: [
        "Pés afastados na largura dos ombros e joelhos levemente dobrados.",
        "Gire a parte superior do corpo de um lado para o outro.",
        "Deixe os braços balançarem naturalmente batendo na cintura.",
        "O quadril acompanha o movimento e o calcanhar pode sair levemente do chão.",
      ],
      musculos: ["Core (Abdômen)", "Lombar", "Oblíquos"],
    };
  }
  if (
    nomeLower.includes("balanço de pernas") ||
    nomeLower.includes("balanco de pernas")
  ) {
    return {
      passos: [
        "Apoie uma das mãos em uma parede para manter o equilíbrio.",
        "Mantendo a perna esticada (sem travar o joelho), balance para frente e para trás.",
        "O tronco deve ficar totalmente parado, mexa apenas a perna.",
      ],
      musculos: ["Quadril", "Glúteos", "Posterior de Coxa"],
    };
  }
  if (nomeLower.includes("polichinelo")) {
    return {
      passos: [
        "Em pé, pés juntos e braços colados ao lado do corpo.",
        "Pule afastando as pernas e levantando os braços até as mãos se tocarem.",
        "Dê outro pulo para voltar rapidamente à posição inicial.",
        "Pouse na ponta dos pés com os joelhos um pouco dobrados.",
      ],
      musculos: ["Corpo Todo", "Cardiovascular"],
    };
  }
  if (nomeLower.includes("alongamento de ombros")) {
    return {
      passos: [
        "Estique o braço direito cruzando-o na frente do seu peito.",
        "Use o braço esquerdo para puxar o braço esticado contra o seu corpo.",
        "Mantenha o ombro abaixado, longe da orelha.",
        "Segure a posição e depois troque de lado.",
      ],
      musculos: ["Ombros", "Tríceps", "Costas"],
    };
  }
  if (nomeLower.includes("quadríceps") || nomeLower.includes("quadriceps")) {
    return {
      passos: [
        "Em pé, segure em uma parede para não perder o equilíbrio.",
        "Dobre o joelho para trás e segure o peito do pé com a mão.",
        "Mantenha os joelhos colados um no outro e puxe o pé levemente.",
        "Contraia o abdômen para não curvar a lombar.",
      ],
      musculos: ["Quadríceps (Parte da frente da coxa)"],
    };
  }

  // --- SUPERIORES ---
  if (nomeLower.includes("supino")) {
    return {
      passos: [
        "Deite-se no banco com os pés bem firmes no solo.",
        "Segure a barra ou halteres um pouco mais abertos que os ombros.",
        "Desça o peso de forma controlada até tocar levemente o peito.",
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
  if (nomeLower.includes("desenvolvimento")) {
    return {
      passos: [
        "Sente-se num banco com encosto e segure os halteres na altura das orelhas.",
        "Empurre os pesos para cima até quase esticar os braços.",
        "Não deixe os halteres baterem um no outro no topo.",
        "Desça devagar até a altura dos ombros novamente.",
      ],
      musculos: ["Deltoides (Ombros)", "Tríceps"],
    };
  }
  if (nomeLower.includes("rosca")) {
    return {
      passos: [
        "Em pé, segure os halteres com as palmas das mãos viradas para frente.",
        "Cole os cotovelos nas costelas (não jogue para frente nem para trás).",
        "Dobre os braços levantando os halteres até a altura dos ombros.",
        "Desça controlando o peso até esticar o braço.",
      ],
      musculos: ["Bíceps", "Antebraços"],
    };
  }
  if (
    nomeLower.includes("polia") &&
    (nomeLower.includes("tríceps") || nomeLower.includes("triceps"))
  ) {
    return {
      passos: [
        "Fique em pé de frente para a polia e segure a barra.",
        "Incline o corpo levemente e trave os cotovelos na cintura.",
        "Empurre a barra para baixo até esticar totalmente os braços.",
        "Volte dobrando o braço até formar um ângulo de 90 graus.",
      ],
      musculos: ["Tríceps"],
    };
  }

  // --- INFERIORES ---
  if (nomeLower.includes("agachamento livre")) {
    return {
      passos: [
        "Pés na largura dos ombros, apontando levemente para fora.",
        "Desça jogando o quadril para trás, como se fosse sentar em uma cadeira.",
        "Mantenha o peito aberto e o abdômen contraído.",
        "Suba empurrando o chão com os calcanhares.",
      ],
      musculos: ["Quadríceps", "Glúteos", "Posteriores de Coxa"],
    };
  }
  if (nomeLower.includes("leg press")) {
    return {
      passos: [
        "Sente-se no aparelho e apoie os pés na plataforma na largura dos ombros.",
        "Destrave a máquina e desça o peso dobrando os joelhos.",
        "Abaixe até formar um ângulo de 90 graus.",
        "Empurre de volta, mas nunca estique os joelhos 100% até travar.",
      ],
      musculos: ["Quadríceps", "Glúteos", "Posteriores"],
    };
  }
  if (nomeLower.includes("extensora")) {
    return {
      passos: [
        "Sente-se na máquina com as costas apoiadas e o rolo acima do peito do pé.",
        "Segure firme nas alças laterais para não levantar o quadril.",
        "Chute o peso para cima esticando as pernas e segure 1 segundo no alto.",
        "Desça bem devagar, resistindo ao peso da máquina.",
      ],
      musculos: ["Quadríceps (Parte da frente da coxa)"],
    };
  }
  if (nomeLower.includes("búlgaro") || nomeLower.includes("bulgaro")) {
    return {
      passos: [
        "Fique em pé de costas para um banco e apoie o peito do pé de trás nele.",
        "Incline o tronco levemente para frente.",
        "Dobre o joelho da frente descendo o quadril em linha reta.",
        "Pare quando o joelho de trás quase tocar o chão e suba novamente.",
      ],
      musculos: ["Glúteos", "Quadríceps"],
    };
  }
  if (nomeLower.includes("pélvica") || nomeLower.includes("pelvica")) {
    return {
      passos: [
        "Apoiando apenas as escápulas no banco, deixe os pés firmes no chão.",
        "Empurre o chão com os calcanhares e levante o quadril.",
        "Esprema os glúteos lá em cima por 2 segundos.",
        "Desça o quadril lentamente. O queixo deve acompanhar o movimento do peito.",
      ],
      musculos: ["Glúteos Máximos", "Posteriores de Coxa"],
    };
  }
  if (nomeLower.includes("flexora")) {
    return {
      passos: [
        "Deite de barriga para baixo e ajuste o rolo acima dos calcanhares.",
        "Segure firme nas alças do aparelho.",
        "Dobre os joelhos puxando o peso em direção ao bumbum.",
        "Retorne descendo as pernas bem devagar. Não deixe o quadril descolar do banco.",
      ],
      musculos: [
        "Posteriores de Coxa (Parte de trás da perna)",
        "Panturrilhas",
      ],
    };
  }

  // --- CARDIO E ABDÔMEN ---
  if (nomeLower.includes("esteira") || nomeLower.includes("corrida")) {
    return {
      passos: [
        "Inicie com uma caminhada leve para aquecer as articulações.",
        "Aumente a velocidade para o seu ritmo de corrida.",
        "Mantenha a postura ereta e os braços balançando como um pêndulo.",
        "Pise preferencialmente com o meio do pé para amortecer o impacto.",
      ],
      musculos: ["Cardiovascular", "Pernas completas"],
    };
  }
  if (nomeLower.includes("abdominal") || nomeLower.includes("supra")) {
    return {
      passos: [
        "Deite de costas com os joelhos dobrados e pés no chão.",
        "Coloque as mãos ao lado da cabeça (sem puxar o pescoço).",
        "Tire apenas os ombros do chão espremendo forte a barriga.",
        "Olhe sempre para o teto e desça devagar.",
      ],
      musculos: ["Abdômen Reto"],
    };
  }

  // Caso o exercício seja novo e não caia em nenhuma regra acima
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

  const idExercicio = params.id as string; // Pegando o ID!
  const nomeExercicio = (params.nome as string) || "Exercício";
  const grupoMuscular = (params.grupo as string) || "Geral";
  const instrucoesBase =
    (params.instrucoes as string) ||
    "Siga o passo a passo abaixo para a execução correta.";
  const seriesFixas = (params.seriesRep as string) || "4 séries • 12 rep";

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

      // NOVO: Salvando na memória do celular que esse exercício foi feito
      if (idExercicio) {
        const concluidosSalvos = await AsyncStorage.getItem(
          "exerciciosConcluidos",
        );
        let listaConcluidos = concluidosSalvos
          ? JSON.parse(concluidosSalvos)
          : [];

        if (!listaConcluidos.includes(idExercicio)) {
          listaConcluidos.push(idExercicio);
          await AsyncStorage.setItem(
            "exerciciosConcluidos",
            JSON.stringify(listaConcluidos),
          );
        }
      }

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
      }

      alert(`Exercício "${nomeExercicio}" marcado como feito! 🔥🏃‍♀️`);
      router.back();
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
        <View style={styles.bigHalterContainer}>
          <View style={styles.bigHalterBox}>
            <MaterialCommunityIcons name="dumbbell" size={64} color="#FFF" />
          </View>
          <Text style={styles.exerciseNameText}>{nomeExercicio}</Text>
          <Text style={styles.exerciseGroupText}>{grupoMuscular}</Text>
        </View>

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
                  setTempo(60);
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
