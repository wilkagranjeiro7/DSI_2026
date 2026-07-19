<<<<<<< Updated upstream
import React, { Component } from "react";
import SignUpScreen from "./signup";

export default class Index extends Component {
  render() {
    return <SignUpScreen />;
  }
=======
import { Redirect } from "expo-router";

export default function Index() {
  // Isso vai mandar o app direto para a tela de login.tsx assim que abrir
  return <Redirect href="/login" />;
>>>>>>> Stashed changes
}
