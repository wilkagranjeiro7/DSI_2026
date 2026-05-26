import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Perfil from "../../models/Perfil";

interface PerfilCardProps {
  perfil: Perfil;
  onEditar: () => void;
  onExcluir: () => void;
}

export default function PerfilCard({ perfil, onEditar, onExcluir }: PerfilCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Ionicons name="person-outline" size={42} color="#FF8500" />
      </View>

      <Text style={styles.name}>{perfil.nome}</Text>
      <Text style={styles.email}>{perfil.email}</Text>

      <View style={styles.infoBox}>
        <Info label="Telefone" value={perfil.telefone || "Não informado"} />
        <Info label="Idade" value={`${perfil.idade || 0} anos`} />
        <Info label="Peso" value={`${perfil.peso || 0} kg`} />
        <Info label="Altura" value={`${perfil.altura || 0} m`} />
        <Info label="Objetivo" value={perfil.objetivo || "Não informado"} />
        <Info label="Nível" value={perfil.nivel || "Não informado"} />
      </View>

      {perfil.observacoes ? (
        <Text style={styles.observacoes}>{perfil.observacoes}</Text>
      ) : null}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryButton} onPress={onEditar}>
          <Text style={styles.primaryButtonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dangerButton} onPress={onExcluir}>
          <Text style={styles.dangerButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#FFF4E6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
  },
  email: {
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 18,
  },
  infoBox: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    gap: 12,
  },
  infoLabel: {
    color: "#6B7280",
    fontWeight: "700",
  },
  infoValue: {
    color: "#111827",
    fontWeight: "800",
    flexShrink: 1,
    textAlign: "right",
  },
  observacoes: {
    width: "100%",
    color: "#6B7280",
    marginTop: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  primaryButton: {
    backgroundColor: "#FF8500",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 22,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: "#EF4444",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 22,
  },
  dangerButtonText: {
    color: "#EF4444",
    fontWeight: "900",
  },
});