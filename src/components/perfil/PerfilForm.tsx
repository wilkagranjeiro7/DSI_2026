import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { PerfilFormulario } from "../../models/Perfil";

interface PerfilFormProps {
  form: PerfilFormulario;
  erro: string;
  onChange: (campo: keyof PerfilFormulario, valor: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function PerfilForm({
  form,
  erro,
  onChange,
  onSubmit,
  onCancel,
}: PerfilFormProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar perfil</Text>
      <Text style={styles.subtitle}>Atualize suas informações pessoais</Text>

      {erro ? <Text style={styles.error}>{erro}</Text> : null}

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={form.nome}
        onChangeText={(valor) => onChange("nome", valor)}
        placeholder="Seu nome"
        placeholderTextColor="#9CA3AF"
      />

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        value={form.email}
        onChangeText={(valor) => onChange("email", valor)}
        placeholder="seuemail@email.com"
        placeholderTextColor="#9CA3AF"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        style={styles.input}
        value={form.telefone}
        onChangeText={(valor) => onChange("telefone", valor)}
        placeholder="(11) 99999-9999"
        placeholderTextColor="#9CA3AF"
        keyboardType="phone-pad"
      />

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Idade</Text>
          <TextInput
            style={styles.input}
            value={form.idade}
            onChangeText={(valor) => onChange("idade", valor)}
            placeholder="22"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.column}>
          <Text style={styles.label}>Peso</Text>
          <TextInput
            style={styles.input}
            value={form.peso}
            onChangeText={(valor) => onChange("peso", valor)}
            placeholder="70"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
        </View>
      </View>

      <Text style={styles.label}>Altura</Text>
      <TextInput
        style={styles.input}
        value={form.altura}
        onChangeText={(valor) => onChange("altura", valor)}
        placeholder="1.75"
        placeholderTextColor="#9CA3AF"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Objetivo</Text>
      <TextInput
        style={styles.input}
        value={form.objetivo}
        onChangeText={(valor) => onChange("objetivo", valor)}
        placeholder="Ex.: Hipertrofia"
        placeholderTextColor="#9CA3AF"
      />

      <Text style={styles.label}>Nível</Text>
      <TextInput
        style={styles.input}
        value={form.nivel}
        onChangeText={(valor) => onChange("nivel", valor)}
        placeholder="Ex.: Iniciante"
        placeholderTextColor="#9CA3AF"
      />

      <Text style={styles.label}>Observações</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={form.observacoes}
        onChangeText={(valor) => onChange("observacoes", valor)}
        placeholder="Observações do perfil"
        placeholderTextColor="#9CA3AF"
        multiline
      />

      <TouchableOpacity style={styles.primaryButton} onPress={onSubmit}>
        <Text style={styles.primaryButtonText}>Salvar perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={onCancel}>
        <Text style={styles.secondaryButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F3F4F6",
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#111827",
  },
  subtitle: {
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
    height: 90,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  column: {
    flex: 1,
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
    fontWeight: "900",
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