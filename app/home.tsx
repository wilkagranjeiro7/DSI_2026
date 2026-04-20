import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const colors = {
  primary: "#F28C1B",
  primaryDark: "#D97706",
  background: "#F3F4F6",
  card: "#F1F1FB",
  white: "#FFFFFF",
  text: "#111827",
  textSoft: "#8E8EA0",
  border: "#F28C1B",
  tabBg: "#FFFFFF",
};

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
            <MaterialCommunityIcons
              name="dumbbell"
              size={24}
              color={colors.white}
              style={{ marginLeft: 12 }}
            />
            <Text style={styles.headerTitle}>FitMatch</Text>
          </View>

          <View style={styles.headerRight}>
            <Feather name="help-circle" size={20} color={colors.white} />
            <Feather
              name="log-out"
              size={20}
              color={colors.white}
              style={{ marginLeft: 14 }}
            />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.greetingRow}>
            <View style={styles.avatar} />
            <View>
              <Text style={styles.greetingTitle}>Olá, Ana!</Text>
              <Text style={styles.greetingSubtitle}>Bem vinda ao FitMatch</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    height: 64,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "700",
    marginLeft: 12,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 18,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#D8D8EE",
    marginRight: 12,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  greetingSubtitle: {
    fontSize: 15,
    color: colors.textSoft,
    marginTop: 2,
  },
});