import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
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
            <TextInput style={styles.input} placeholder="Digite seu email" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.button}>
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
  },
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
