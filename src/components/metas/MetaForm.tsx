import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    MetaFormulario,
    TipoRelacionamentoFormulario,
} from "../../models/Meta";

interface MetaFormProps {
  form: MetaFormulario;
  editandoId: string | null;
  erro: string;
  onChange: (campo: keyof MetaFormulario, valor: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

class MetaRelationshipOptions {
  static readonly values: {
    label: string;
    value: TipoRelacionamentoFormulario;
  }[] = [
    { label: "Nenhum", value: "" },
    { label: "Treino", value: "treino" },
    { label: "Exercicio", value: "exercicio" },
    { label: "Local", value: "local" },
  ];
}

export default class MetaForm extends Component<MetaFormProps> {
  private changeField = (campo: keyof MetaFormulario, valor: string) => {
    this.props.onChange(campo, valor);
  };

  private renderRelationshipOptions() {
    const { form } = this.props;

    return MetaRelationshipOptions.values.map((tipo) => (
      <TouchableOpacity
        key={tipo.value}
        style={[
          styles.optionButton,
          form.relacionadoTipo === tipo.value && styles.optionButtonActive,
        ]}
        onPress={() => this.changeField("relacionadoTipo", tipo.value)}
      >
        <Text
          style={[
            styles.optionText,
            form.relacionadoTipo === tipo.value && styles.optionTextActive,
          ]}
        >
          {tipo.label}
        </Text>
      </TouchableOpacity>
    ));
  }

  render() {
    const { form, editandoId, erro, onSubmit, onCancel } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {editandoId ? "Editar meta" : "Nova meta"}
        </Text>
        <Text style={styles.subtitle}>Defina um objetivo para acompanhar</Text>

        {erro ? <Text style={styles.error}>{erro}</Text> : null}

        <Text style={styles.label}>Titulo da meta</Text>
        <TextInput
          style={styles.input}
          value={form.titulo}
          onChangeText={(valor) => this.changeField("titulo", valor)}
          placeholder="Ex.: Correr 10 km"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Categoria</Text>
        <TextInput
          style={styles.input}
          value={form.categoria}
          onChangeText={(valor) => this.changeField("categoria", valor)}
          placeholder="Ex.: Cardio"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Valor atual</Text>
        <TextInput
          style={styles.input}
          value={form.valorAtual}
          onChangeText={(valor) => this.changeField("valorAtual", valor)}
          placeholder="Ex.: 5"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Valor desejado</Text>
        <TextInput
          style={styles.input}
          value={form.valorDesejado}
          onChangeText={(valor) => this.changeField("valorDesejado", valor)}
          placeholder="Ex.: 10"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Unidade</Text>
        <TextInput
          style={styles.input}
          value={form.unidade}
          onChangeText={(valor) => this.changeField("unidade", valor)}
          placeholder="Ex.: km, kg, treinos"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Data limite</Text>
        <TextInput
          style={styles.input}
          value={form.dataLimite}
          onChangeText={(valor) => this.changeField("dataLimite", valor)}
          placeholder="Ex.: 30/12/2026"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Relacionar com</Text>
        <View style={styles.optionsContainer}>
          {this.renderRelationshipOptions()}
        </View>

        <TextInput
          style={styles.input}
          value={form.relacionadoId}
          onChangeText={(valor) => this.changeField("relacionadoId", valor)}
          placeholder="ID relacionado, se houver"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Observacoes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={form.observacoes}
          onChangeText={(valor) => this.changeField("observacoes", valor)}
          placeholder="Motivacao, anotacoes e contexto"
          placeholderTextColor="#9CA3AF"
          multiline
        />

        <TouchableOpacity style={styles.primaryButton} onPress={onSubmit}>
          <Text style={styles.primaryButtonText}>Salvar meta</Text>
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
  textArea: {
    height: 88,
    textAlignVertical: "top",
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: "#F28C1B",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },
  optionButtonActive: {
    backgroundColor: "#FFF4E6",
  },
  optionText: {
    color: "#F28C1B",
    fontWeight: "700",
    fontSize: 12,
  },
  optionTextActive: {
    color: "#F28C1B",
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
