import { router } from "expo-router";
import React, { useState } from "react";
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
import { db } from "../firebaseConfig";

// Interface para o TypeScript
interface TentativaLogin {
  email: string;
  senha: string;
  data: string;
}

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");

  const [erroEmail, setErroEmail] = useState<string>("");
  const [erroSenha, setErroSenha] = useState<string>("");

  const handleEmailChange = (texto: string): void => {
    setEmail(texto);
    if (erroEmail) setErroEmail("");
  };

  const handleSenhaChange = (texto: string): void => {
    setSenha(texto);
    if (erroSenha) setErroSenha("");
  };

  // --- FUNÇÃO PARA SALVAR NO FIREBASE ---
  const salvarNoFirebase = async (
    novaTentativa: TentativaLogin,
  ): Promise<void> => {
    try {
      await addDoc(collection(db, "usuarios"), novaTentativa);
      console.log("Dados enviados para o Firebase com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar no Firebase:", error);
      throw error;
    }
  };

  const validarFormulario = (): boolean => {
    let valido = true;

    // Validação do Email
    if (email.trim() === "") {
      setErroEmail("O e-mail é obrigatório");
      valido = false;
    } else if (!email.includes("@") || !email.includes(".com")) {
      setErroEmail("E-mail inválido (use @ e .com)");
      valido = false;
    } else {
      setErroEmail("");
    }

    // --- SENHA CORRIGIDA PARA FICAR IGUAL AO SIGNUP ---
    // Agora só verifica se está vazio ou se tem menos de 6 caracteres
    if (senha.trim() === "") {
      setErroSenha("A senha é obrigatória");
      valido = false;
    } else if (senha.length < 6) {
      setErroSenha("A senha deve ter pelo menos 6 caracteres");
      valido = false;
    } else {
      setErroSenha("");
    }

    return valido;
  };

  const handleAcessar = async (): Promise<void> => {
    if (!validarFormulario()) return;

    const novaTentativa: TentativaLogin = {
      email: email,
      senha: senha,
      data: new Date().toLocaleString(),
    };

    try {
      await salvarNoFirebase(novaTentativa);
      Alert.alert("Sucesso", "Login registrado no Firebase!");
      setEmail("");
      setSenha("");
      router.replace("/home")
    } catch (error) {
      Alert.alert("Erro", "Falha ao conectar com o banco de dados.");
    }
  };

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
              onChangeText={handleEmailChange}
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
              onChangeText={handleSenhaChange}
            />
            {erroSenha ? (
              <Text style={styles.errorText}>{erroSenha}</Text>
            ) : null}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleAcessar}>
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
