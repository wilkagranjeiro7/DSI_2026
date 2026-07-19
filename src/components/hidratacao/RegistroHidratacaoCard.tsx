import { Feather, Ionicons } from "@expo/vector-icons";
import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import RegistroHidratacao from "../../models/RegistroHidratacao";

interface RegistroHidratacaoCardProps {
  registro: RegistroHidratacao;
  onEditar: (registro: RegistroHidratacao) => void;
  onExcluir: (id: string) => void;
}

export default class RegistroHidratacaoCard extends Component<RegistroHidratacaoCardProps> {
  private formatarDataHora(): string {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(this.props.registro.dataHora));
  }

  render() {
    const { registro, onEditar, onExcluir } = this.props;

    return (
      <View style={styles.card}>
        <View style={styles.iconArea}>
          <Ionicons name="water" size={28} color="#0EA5E9" />
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.amount}>{registro.quantidadeMl} ml</Text>
              <Text style={styles.type}>{registro.nomeBebida}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                accessibilityLabel="Editar registro"
                style={styles.actionButton}
                onPress={() => onEditar(registro)}
              >
                <Feather name="edit-2" size={17} color="#F28C1B" />
              </TouchableOpacity>

              <TouchableOpacity
                accessibilityLabel="Excluir registro"
                style={styles.actionButton}
                onPress={() => registro.id && onExcluir(registro.id)}
              >
                <Feather name="trash-2" size={17} color="#DC2626" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.date}>{this.formatarDataHora()}</Text>

          {registro.observacoes ? (
            <Text style={styles.notes}>{registro.observacoes}</Text>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
  },
  iconArea: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  content: { flex: 1 },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  amount: { color: "#111827", fontSize: 18, fontWeight: "900" },
  type: { color: "#0369A1", fontSize: 13, fontWeight: "700", marginTop: 2 },
  date: { color: "#6B7280", fontSize: 12, marginTop: 7 },
  notes: { color: "#374151", fontSize: 13, lineHeight: 18, marginTop: 7 },
  actions: { flexDirection: "row", gap: 7 },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
});
