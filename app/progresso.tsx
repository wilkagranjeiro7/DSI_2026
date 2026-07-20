import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// 👇 IMPORTAÇÃO ATUALIZADA AQUI 👇
// Puxamos o seu arquivo de service oficial do Plano Alimentar
import { PlanoAlimentarService } from "../src/services/PlanoAlimentarService";
// 👆 ---------------------- 👆

export default function ProgressoScreen() {
  // Guardamos o número de refeições concluídas aqui. Começa em 0.
  const [refeicoesConcluidas, setRefeicoesConcluidas] = useState(0);

  // Uma tela de carregamento enquanto o celular vai buscar a informação
  const [carregando, setCarregando] = useState(true);

  // O useEffect é acionado assim que o usuário entra nessa tela
  useEffect(() => {
    carregarProgresso();
  }, []);

  const carregarProgresso = async () => {
    try {
      // 👇 CÓDIGO SIMPLIFICADO 👇
      // O seu Service já é inteligente e sabe quem é o usuário!
      // Então é só chamar a função direto e guardar o número:
      const quantidadeReal =
        await PlanoAlimentarService.obterProgressoUsuario();

      // Atualiza a tela com o número real que veio do Firebase
      setRefeicoesConcluidas(quantidadeReal);
      // 👆 ---------------------- 👆
    } catch (error) {
      console.error("Erro ao buscar progresso:", error);
    } finally {
      // Tira a bolinha de carregando quando terminar
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho com botão de voltar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Progresso no FitMatch</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Seu Desempenho</Text>
        <Text style={styles.subtitle}>
          Acompanhe quantas refeições você já finalizou!
        </Text>

        {carregando ? (
          <ActivityIndicator
            size="large"
            color="#F28C1B"
            style={{ marginTop: 50 }}
          />
        ) : (
          <View style={styles.card}>
            <Ionicons name="restaurant" size={60} color="#F28C1B" />
            <Text style={styles.numeroGrande}>{refeicoesConcluidas}</Text>
            <Text style={styles.textoCard}>Refeições Concluídas</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

// Estilos usando as mesmas cores da sua Home
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6", // Cor de fundo suave
  },
  header: {
    backgroundColor: "#F28C1B", // Laranja principal
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8EA0",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    width: "90%",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#F28C1B", // Borda laranja igual da Home
    elevation: 4, // Sombreado para Android
    shadowColor: "#000", // Sombreado para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  numeroGrande: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 15,
  },
  textoCard: {
    fontSize: 20,
    fontWeight: "600",
    color: "#8E8EA0",
    marginTop: 5,
  },
});
