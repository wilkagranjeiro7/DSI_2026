import React, { Component } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { HistoricoExercicioFormulario } from "../../models/HistoricoExercicio";

interface HistoricoExercicioFormProps {
  form: HistoricoExercicioFormulario;
  editandoId: string | null;
  erro: string;
  onChange: (campo: keyof HistoricoExercicioFormulario, valor: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default class HistoricoExercicioForm extends Component<HistoricoExercicioFormProps> {
  private changeField = (
    campo: keyof HistoricoExercicioFormulario,
    valor: string,
  ) => {
    this.props.onChange(campo, valor);
  };

  render() {
    const { form, editandoId, erro, onSubmit, onCancel } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {editandoId ? "Editar historico" : "Novo historico"}
        </Text>
        <Text style={styles.subtitle}>Registre uma execucao de exercicio</Text>

        {erro ? <Text style={styles.error}>{erro}</Text> : null}

        <Text style={styles.label}>Nome do exercicio</Text>
        <TextInput
          style={styles.input}
          value={form.nomeExercicio}
          onChangeText={(valor) => this.changeField("nomeExercicio", valor)}
          placeholder="Ex.: Supino reto"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Grupo muscular</Text>
        <TextInput
          style={styles.input}
          value={form.grupoMuscular}
          onChangeText={(valor) => this.changeField("grupoMuscular", valor)}
          placeholder="Ex.: Peitoral"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Data</Text>
        <TextInput
          style={styles.input}
          value={form.dataExecucao}
          onChangeText={(valor) => this.changeField("dataExecucao", valor)}
          placeholder="AAAA-MM-DD"
          placeholderTextColor="#9CA3AF"
        />

        <View style={styles.doubleRow}>
          <View style={styles.doubleField}>
            <Text style={styles.label}>Series</Text>
            <TextInput
              style={styles.input}
              value={form.series}
              onChangeText={(valor) => this.changeField("series", valor)}
              placeholder="4"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.doubleField}>
            <Text style={styles.label}>Repeticoes</Text>
            <TextInput
              style={styles.input}
              value={form.repeticoes}
              onChangeText={(valor) => this.changeField("repeticoes", valor)}
              placeholder="12"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.doubleRow}>
          <View style={styles.doubleField}>
            <Text style={styles.label}>Carga kg</Text>
            <TextInput
              style={styles.input}
              value={form.cargaKg}
              onChangeText={(valor) => this.changeField("cargaKg", valor)}
              placeholder="20"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.doubleField}>
            <Text style={styles.label}>Duracao min</Text>
            <TextInput
              style={styles.input}
              value={form.duracaoMinutos}
              onChangeText={(valor) =>
                this.changeField("duracaoMinutos", valor)
              }
              placeholder="15"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={styles.label}>Observacoes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={form.observacoes}
          onChangeText={(valor) => this.changeField("observacoes", valor)}
          placeholder="Como foi o treino?"
          placeholderTextColor="#9CA3AF"
          multiline
        />

        <TouchableOpacity style={styles.primaryButton} onPress={onSubmit}>
          <Text style={styles.primaryButtonText}>Salvar historico</Text>
        </TouchableOpacity>

        {editandoId ? (
          <TouchableOpacity style={styles.secondaryButton} onPress={onCancel}>
            <Text style={styles.secondaryButtonText}>Cancelar edicao</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F3F4F6",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 18,
  },
  error: {
    backgroundColor: "#FEE2E2",
    color: "#DC2626",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    fontWeight: "700",
  },
  label: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "700",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    color: "#111827",
  },
  doubleRow: {
    flexDirection: "row",
    gap: 12,
  },
  doubleField: {
    flex: 1,
  },
  textArea: {
    height: 88,
    textAlignVertical: "top",
  },
  primaryButton: {
    backgroundColor: "#FF8500",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
  },
  secondaryButton: {
    alignItems: "center",
    marginTop: 14,
  },
  secondaryButtonText: {
    color: "#F28C1B",
    fontWeight: "700",
  },
});
