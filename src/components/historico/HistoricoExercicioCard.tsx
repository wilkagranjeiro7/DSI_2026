import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HistoricoExercicio from "../../models/HistoricoExercicio";

interface HistoricoExercicioCardProps {
  historico: HistoricoExercicio;
  onEditar: (historico: HistoricoExercicio) => void;
  onExcluir: (id: string) => void;
}

export default class HistoricoExercicioCard extends Component<HistoricoExercicioCardProps> {
  private editar = () => {
    this.props.onEditar(this.props.historico);
  };

  private excluir = () => {
    const { historico, onExcluir } = this.props;

    if (historico.id) {
      onExcluir(historico.id);
    }
  };

  render() {
    const { historico } = this.props;
    const volume = historico.calcularVolume();

    return (
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.titleArea}>
            <Text style={styles.title}>{historico.nomeExercicio}</Text>
            <Text style={styles.subtitle}>{historico.grupoMuscular || "Geral"}</Text>
          </View>

          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>{historico.formatarData()}</Text>
          </View>
        </View>

        <Text style={styles.execution}>{historico.resumoExecucao()}</Text>

        {volume > 0 ? (
          <Text style={styles.infoText}>Volume total: {volume} kg</Text>
        ) : null}

        {historico.observacoes ? (
          <Text style={styles.infoText}>{historico.observacoes}</Text>
        ) : null}

        <Text style={styles.originText}>
          Origem: {historico.origem === "conclusao" ? "Conclusao" : "Manual"}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.outlineButton} onPress={this.editar}>
            <Text style={styles.outlineButtonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dangerButton} onPress={this.excluir}>
            <Text style={styles.dangerButtonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  titleArea: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    marginTop: 3,
    color: "#6B7280",
    fontSize: 13,
  },
  dateBadge: {
    backgroundColor: "#FFF4E6",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  dateText: {
    color: "#F28C1B",
    fontWeight: "800",
    fontSize: 12,
  },
  execution: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 12,
  },
  infoText: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 6,
  },
  originText: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 8,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 14,
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
});
