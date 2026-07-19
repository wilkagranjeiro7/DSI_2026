import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  RegistroHidratacaoFormulario,
  TipoBebida,
} from "../../models/RegistroHidratacao";

interface RegistroHidratacaoFormProps {
  form: RegistroHidratacaoFormulario;
  editando: boolean;
  mensagem: string;
  salvando: boolean;
  onChange: (campo: keyof RegistroHidratacaoFormulario, valor: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

interface OpcaoBebida {
  valor: TipoBebida;
  rotulo: string;
}

const bebidas: OpcaoBebida[] = [
  { valor: "agua", rotulo: "Água" },
  { valor: "agua_coco", rotulo: "Água de coco" },
  { valor: "isotonico", rotulo: "Isotônico" },
  { valor: "cha", rotulo: "Chá" },
];

export default class RegistroHidratacaoForm extends Component<RegistroHidratacaoFormProps> {
  private renderCampo(
    rotulo: string,
    campo: keyof RegistroHidratacaoFormulario,
    placeholder: string,
    options: { keyboardType?: "numeric"; multiline?: boolean; maxLength?: number } = {},
  ) {
    const { form, onChange } = this.props;

    return (
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{rotulo}</Text>
        <TextInput
          style={[styles.input, options.multiline && styles.textArea]}
          value={form[campo]}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType={options.keyboardType}
          multiline={options.multiline}
          maxLength={options.maxLength}
          onChangeText={(valor) => onChange(campo, valor)}
        />
      </View>
    );
  }

  render() {
    const {
      form,
      editando,
      mensagem,
      salvando,
      onChange,
      onSubmit,
      onCancel,
    } = this.props;

    return (
      <View style={styles.card}>
        <Text style={styles.title}>
          {editando ? "Editar consumo" : "Registrar consumo"}
        </Text>
        <Text style={styles.subtitle}>
          Preencha os dados da bebida consumida.
        </Text>

        {this.renderCampo(
          "Quantidade (ml)",
          "quantidadeMl",
          "Ex.: 300",
          { keyboardType: "numeric" },
        )}

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Tipo de bebida</Text>
          <View style={styles.chips}>
            {bebidas.map((bebida) => {
              const selecionada = form.tipoBebida === bebida.valor;

              return (
                <TouchableOpacity
                  key={bebida.valor}
                  style={[styles.chip, selecionada && styles.chipSelected]}
                  onPress={() => onChange("tipoBebida", bebida.valor)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selecionada && styles.chipTextSelected,
                    ]}
                  >
                    {bebida.rotulo}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfField}>
            {this.renderCampo("Data", "data", "AAAA-MM-DD")}
          </View>
          <View style={styles.halfField}>
            {this.renderCampo("Hora", "hora", "HH:mm")}
          </View>
        </View>

        {this.renderCampo(
          "Observação (opcional)",
          "observacoes",
          "Ex.: depois do treino",
          { multiline: true, maxLength: 200 },
        )}

        {mensagem ? <Text style={styles.message}>{mensagem}</Text> : null}

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
            disabled={salvando}
          >
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, salvando && styles.disabledButton]}
            onPress={onSubmit}
            disabled={salvando}
          >
            <Text style={styles.saveText}>
              {salvando ? "Salvando..." : "Salvar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  title: { fontSize: 24, fontWeight: "900", color: "#111827" },
  subtitle: { color: "#6B7280", marginTop: 4, marginBottom: 20 },
  fieldGroup: { marginBottom: 15 },
  label: { color: "#374151", fontSize: 13, fontWeight: "800", marginBottom: 7 },
  input: {
    minHeight: 46,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 11,
    paddingHorizontal: 12,
    color: "#111827",
    fontSize: 15,
  },
  textArea: { minHeight: 90, paddingTop: 12, textAlignVertical: "top" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#F9FAFB",
  },
  chipSelected: { backgroundColor: "#E0F2FE", borderColor: "#0EA5E9" },
  chipText: { color: "#4B5563", fontSize: 12, fontWeight: "700" },
  chipTextSelected: { color: "#0369A1" },
  row: { flexDirection: "row", gap: 10 },
  halfField: { flex: 1 },
  message: {
    backgroundColor: "#FEE2E2",
    color: "#B91C1C",
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    fontWeight: "700",
  },
  buttons: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  cancelButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  cancelText: { color: "#4B5563", fontWeight: "800" },
  saveButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#F28C1B",
  },
  disabledButton: { opacity: 0.6 },
  saveText: { color: "#FFFFFF", fontWeight: "900" },
});
