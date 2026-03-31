import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      {/* Deixa os ícones da bateria/hora escuros (já que o fundo é branco) */}
      <StatusBar style="dark" />

      <Stack screenOptions={{ headerShown: false }}>
        {/* Adicionamos essas linhas para "registrar" as telas oficialmente */}
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
      </Stack>
    </>
  );
}
