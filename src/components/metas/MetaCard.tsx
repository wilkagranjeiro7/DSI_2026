import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Meta from "../../models/Meta";

interface MetaCardProps {
  meta: Meta;
  onEditar: (meta: Meta) => void;
  onExcluir: (id: string) => void;
  onConcluir: (id: string) => void;
}

export default function MetaCard({
  meta,
  onEditar,
  onExcluir,
  onConcluir,
}: MetaCardProps) {
  const progresso = meta.calcularProgresso();

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.title}>{meta.titulo}</Text>
          <Text style={styles.category}>{meta.categoria}</Text>
        </View>

        <Text
          style={[
            styles.status,
            meta.status === "concluida" && styles.statusDone,
          ]}
        >
          {meta.status}
        </Text>
      </View>

      <View style={styles.valuesRow}>
        <Text style={styles.valueText}>
          Atual: {meta.valorAtual} {meta.unidade}
        </Text>

        <Text style={styles.valueText}>
          Meta: {meta.valorDesejado} {meta.unidade}
        </Text>
      </View>

      <View style={styles.progressBackground}>
        <View style={[styles.progressFill, { width: `${progresso}%` }]} />
      </View>

      <Text style={styles.progressText}>{progresso}% concluído</Text>

      {meta.dataLimite ? (
        <Text style={styles.infoText}>Limite: {meta.dataLimite}</Text>
      ) : null}

      {meta.observacoes ? (
        <Text style={styles.infoText}>{meta.observacoes}</Text>
      ) : null}

      {meta.relacionadoTipo && meta.relacionadoId ? (
        <Text style={styles.infoText}>
          Relacionado: {meta.relacionadoTipo} - {meta.relacionadoId}
        </Text>
      ) : null}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.outlineButton} onPress={() => onEditar(meta)}>
          <Text style={styles.outlineButtonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dangerButton}
          onPress={() => meta.id && onExcluir(meta.id)}
        >
          <Text style={styles.dangerButtonText}>Excluir</Text>
        </TouchableOpacity>

        {meta.status !== "concluida" ? (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => meta.id && onConcluir(meta.id)}
          >
            <Text style={styles.primaryButtonText}>Concluir</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },
  category: {
    marginTop: 3,
    color: "#6B7280",
    fontSize: 13,
  },
  status: {
    color: "#F28C1B",
    borderWidth: 1,
    borderColor: "#F28C1B",
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 11,
    fontWeight: "800",
    alignSelf: "flex-start",
  },
  statusDone: {
    color: "#16A34A",
    borderColor: "#16A34A",
  },
  valuesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  valueText: {
    color: "#6B7280",
    fontSize: 13,
  },
  progressBackground: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF8500",
    borderRadius: 999,
  },
  progressText: {
    color: "#FF8500",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 7,
  },
  infoText: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 5,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
    flexWrap: "wrap",
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#FF8500",
    borderRadius: 14,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  outlineButtonText: {
    color: "#FF8500",
    fontWeight: "800",
    fontSize: 12,
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: "#EF4444",
    borderRadius: 14,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  dangerButtonText: {
    color: "#EF4444",
    fontWeight: "800",
    fontSize: 12,
  },
  primaryButton: {
    backgroundColor: "#FF8500",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
  },
});