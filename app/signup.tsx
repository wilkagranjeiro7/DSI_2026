<<<<<<< Updated upstream
import { router } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import React, { Component } from "react";
=======
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useState } from "react";
>>>>>>> Stashed changes
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
<<<<<<< Updated upstream
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
=======
import { auth, db } from "../src/utils/firebaseConfig";

export default function SignUpScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fazerCadastro = async () => {
    console.log("Botão pressionado!");

    if (!email.trim() || !senha.trim() || !nome.trim()) {
      Alert.alert(
        "Atenção",
        "Kassy, preencha todos os campos antes de continuar!",
      );
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        senha,
      );

      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        nome: nome,
        email: email.trim(),
        uid: user.uid,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Parabéns!", "Conta criada com sucesso no FitMatch!");
      router.replace("/");
    } catch (error: any) {
      console.error("ERRO DETALHADO:", error);

      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Ops!", "Este e-mail já está sendo usado.");
      } else if (error.code === "auth/weak-password") {
        Alert.alert(
          "Senha Fraca",
          "A senha precisa ter pelo menos 6 caracteres.",
        );
      } else {
        Alert.alert(
          "Erro",
          "Não conseguimos salvar. Verifique a internet ou as chaves do Firebase.",
        );
      }
>>>>>>> Stashed changes
    } finally {
      this.setState({ loading: false });
    }
  };

<<<<<<< Updated upstream
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
=======
  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho Fixo */}
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>FitMatch</Text>
      </View>

      {/* ScrollView com as barras escondidas */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
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
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Cadastre-se para começar</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                placeholder="Seu nome completo"
                value={nome}
                onChangeText={setNome}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="No mínimo 6 caracteres"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={fazerCadastro}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
>>>>>>> Stashed changes
              ) : (
                <Text style={styles.buttonText}>Cadastrar</Text>
              )}
            </TouchableOpacity>

<<<<<<< Updated upstream
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
=======
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={() => router.push("/")}>
                <Text style={styles.linkText}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
>>>>>>> Stashed changes
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerTop: {
    width: "100%",
    height: 100,
    backgroundColor: "#F38D10",
    justifyContent: "flex-end",
    alignItems: "center",
<<<<<<< Updated upstream
    paddingTop: 40,
    zIndex: 10,
  },
  headerText: { color: "white", fontSize: 22, fontWeight: "bold" },
  scrollContainer: {
    paddingHorizontal: 30,
    paddingTop: 20,
    alignItems: "center",
    flexGrow: 1,
=======
    paddingBottom: 15,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 40,
    marginTop: 20,
    width: "100%", // Garante que o conteúdo não passe da tela
  },
  header: {
    alignItems: "center",
    marginBottom: 25,
>>>>>>> Stashed changes
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 10,
    resizeMode: "contain",
  },
  brandText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  brandMatch: {
    color: "#F38D10",
  },
  welcomeContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginTop: 5,
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#AAA",
    marginBottom: 5,
    marginLeft: 5,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "#000",
  },
  button: {
    backgroundColor: "#F38D10",
    height: 55,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerContainer: {
    flexDirection: "row",
    marginTop: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    color: "#888",
    fontSize: 14,
  },
  linkText: {
    color: "#007BFF",
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
