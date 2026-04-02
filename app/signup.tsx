import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  Image, ActivityIndicator, KeyboardAvoidingView, 
  Platform, ScrollView, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { useRouter } from 'expo-router';
import AuthService from '../src/services/AuthService';

const SignUpScreen = () => {
  const router = useRouter();
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      setErrorMsg("Por favor, preencha todos os campos.");
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      await AuthService.register(nome, email, senha);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 1. O KeyboardAvoidingView garante que os inputs subam com o teclado
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>FitMatch</Text>
      </View>

      {/* 2. TouchableWithoutFeedback permite fechar o teclado ao clicar fora dos inputs */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        
        {/* 3. ScrollView permite rolar a tela, essencial para logos grandes */}
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Image 
            source={require('../assets/images/LogoFitMatch.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          
          <Text style={styles.title}>Criar uma conta</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Seu nome</Text>
            <View style={[styles.inputContainer, errorMsg && !nome ? styles.inputError : null]}>
              <TextInput 
                style={styles.input} 
                placeholder="João Silva" 
                value={nome}
                onChangeText={setNome} 
              />
            </View>

            <Text style={styles.label}>E-mail</Text>
            <View style={[styles.inputContainer, errorMsg && !email ? styles.inputError : null]}>
              <TextInput 
                style={styles.input} 
                placeholder="email@exemplo.com" 
                keyboardType="email-address"
                value={email}
                autoCapitalize="none"
                onChangeText={setEmail} 
              />
            </View>

            <Text style={styles.label}>Senha</Text>
            <View style={[styles.inputContainer, errorMsg && !senha ? styles.inputError : null]}>
              <TextInput 
                style={styles.input} 
                placeholder="******" 
                secureTextEntry 
                value={senha}
                onChangeText={setSenha} 
              />
            </View>
          </View>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <TouchableOpacity 
            style={[styles.button, loading && { opacity: 0.7 }]} 
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Cadastrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/')}>
            <Text style={styles.footerText}>
              Já tem uma conta? <Text style={styles.link}>Entrar</Text>
            </Text>
          </TouchableOpacity>
          
          {/* Espaçamento extra no final para garantir que o último botão não fique colado na borda */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { 
    backgroundColor: '#F29111', 
    height: 100, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingTop: 40,
    zIndex: 10, // Garante que o header fique por cima
  },
  headerText: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  
  // Alterado de 'body' para 'scrollContainer'
  scrollContainer: { 
    paddingHorizontal: 30, 
    paddingTop: 20, 
    alignItems: 'center',
    flexGrow: 1, // Permite que o conteúdo estique e role
  },
  
  logo: { 
    width: 320, 
    height: 280, 
    marginBottom: 5, 
    resizeMode: 'contain' 
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  inputGroup: { width: '100%' },
  label: { color: '#888', marginBottom: 5, fontSize: 14, marginLeft: 5 },
  inputContainer: {
    width: '100%',
    height: 55,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    justifyContent: 'center'
  },
  inputError: { borderColor: '#E74C3C' },
  input: { fontSize: 16 },
  errorText: { color: '#E74C3C', marginBottom: 15, fontWeight: '500' },
  button: { 
    backgroundColor: '#F29111', 
    width: '100%', 
    height: 55, 
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 10,
    elevation: 4
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  footerText: { marginTop: 25, color: '#999' },
  link: { color: '#4A90E2', fontWeight: 'bold' }
});

export default SignUpScreen;