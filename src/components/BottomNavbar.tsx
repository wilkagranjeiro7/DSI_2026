import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { Component, ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ActiveTab = "home" | "treinos" | "metas" | "mapa" | "perfil";
type AppRoute = "/home" | "/meus-treinos" | "/metas" | "/map" | "/perfil";

type BottomNavbarProps = {
  active: ActiveTab;
};

class BottomNavbarColors {
  static active = "#F28C1B";
  static inactive = "#9CA3AF";
}

export default class BottomNavbar extends Component<BottomNavbarProps> {
  private navigateTo = (route: AppRoute) => {
    router.push(route);
  };

  private renderTab(
    route: AppRoute,
    tab: ActiveTab,
    label: string,
    icon: ReactNode,
  ) {
    const isActive = this.props.active === tab;

    return (
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => this.navigateTo(route)}
      >
        {icon}
        <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { active } = this.props;

    return (
      <View style={styles.navbar}>
        {this.renderTab(
          "/home",
          "home",
          "Inicio",
          <Ionicons
            name="home-outline"
            size={22}
            color={
              active === "home"
                ? BottomNavbarColors.active
                : BottomNavbarColors.inactive
            }
          />,
        )}

        {this.renderTab(
          "/meus-treinos",
          "treinos",
          "Treinos",
          <MaterialCommunityIcons
            name="dumbbell"
            size={22}
            color={
              active === "treinos"
                ? BottomNavbarColors.active
                : BottomNavbarColors.inactive
            }
          />,
        )}

        {this.renderTab(
          "/metas",
          "metas",
          "Metas",
          <Feather
            name="target"
            size={22}
            color={
              active === "metas"
                ? BottomNavbarColors.active
                : BottomNavbarColors.inactive
            }
          />,
        )}

        {this.renderTab(
          "/map",
          "mapa",
          "Mapa",
          <Ionicons
            name="map-outline"
            size={22}
            color={
              active === "mapa"
                ? BottomNavbarColors.active
                : BottomNavbarColors.inactive
            }
          />,
        )}

        {this.renderTab(
          "/perfil",
          "perfil",
          "Perfil",
          <Ionicons
            name="person-outline"
            size={22}
            color={
              active === "perfil"
                ? BottomNavbarColors.active
                : BottomNavbarColors.inactive
            }
          />,
        )}
      </View>
    );
  }
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
    color: BottomNavbarColors.inactive,
    marginTop: 3,
    fontWeight: "700",
  },
  tabTextActive: {
    color: BottomNavbarColors.active,
  },
});
