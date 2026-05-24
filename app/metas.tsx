import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import MetaCard from "../src/components/metas/MetaCard";
import Meta from "../src/models/Meta";
import MetaService from "../src/services/MetaService";

export default function MetasScreen() {
  const metaService = useMemo(() => new MetaService(), []);

  const [metas, setMetas] = useState<Meta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarMetas() {
    try {
      setCarregando(true);

      const lista = await metaService.listarMetas();

      setMetas(lista);
      setErro("");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao carregar metas.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarMetas();
  }, []);

  function abrirNovaMeta() {
    router.push("/meta-form");
  }

  function editarMeta(meta: Meta) {
    if (!meta.id) {
      return;
    }

    router.push({
      pathname: "/meta-form",
      params: { id: meta.id },
    });
  }

  function confirmarExclusao(id: string) {
    Alert.alert("Excluir meta", "Tem certeza que deseja excluir esta meta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => excluirMeta(id),
      },
    ]);
  }

  async function excluirMeta(id: string) {
    try {
      await metaService.excluirMeta(id);
      await carregarMetas();
    } catch (error) {
      Alert.alert("Erro", error instanceof Error ? error.message : "Erro ao excluir meta.");
    }
  }

  async function concluirMeta(id: string) {
    try {
      await metaService.concluirMeta(id);
      await carregarMetas();
    } catch (error) {
      Alert.alert("Erro", error instanceof Error ? error.message : "Erro ao concluir meta.");
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>FitMatch</Text>

          <Ionicons name="ellipsis-vertical" size={22} color="#FFFFFF" />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.title}>Minhas metas</Text>
              <Text style={styles.subtitle}>Acompanhe seu progresso</Text>
            </View>

            <TouchableOpacity style={styles.newButton} onPress={abrirNovaMeta}>
              <Text style={styles.newButtonText}>+ Nova meta</Text>
            </TouchableOpacity>
          </View>

          {erro ? <Text style={styles.error}>{erro}</Text> : null}

          {carregando ? (
            <Text style={styles.feedback}>Carregando metas...</Text>
          ) : metas.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Nenhuma meta cadastrada</Text>
              <Text style={styles.emptyText}>Toque em “+ Nova meta” para criar sua primeira meta.</Text>
            </View>
          ) : (
            metas.map((meta) => (
              <MetaCard
                key={meta.id}
                meta={meta}
                onEditar={editarMeta}
                onExcluir={confirmarExclusao}
                onConcluir={concluirMeta}
              />
            ))
          )}
        </ScrollView>

        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/home")}>
            <Ionicons name="home-outline" size={21} color="#9CA3AF" />
            <Text style={styles.tabText}>Início</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem}>
            <MaterialCommunityIcons name="arm-flex-outline" size={21} color="#9CA3AF" />
            <Text style={styles.tabText}>Treinos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem}>
            <Ionicons name="add-circle-outline" size={21} color="#FF8500" />
            <Text style={[styles.tabText, styles.tabTextActive]}>Metas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem}>
            <Ionicons name="navigate-outline" size={21} color="#9CA3AF" />
            <Text style={styles.tabText}>Mapa</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/perfil")}>
            <Ionicons name="person-outline" size={21} color="#9CA3AF" />
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
    backgroundColor: "#FF8500",
  },
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    height: 58,
    backgroundColor: "#FF8500",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  content: {
    padding: 16,
    paddingBottom: 110,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 3,
  },
  newButton: {
    backgroundColor: "#FF8500",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  newButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
  },
  feedback: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "700",
  },
  error: {
    backgroundColor: "#FEE2E2",
    color: "#DC2626",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    fontWeight: "700",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#111827",
  },
  emptyText: {
    color: "#6B7280",
    marginTop: 6,
  },
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 16,
    right: 16,
    height: 66,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 12,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 3,
    fontWeight: "700",
  },
  tabTextActive: {
    color: "#FF8500",
  },
});