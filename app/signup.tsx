import { router } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import React, { Component } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import AuthService from "../src/services/AuthService";
import { auth, db } from "../src/utils/firebaseConfig";

interface SignUpState {
  nome: string;
  email: string;
  senha: string;
  loading: boolean;
  errorMsg: string;
}

export default class SignUpScreen extends Component<object, SignUpState> {
  state: SignUpState = {
    nome: "",
    email: "",
    senha: "",
    loading: false,
    errorMsg: "",
  };

  private setNome = (nome: string) => {
    this.setState({ nome });
  };

  private setEmail = (email: string) => {
    this.setState({ email });
  };

  private setSenha = (senha: string) => {
    this.setState({ senha });
  };

  private handleRegister = async () => {
    const { nome, email, senha } = this.state;

    if (!nome || !email || !senha) {
      this.setState({ errorMsg: "Por favor, preencha todos os campos." });
      return;
    }

    this.setState({ errorMsg: "", loading: true });

    try {
      await AuthService.register(nome, email, senha);

      const user = auth.currentUser;

      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          name: nome,
          email,
          createdAt: new Date().toISOString(),
        });
      }

      Alert.alert("Sucesso", "Conta criada com sucesso! Seja bem-vindo(a).");
      router.replace("/login");
    } catch (err: any) {
      console.error("ERRO COMPLETO NO CADASTRO:", err);
      this.setState({
        errorMsg:
          "Erro: " + (err.message || "Falha ao conectar. Verifique o console."),
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { nome, email, senha, loading, errorMsg } = this.state;

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>FitMatch</Text>
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <Image
              source={require("../assets/images/LogoFitMatch.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.title}>Criar uma conta</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Seu nome</Text>
              <View
                style={[
                  styles.inputContainer,
                  errorMsg && !nome ? styles.inputError : null,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Joao Silva"
                  value={nome}
                  onChangeText={this.setNome}
                />
              </View>

              <Text style={styles.label}>E-mail</Text>
              <View
                style={[
                  styles.inputContainer,
                  errorMsg && !email ? styles.inputError : null,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="email@exemplo.com"
                  keyboardType="email-address"
                  value={email}
                  autoCapitalize="none"
                  onChangeText={this.setEmail}
                />
              </View>

              <Text style={styles.label}>Senha</Text>
              <View
                style={[
                  styles.inputContainer,
                  errorMsg && !senha ? styles.inputError : null,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="******"
                  secureTextEntry
                  value={senha}
                  onChangeText={this.setSenha}
                />
              </View>
            </View>

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={this.handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Cadastrar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace("/login")}>
              <Text style={styles.footerText}>
                Ja tem uma conta? <Text style={styles.link}>Entrar</Text>
              </Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8" },
  header: {
    backgroundColor: "#F29111",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
    zIndex: 10,
  },
  headerText: { color: "white", fontSize: 22, fontWeight: "bold" },
  scrollContainer: {
    paddingHorizontal: 30,
    paddingTop: 20,
    alignItems: "center",
    flexGrow: 1,
  },
  logo: {
    width: 320,
    height: 280,
    marginBottom: 5,
    resizeMode: "contain",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  inputGroup: { width: "100%" },
  label: { color: "#888", marginBottom: 5, fontSize: 14, marginLeft: 5 },
  inputContainer: {
    width: "100%",
    height: 55,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    justifyContent: "center",
  },
  inputError: { borderColor: "#E74C3C" },
  input: { fontSize: 16 },
  errorText: { color: "#E74C3C", marginBottom: 15, fontWeight: "500" },
  button: {
    backgroundColor: "#F29111",
    width: "100%",
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    elevation: 4,
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  footerText: { marginTop: 25, color: "#999" },
  link: { color: "#4A90E2", fontWeight: "bold" },
});
