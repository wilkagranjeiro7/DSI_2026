import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import React, { Component } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LocalSearchParamsAdapter, {
  LocalSearchParamReader,
  LocalSearchParamsProps,
} from "../src/navigation/LocalSearchParamsAdapter";
import { auth, db } from "../src/utils/firebaseConfig";

interface DetalhesInstrucao {
  passos: string[];
  musculos: string[];
}

class InstrucaoRule {
  constructor(
    private readonly termos: string[],
    readonly instrucao: DetalhesInstrucao,
  ) {}

  matches(nome: string) {
    const nomeLower = nome.toLowerCase();
    return this.termos.some((termo) => nomeLower.includes(termo));
  }
}

class InstrucaoExercicioService {
  private readonly rules = [
    new InstrucaoRule(["rotacao de ombros", "rotação de ombros"], {
      passos: [
        "Fique em pe ou sentada com a coluna bem reta e os bracos relaxados.",
        "Eleve os ombros em direcao as orelhas.",
        "Puxe os ombros para tras juntando as omoplatas, depois para baixo e para frente.",
        "Faca o circulo de forma ampla e controlada, respirando fundo.",
      ],
      musculos: ["Deltoide", "Trapezio", "Pescoco"],
    }),
    new InstrucaoRule(["rotacao de tronco", "rotação de tronco"], {
      passos: [
        "Pes afastados na largura dos ombros e joelhos levemente dobrados.",
        "Gire a parte superior do corpo de um lado para o outro.",
        "Deixe os bracos balancarem naturalmente batendo na cintura.",
        "O quadril acompanha o movimento e o calcanhar pode sair levemente do chao.",
      ],
      musculos: ["Core", "Lombar", "Obliquos"],
    }),
    new InstrucaoRule(["balanco de pernas", "balanço de pernas"], {
      passos: [
        "Apoie uma das maos em uma parede para manter o equilibrio.",
        "Mantendo a perna esticada, balance para frente e para tras.",
        "O tronco deve ficar totalmente parado, mexa apenas a perna.",
      ],
      musculos: ["Quadril", "Gluteos", "Posterior de Coxa"],
    }),
    new InstrucaoRule(["polichinelo"], {
      passos: [
        "Em pe, pes juntos e bracos colados ao lado do corpo.",
        "Pule afastando as pernas e levantando os bracos ate as maos se tocarem.",
        "De outro pulo para voltar rapidamente a posicao inicial.",
        "Pouse na ponta dos pes com os joelhos um pouco dobrados.",
      ],
      musculos: ["Corpo Todo", "Cardiovascular"],
    }),
    new InstrucaoRule(["alongamento de ombros"], {
      passos: [
        "Estique o braco direito cruzando-o na frente do seu peito.",
        "Use o braco esquerdo para puxar o braco esticado contra o seu corpo.",
        "Mantenha o ombro abaixado, longe da orelha.",
        "Segure a posicao e depois troque de lado.",
      ],
      musculos: ["Ombros", "Triceps", "Costas"],
    }),
    new InstrucaoRule(["quadriceps", "quadríceps"], {
      passos: [
        "Em pe, segure em uma parede para nao perder o equilibrio.",
        "Dobre o joelho para tras e segure o peito do pe com a mao.",
        "Mantenha os joelhos colados um no outro e puxe o pe levemente.",
        "Contraia o abdomen para nao curvar a lombar.",
      ],
      musculos: ["Quadriceps"],
    }),
    new InstrucaoRule(["supino"], {
      passos: [
        "Deite-se no banco com os pes bem firmes no solo.",
        "Segure a barra ou halteres um pouco mais abertos que os ombros.",
        "Desca o peso de forma controlada ate tocar levemente o peito.",
        "Empurre para cima estendendo os bracos, sem travar os cotovelos.",
      ],
      musculos: ["Peitoral Maior", "Triceps", "Deltoide Anterior"],
    }),
    new InstrucaoRule(["puxada", "pulldown"], {
      passos: [
        "Ajuste o rolo do aparelho para travar bem as suas coxas.",
        "Segure a barra com os bracos esticados e tronco levemente inclinado.",
        "Puxe a barra em direcao ao peito, esmagando as costas.",
        "Retorne subindo os bracos devagar, controlando o peso.",
      ],
      musculos: ["Dorsal", "Biceps", "Trapezio"],
    }),
    new InstrucaoRule(["desenvolvimento"], {
      passos: [
        "Sente-se num banco com encosto e segure os halteres na altura das orelhas.",
        "Empurre os pesos para cima ate quase esticar os bracos.",
        "Nao deixe os halteres baterem um no outro no topo.",
        "Desca devagar ate a altura dos ombros novamente.",
      ],
      musculos: ["Deltoides", "Triceps"],
    }),
    new InstrucaoRule(["rosca"], {
      passos: [
        "Em pe, segure os halteres com as palmas das maos viradas para frente.",
        "Cole os cotovelos nas costelas.",
        "Dobre os bracos levantando os halteres ate a altura dos ombros.",
        "Desca controlando o peso ate esticar o braco.",
      ],
      musculos: ["Biceps", "Antebracos"],
    }),
    new InstrucaoRule(["polia", "triceps", "tríceps"], {
      passos: [
        "Fique em pe de frente para a polia e segure a barra.",
        "Incline o corpo levemente e trave os cotovelos na cintura.",
        "Empurre a barra para baixo ate esticar totalmente os bracos.",
        "Volte dobrando o braco ate formar um angulo de 90 graus.",
      ],
      musculos: ["Triceps"],
    }),
    new InstrucaoRule(["agachamento livre"], {
      passos: [
        "Pes na largura dos ombros, apontando levemente para fora.",
        "Desca jogando o quadril para tras, como se fosse sentar em uma cadeira.",
        "Mantenha o peito aberto e o abdomen contraido.",
        "Suba empurrando o chao com os calcanhares.",
      ],
      musculos: ["Quadriceps", "Gluteos", "Posteriores de Coxa"],
    }),
    new InstrucaoRule(["leg press"], {
      passos: [
        "Sente-se no aparelho e apoie os pes na plataforma na largura dos ombros.",
        "Destrave a maquina e desca o peso dobrando os joelhos.",
        "Abaixe ate formar um angulo de 90 graus.",
        "Empurre de volta sem travar totalmente os joelhos.",
      ],
      musculos: ["Quadriceps", "Gluteos", "Posteriores"],
    }),
    new InstrucaoRule(["extensora"], {
      passos: [
        "Sente-se na maquina com as costas apoiadas e o rolo acima do peito do pe.",
        "Segure firme nas alcas laterais para nao levantar o quadril.",
        "Chute o peso para cima esticando as pernas e segure 1 segundo no alto.",
        "Desca bem devagar, resistindo ao peso da maquina.",
      ],
      musculos: ["Quadriceps"],
    }),
    new InstrucaoRule(["bulgaro", "búlgaro"], {
      passos: [
        "Fique em pe de costas para um banco e apoie o peito do pe de tras nele.",
        "Incline o tronco levemente para frente.",
        "Dobre o joelho da frente descendo o quadril em linha reta.",
        "Pare quando o joelho de tras quase tocar o chao e suba novamente.",
      ],
      musculos: ["Gluteos", "Quadriceps"],
    }),
    new InstrucaoRule(["pelvica", "pélvica"], {
      passos: [
        "Apoiando apenas as escapulas no banco, deixe os pes firmes no chao.",
        "Empurre o chao com os calcanhares e levante o quadril.",
        "Esprema os gluteos em cima por 2 segundos.",
        "Desca o quadril lentamente.",
      ],
      musculos: ["Gluteos Maximos", "Posteriores de Coxa"],
    }),
    new InstrucaoRule(["flexora"], {
      passos: [
        "Deite de barriga para baixo e ajuste o rolo acima dos calcanhares.",
        "Segure firme nas alcas do aparelho.",
        "Dobre os joelhos puxando o peso em direcao ao bumbum.",
        "Retorne descendo as pernas bem devagar.",
      ],
      musculos: ["Posteriores de Coxa", "Panturrilhas"],
    }),
    new InstrucaoRule(["esteira", "corrida"], {
      passos: [
        "Inicie com uma caminhada leve para aquecer as articulacoes.",
        "Aumente a velocidade para o seu ritmo de corrida.",
        "Mantenha a postura ereta e os bracos balancando naturalmente.",
        "Pise preferencialmente com o meio do pe para amortecer o impacto.",
      ],
      musculos: ["Cardiovascular", "Pernas completas"],
    }),
    new InstrucaoRule(["abdominal", "supra"], {
      passos: [
        "Deite de costas com os joelhos dobrados e pes no chao.",
        "Coloque as maos ao lado da cabeca sem puxar o pescoco.",
        "Tire apenas os ombros do chao espremendo forte a barriga.",
        "Olhe para o teto e desca devagar.",
      ],
      musculos: ["Abdomen Reto"],
    }),
  ];

  obter(nome: string): DetalhesInstrucao {
    return (
      this.rules.find((rule) => rule.matches(nome))?.instrucao || {
        passos: [
          "Prepare o posicionamento inicial mantendo a coluna ereta.",
          "Execute o movimento principal focando na contracao muscular.",
          "Retorne a posicao inicial segurando o peso de forma controlada.",
        ],
        musculos: ["Musculo Principal"],
      }
    );
  }
}

class SeriesRepFormatter {
  constructor(private readonly value: string) {}

  get series() {
    return this.parts[0] || this.value;
  }

  get repeticoes() {
    return this.parts[1] || "";
  }

  private get parts() {
    return this.value.includes("•")
      ? this.value.split("•")
      : this.value.split("-");
  }
}

interface DetalhesState {
  tempo: number;
  ativo: boolean;
  salvando: boolean;
}

class DetalhesExercicioScreen extends Component<
  LocalSearchParamsProps,
  DetalhesState
> {
  private readonly paramReader: LocalSearchParamReader;
  private readonly instrucaoService = new InstrucaoExercicioService();
  private intervalo?: ReturnType<typeof setInterval>;

  constructor(props: LocalSearchParamsProps) {
    super(props);

    this.paramReader = new LocalSearchParamReader(props.params);
    this.state = {
      tempo: 60,
      ativo: false,
      salvando: false,
    };
  }

  componentDidUpdate(_: LocalSearchParamsProps, prevState: DetalhesState) {
    if (
      prevState.ativo !== this.state.ativo ||
      prevState.tempo !== this.state.tempo
    ) {
      this.sincronizarTimer();
    }
  }

  componentWillUnmount() {
    this.pararTimer();
  }

  private get idExercicio() {
    return this.paramReader.get("id");
  }

  private get nomeExercicio() {
    return this.paramReader.get("nome", "Exercicio");
  }

  private get grupoMuscular() {
    return this.paramReader.get("grupo", "Geral");
  }

  private get instrucoesBase() {
    return this.paramReader.get(
      "instrucoes",
      "Siga o passo a passo abaixo para a execucao correta.",
    );
  }

  private get seriesFixas() {
    return this.paramReader.get("seriesRep", "4 series - 12 rep");
  }

  private pararTimer() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = undefined;
    }
  }

  private sincronizarTimer() {
    this.pararTimer();

    if (this.state.ativo && this.state.tempo > 0) {
      this.intervalo = setInterval(() => {
        this.setState((estadoAtual) => ({
          tempo: Math.max(estadoAtual.tempo - 1, 0),
        }));
      }, 1000);
      return;
    }

    if (this.state.tempo === 0 && this.state.ativo) {
      this.setState({ ativo: false });
    }
  }

  private handleConcluirExercicio = async () => {
    try {
      this.setState({ salvando: true });

      if (this.idExercicio) {
        const concluidosSalvos = await AsyncStorage.getItem(
          "exerciciosConcluidos",
        );
        const listaConcluidos = concluidosSalvos
          ? JSON.parse(concluidosSalvos)
          : [];

        if (!listaConcluidos.includes(this.idExercicio)) {
          listaConcluidos.push(this.idExercicio);
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

      alert(`Exercicio "${this.nomeExercicio}" marcado como feito!`);
      router.back();
    } catch (error: any) {
      console.error("Erro ao salvar conclusao do exercicio:", error);
      alert("Erro ao salvar: " + error.message);
    } finally {
      this.setState({ salvando: false });
    }
  };

  private formatarTempo(segundos: number): string {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;

    return `${mins}:${segs < 10 ? "0" : ""}${segs}`;
  }

  private aumentarTempo = () => {
    this.setState((estadoAtual) => ({ tempo: estadoAtual.tempo + 15 }));
  };

  private diminuirTempo = () => {
    this.setState((estadoAtual) => ({
      tempo: Math.max(estadoAtual.tempo - 15, 0),
    }));
  };

  private alternarTimer = () => {
    this.setState((estadoAtual) => ({ ativo: !estadoAtual.ativo }));
  };

  private reiniciarTimer = () => {
    this.setState({ ativo: false, tempo: 60 });
  };

  render() {
    const { tempo, ativo, salvando } = this.state;
    const detalhesDinamicos = this.instrucaoService.obter(this.nomeExercicio);
    const seriesRep = new SeriesRepFormatter(this.seriesFixas);

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerLaranja}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalhes do exercicio</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.bigHalterContainer}>
            <View style={styles.bigHalterBox}>
              <MaterialCommunityIcons name="dumbbell" size={64} color="#FFF" />
            </View>
            <Text style={styles.exerciseNameText}>{this.nomeExercicio}</Text>
            <Text style={styles.exerciseGroupText}>{this.grupoMuscular}</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="layers-outline" size={20} color="#F28C1B" />
              <Text style={styles.statValue}>{seriesRep.series}</Text>
              <Text style={styles.statLabel}>Series</Text>
            </View>

            <View style={styles.statItemTimer}>
              <View style={styles.timerControlesRow}>
                <TouchableOpacity onPress={this.diminuirTempo}>
                  <Ionicons
                    name="remove-circle-outline"
                    size={24}
                    color="#F28C1B"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={this.alternarTimer}
                  onLongPress={this.reiniciarTimer}
                  delayLongPress={400}
                  style={[styles.timerCirculo, ativo && styles.timerCirculoAtivo]}
                >
                  <Text
                    style={[styles.timerTexto, ativo && styles.timerTextoAtivo]}
                  >
                    {this.formatarTempo(tempo)}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={this.aumentarTempo}>
                  <Ionicons name="add-circle-outline" size={24} color="#F28C1B" />
                </TouchableOpacity>
              </View>
              <Text style={styles.statLabel}>Descanso</Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="repeat-outline" size={20} color="#F28C1B" />
              <Text style={styles.statValue}>{seriesRep.repeticoes}</Text>
              <Text style={styles.statLabel}>Reps</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descricao</Text>
            <Text style={styles.descriptionText}>{this.instrucoesBase}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Execucao passo a passo</Text>
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
            onPress={this.handleConcluirExercicio}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.btnActionText}>Concluir este Exercicio</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default LocalSearchParamsAdapter.connect(DetalhesExercicioScreen);

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
