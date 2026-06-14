import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Perfil from "../../models/Perfil";

interface PerfilCardProps {
  perfil: Perfil;
  onEditar: () => void;
  onExcluir: () => void;
  onTrocarFoto: () => void; // Adicionado
  carregandoFoto: boolean; // Adicionado
}

export default function PerfilCard({ 
  perfil, 
  onEditar, 
  onExcluir, 
  onTrocarFoto, 
  carregandoFoto 
}: PerfilCardProps) {
  
  const fotoUrl = (perfil as any).photoUrl 
    ? `${(perfil as any).photoUrl}?t=${new Date().getTime()}` 
    : null;

  return (
    <View style={styles.card}>
      
      {/* 📸 UNIFICADO: A foto agora é clicável e tem a camerazinha acoplada */}
      <View style={styles.avatarWrapper}>
        <TouchableOpacity onPress={onTrocarFoto} disabled={carregandoFoto} activeOpacity={0.8}>
          {fotoUrl ? (
            <Image source={{ uri: fotoUrl }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person-outline" size={42} color="#FF8500" />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cameraBadge}
          onPress={onTrocarFoto}
          disabled={carregandoFoto}
        >
          {carregandoFoto ? (
            <ActivityIndicator size="small" color="#FF8500" />
          ) : (
            <Ionicons name="camera" size={16} color="#FF8500" />
          )}
        </TouchableOpacity>
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
  // 🎨 Engenharia do CSS para acoplar o botão flutuante da câmera perfeitamente
  avatarWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  avatarImage: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 2,
    borderColor: "#FF8500",
  },
  avatarPlaceholder: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#FFF4E6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FF8500",
  },
  cameraBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#FFFFFF",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#E5E7EB",
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