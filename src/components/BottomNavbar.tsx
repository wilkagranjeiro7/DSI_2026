import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ActiveTab = "home" | "treinos" | "metas" | "mapa" | "perfil";

type BottomNavbarProps = {
  active: ActiveTab;
};

const ACTIVE_COLOR = "#F28C1B";
const INACTIVE_COLOR = "#9CA3AF";

export default function BottomNavbar({ active }: BottomNavbarProps) {
  const router = useRouter();

  return (
    <View style={styles.navbar}>
      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/home")}>
        <Ionicons
          name="home-outline"
          size={22}
          color={active === "home" ? ACTIVE_COLOR : INACTIVE_COLOR}
        />
        <Text style={[styles.tabText, active === "home" && styles.tabTextActive]}>
          Início
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/meus-treinos")}>
        <MaterialCommunityIcons
          name="dumbbell"
          size={22}
          color={active === "treinos" ? ACTIVE_COLOR : INACTIVE_COLOR}
        />
        <Text style={[styles.tabText, active === "treinos" && styles.tabTextActive]}>
          Treinos
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/metas")}>
        <Feather
          name="target"
          size={22}
          color={active === "metas" ? ACTIVE_COLOR : INACTIVE_COLOR}
        />
        <Text style={[styles.tabText, active === "metas" && styles.tabTextActive]}>
          Metas
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/map")}>
        <Ionicons
          name="map-outline"
          size={22}
          color={active === "mapa" ? ACTIVE_COLOR : INACTIVE_COLOR}
        />
        <Text style={[styles.tabText, active === "mapa" && styles.tabTextActive]}>
          Mapa
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/perfil")}>
        <Ionicons
          name="person-outline"
          size={22}
          color={active === "perfil" ? ACTIVE_COLOR : INACTIVE_COLOR}
        />
        <Text style={[styles.tabText, active === "perfil" && styles.tabTextActive]}>
          Perfil
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    position: "absolute",
    bottom: 0,
    left: 16,
    right: 16,
    height: 66,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 12,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    zIndex: 20,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 54,
  },
  tabText: {
    fontSize: 10,
    color: INACTIVE_COLOR,
    marginTop: 3,
    fontWeight: "700",
  },
  tabTextActive: {
    color: ACTIVE_COLOR,
  },
});