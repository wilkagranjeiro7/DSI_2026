import React, { Component } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { PerfilFormulario } from "../../models/Perfil";

interface PerfilFormProps {
  form: PerfilFormulario;
  erro: string;
  onChange: (campo: keyof PerfilFormulario, valor: string) => void;
  onTrocarFoto: () => void;
  carregandoFoto: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export default class PerfilForm extends Component<PerfilFormProps> {
  private changeField = (campo: keyof PerfilFormulario, valor: string) => {
    this.props.onChange(campo, valor);
  };

  private renderFotoPerfil() {
    const { form, onTrocarFoto, carregandoFoto } = this.props;
    const fotoUrl = form.photoUrl ? `${form.photoUrl}?t=${Date.now()}` : null;

    return (
      <View style={styles.photoSection}>
        <TouchableOpacity
          style={styles.photoPreview}
          onPress={onTrocarFoto}
          disabled={carregandoFoto}
          activeOpacity={0.8}
        >
          {fotoUrl ? (
            <Image source={{ uri: fotoUrl }} style={styles.photoImage} />
          ) : (
            <Ionicons name="person-outline" size={42} color="#FF8500" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.photoButton}
          onPress={onTrocarFoto}
          disabled={carregandoFoto}
        >
          {carregandoFoto ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={18} color="#FFFFFF" />
              <Text style={styles.photoButtonText}>
                {fotoUrl ? "Trocar foto" : "Enviar foto"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { form, erro, onSubmit, onCancel } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Editar perfil</Text>
        <Text style={styles.subtitle}>Atualize suas informacoes pessoais</Text>

        {erro ? <Text style={styles.error}>{erro}</Text> : null}

        {this.renderFotoPerfil()}

        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={form.nome}
          onChangeText={(valor) => this.changeField("nome", valor)}
          placeholder="Seu nome"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={form.email}
          onChangeText={(valor) => this.changeField("email", valor)}
          placeholder="seuemail@email.com"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          value={form.telefone}
          onChangeText={(valor) => this.changeField("telefone", valor)}
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
              onChangeText={(valor) => this.changeField("idade", valor)}
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
              onChangeText={(valor) => this.changeField("peso", valor)}
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
          onChangeText={(valor) => this.changeField("altura", valor)}
          placeholder="1.75"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Objetivo</Text>
        <TextInput
          style={styles.input}
          value={form.objetivo}
          onChangeText={(valor) => this.changeField("objetivo", valor)}
          placeholder="Ex.: Hipertrofia"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Nivel</Text>
        <TextInput
          style={styles.input}
          value={form.nivel}
          onChangeText={(valor) => this.changeField("nivel", valor)}
          placeholder="Ex.: Iniciante"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Observacoes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={form.observacoes}
          onChangeText={(valor) => this.changeField("observacoes", valor)}
          placeholder="Observacoes do perfil"
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
  photoSection: {
    alignItems: "center",
    marginBottom: 18,
  },
  photoPreview: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#FFF4E6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FF8500",
    marginBottom: 10,
  },
  photoImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  photoButton: {
    minWidth: 148,
    minHeight: 42,
    backgroundColor: "#FF8500",
    borderRadius: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  photoButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
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
