import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
// Cores usadas na tela Home
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
    // Área segura, faz o app respeitar margens
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Área rolável do conteúdo */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
});