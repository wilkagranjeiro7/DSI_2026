import { router } from "expo-router";
import React, { Component } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AuthService from "../src/services/AuthService";

interface LoginState {
  email: string;
  senha: string;
  erroEmail: string;
  erroSenha: string;
  loading: boolean;
}

class LoginValidator {
  constructor(private readonly email: string, private readonly senha: string) {}

  validate() {
    let erroEmail = "";
    let erroSenha = "";

    if (this.email.trim() === "") {
      erroEmail = "O e-mail e obrigatorio";
    } else if (!this.email.includes("@") || !this.email.includes(".")) {
      erroEmail = "E-mail invalido";
    }

    if (this.senha.trim() === "") {
      erroSenha = "A senha e obrigatoria";
    } else if (this.senha.length < 6) {
      erroSenha = "A senha deve ter pelo menos 6 caracteres";
    }

    return {
      valid: !erroEmail && !erroSenha,
      erroEmail,
      erroSenha,
    };
  }
}

export default class LoginScreen extends Component<object, LoginState> {
  state: LoginState = {
    email: "",
    senha: "",
    erroEmail: "",
    erroSenha: "",
    loading: false,
  };

  private handleEmailChange = (email: string) => {
    this.setState({ email, erroEmail: "" });
  };

  private handleSenhaChange = (senha: string) => {
    this.setState({ senha, erroSenha: "" });
  };

  private handleAcessar = async () => {
    const { email, senha } = this.state;
    const validation = new LoginValidator(email, senha).validate();

    if (!validation.valid) {
      this.setState({
        erroEmail: validation.erroEmail,
        erroSenha: validation.erroSenha,
      });
      return;
    }

    this.setState({ loading: true, erroEmail: "", erroSenha: "" });

    try {
      await AuthService.login(email, senha);
      Alert.alert("Sucesso", "Login realizado com sucesso!");
      this.setState({ email: "", senha: "" });
      router.replace("/home");
    } catch (error) {
      Alert.alert(
        "Erro de acesso",
        error instanceof Error ? error.message : "Nao foi possivel entrar.",
      );
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { email, senha, erroEmail, erroSenha, loading } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>FitMatch</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
            />
            <Text style={styles.brandText}>
              Fit<Text style={styles.brandMatch}>Match</Text>
            </Text>
          </View>

          <View style={styles.welcomeContainer}>
            <Text style={styles.title}>Seja bem vindo</Text>
            <Text style={styles.subtitle}>Efetue seu login</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, erroEmail ? styles.inputErro : null]}
                placeholder="Digite seu email"
                value={email}
                onChangeText={this.handleEmailChange}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
              {erroEmail ? <Text style={styles.errorText}>{erroEmail}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={[styles.input, erroSenha ? styles.inputErro : null]}
                placeholder="Digite sua senha"
                secureTextEntry
                value={senha}
                onChangeText={this.handleSenhaChange}
                editable={!loading}
              />
              {erroSenha ? <Text style={styles.errorText}>{erroSenha}</Text> : null}
            </View>

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={this.handleAcessar}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Acessar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.forgotContainer}
              onPress={() => router.push("/signup")}
              disabled={loading}
            >
              <Text style={styles.forgotText}>Nao tem conta? Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  headerTop: {
    width: "100%",
    height: 100,
    backgroundColor: "#F38D10",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 15,
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 30,
    marginTop: 20,
  },
  header: { alignItems: "center", marginBottom: 30 },
  logo: { width: 100, height: 100, marginBottom: 10, resizeMode: "contain" },
  brandText: { fontSize: 28, fontWeight: "bold", color: "#000" },
  brandMatch: { color: "#F38D10" },
  welcomeContainer: { alignItems: "center", marginBottom: 30 },
  title: { fontSize: 24, fontWeight: "bold", color: "#000" },
  subtitle: { fontSize: 16, color: "#888", marginTop: 5 },
  form: { width: "100%" },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, color: "#AAA", marginBottom: 5, marginLeft: 5 },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "#000",
  },
  inputErro: { borderColor: "#FF0000" },
  errorText: { color: "#FF0000", fontSize: 12, marginTop: 2, marginLeft: 5 },
  button: {
    backgroundColor: "#F38D10",
    height: 55,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  forgotContainer: { marginTop: 20, alignItems: "center" },
  forgotText: { color: "#888", fontSize: 14 },
});