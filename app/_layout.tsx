import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";

export default class RootLayout extends Component {
  render() {
    return (
      <>
        <StatusBar style="dark" />

        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="home" />
          <Stack.Screen name="map" />
          <Stack.Screen name="meus-treinos" />
          <Stack.Screen name="meus-exercicios" />
          <Stack.Screen name="criar-treino" />
          <Stack.Screen name="detalhes" />
          <Stack.Screen name="biblioteca" />
        </Stack>
      </>
    );
  }
}
