import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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

import MetaForm from "../src/components/metas/MetaForm";
import { MetaFormulario } from "../src/models/Meta";
import MetaService from "../src/services/MetaService";

const formInicial: MetaFormulario = {
  titulo: "",
  categoria: "",
  valorAtual: "",
  valorDesejado: "",
  unidade: "",
  dataLimite: "",
  observacoes: "",
  relacionadoTipo: "",
  relacionadoId: "",
};

export default function MetaFormScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const metaService = useMemo(() => new MetaService(), []);

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [form, setForm] = useState<MetaFormulario>({ ...formInicial });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function carregarMetaParaEditar() {
      if (!id) {
        return;
      }

      try {
        setCarregando(true);

        const meta = await metaService.buscarMeta(id);

        if (!meta) {
          setErro("Meta não encontrada.");
          return;
        }

        setForm({
          titulo: meta.titulo,
          categoria: meta.categoria,
          valorAtual: String(meta.valorAtual),
          valorDesejado: String(meta.valorDesejado),
          unidade: meta.unidade,
          dataLimite: meta.dataLimite,
          observacoes: meta.observacoes,
          relacionadoTipo: meta.relacionadoTipo || "",
          relacionadoId: meta.relacionadoId || "",
        });
      } catch (error) {
        setErro(error instanceof Error ? error.message : "Erro ao carregar meta.");
      } finally {
        setCarregando(false);
      }
    }

    carregarMetaParaEditar();
  }, [id]);

  function alterarCampo(campo: keyof MetaFormulario, valor: string) {
    setForm((estadoAtual) => ({
      ...estadoAtual,
      [campo]: valor,
    }));
  }

  async function salvarMeta() {
    try {
      setSalvando(true);

      await metaService.salvarMeta({
        id: id || null,
        titulo: form.titulo,
        categoria: form.categoria,
        valorAtual: form.valorAtual,
        valorDesejado: form.valorDesejado,
        unidade: form.unidade,
        dataLimite: form.dataLimite,
        observacoes: form.observacoes,
        relacionadoTipo: form.relacionadoTipo || null,
        relacionadoId: form.relacionadoId || null,
      });

      router.replace("/metas");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao salvar meta.");
    } finally {
      setSalvando(false);
    }
  }

  function cancelar() {
    router.replace("/metas");
  }

  if (carregando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.loading}>Carregando meta...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (salvando) {
    Alert.alert("Aguarde", "Salvando meta...");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace("/metas")}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>FitMatch</Text>

          <Ionicons name="ellipsis-vertical" size={22} color="#FFFFFF" />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <MetaForm
            form={form}
            editandoId={id || null}
            erro={erro}
            onChange={alterarCampo}
            onSubmit={salvarMeta}
            onCancel={cancelar}
          />
        </ScrollView>
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
    paddingBottom: 40,
  },
  loading: {
    textAlign: "center",
    marginTop: 40,
    fontWeight: "700",
    color: "#6B7280",
  },
});