import { router } from "expo-router";
import React, { Component } from "react";
import {
    Alert,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// --- IMPORTAÇÕES DO FIREBASE ---
import { addDoc, collection } from "firebase/firestore";
import { db } from "../src/utils/firebaseConfig";

// Interface para o TypeScript
interface TentativaLogin {
  email: string;
  senha: string;
  data: string;
}

// Interfaces de Propriedades e Estado para a Classe
interface Props {}

interface State {
  email: string;
  senha: string;
  erroEmail: string;
  erroSenha: string;
}

export default class LoginScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // Inicialização do estado na POO
    this.state = {
      email: "",
      senha: "",
      erroEmail: "",
      erroSenha: "",
    };
  }

  handleEmailChange = (texto: string): void => {
    this.setState({ email: texto });
    if (this.state.erroEmail) {
      this.setState({ erroEmail: "" });
    }
  };

  handleSenhaChange = (texto: string): void => {
    this.setState({ senha: texto });
    if (this.state.erroSenha) {
      this.setState({ erroSenha: "" });
    }
  };

  // --- FUNÇÃO PARA SALVAR NO FIREBASE ---
  salvarNoFirebase = async (novaTentativa: TentativaLogin): Promise<void> => {
    try {
      await addDoc(collection(db, "usuarios"), novaTentativa);
      console.log("Dados enviados para o Firebase com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar no Firebase:", error);
      throw error;
    }
  };

  validarFormulario = (): boolean => {
    let valido = true;
    const { email, senha } = this.state;
    let novoErroEmail = "";
    let novoErroSenha = "";

    // Validação do Email
    if (email.trim() === "") {
      novoErroEmail = "O e-mail é obrigatório";
      valido = false;
    } else if (!email.includes("@") || !email.includes(".com")) {
      novoErroEmail = "E-mail inválido (use @ e .com)";
      valido = false;
    }

    // --- SENHA CORRIGIDA PARA FICAR IGUAL AO SIGNUP ---
    if (senha.trim() === "") {
      novoErroSenha = "A senha é obrigatória";
      valido = false;
    } else if (senha.length < 6) {
      novoErroSenha = "A senha deve ter pelo menos 6 caracteres";
      valido = false;
    }

    // Atualiza os erros de uma só vez no estado
    this.setState({ erroEmail: novoErroEmail, erroSenha: novoErroSenha });

    return valido;
  };

  handleAcessar = async (): Promise<void> => {
    if (!this.validarFormulario()) return;

    const { email, senha } = this.state;

    const novaTentativa: TentativaLogin = {
      email: email,
      senha: senha,
      data: new Date().toLocaleString(),
    };

    try {
      await this.salvarNoFirebase(novaTentativa);
      Alert.alert("Sucesso", "Login realizado com sucesso!");
      this.setState({ email: "", senha: "" });
      router.replace("/home");
    } catch (error) {
      Alert.alert("Erro", "Falha ao conectar com o banco de dados.");
    }
  };

  render() {
    // Desestruturação do estado para facilitar o uso no JSX
    const { email, senha, erroEmail, erroSenha } = this.state;

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
              />
              {erroEmail ? (
                <Text style={styles.errorText}>{erroEmail}</Text>
              ) : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={[styles.input, erroSenha ? styles.inputErro : null]}
                placeholder="Digite sua senha"
                secureTextEntry
                value={senha}
                onChangeText={this.handleSenhaChange}
              />
              {erroSenha ? (
                <Text style={styles.errorText}>{erroSenha}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={this.handleAcessar}
            >
              <Text style={styles.buttonText}>Acessar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotContainer}>
              <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
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
