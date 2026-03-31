import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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

  // Validação de E-mail em tempo real
  const handleEmailChange = (texto: string): void => {
    setEmail(texto);

    // Se o usuário apagar tudo
    if (texto.trim() === "") {
      setErroEmail("");
    }
    // Validação instantânea: se digitar nome sem @ ou .com (ex: Kassiane Silva)
    else if (!texto.includes("@") || !texto.includes(".com")) {
      setErroEmail("E-mail inválido (use @ e .com)");
    }
    // Se estiver correto, limpa o erro na hora
    else {
      setErroEmail("");
    }
  };

  const handleSenhaChange = (texto: string): void => {
    setSenha(texto);
    // Limpa o erro assim que o usuário começar a digitar na senha
    if (erroSenha) setErroSenha("");
  };

  const salvarDadosNoStorage = async (
    novaTentativa: TentativaLogin,
  ): Promise<void> => {
    try {
      const listaExistente = await AsyncStorage.getItem("@FitMatch:usuarios");
      let listaAtualizada: TentativaLogin[] = listaExistente
        ? JSON.parse(listaExistente)
        : [];
      listaAtualizada.push(novaTentativa);
      await AsyncStorage.setItem(
        "@FitMatch:usuarios",
        JSON.stringify(listaAtualizada),
      );
      console.log("--- STORAGE ATUALIZADO ---", listaAtualizada);
    } catch (error) {
      console.log("Erro ao salvar no Storage:", error);
    }
  };

  const validarFormulario = (): boolean => {
    let valido = true;

    // Validação final do E-mail
    if (email.trim() === "") {
      setErroEmail("O e-mail é obrigatório");
      valido = false;
    } else if (!email.includes("@") || !email.includes(".com")) {
      setErroEmail("E-mail inválido (use @ e .com)");
      valido = false;
    }

    // Validação da Senha
    const temMaiuscula = /[A-Z]/.test(senha);

    if (senha.trim() === "") {
      setErroSenha("A senha é obrigatória"); // Mensagem para campo vazio
      valido = false;
    } else if (senha.length < 6) {
      setErroSenha("A senha deve ter pelo menos 6 caracteres");
      valido = false;
    } else if (!temMaiuscula) {
      setErroSenha("A senha deve ter pelo menos uma letra maiúscula");
      valido = false;
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

    await salvarDadosNoStorage(novaTentativa);
    Alert.alert("Sucesso", "Login registrado com sucesso!");
    setEmail("");
    setSenha("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoPlaceholder} />
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
              onChangeText={handleEmailChange} // Validação em tempo real
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
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  header: { alignItems: "center", marginBottom: 30 },
  logoPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: "#F38D10",
    borderRadius: 30,
    marginBottom: 10,
  },
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
