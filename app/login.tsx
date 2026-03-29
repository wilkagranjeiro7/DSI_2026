// DENTRO DE app/login.tsx
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FitMatch</Text>
      
      {/* Aqui vai o resto do seu código da tela azul... */}
      <TextInput style={styles.input} placeholder="Email" />
      <TextInput style={styles.input} placeholder="Senha" secureTextEntry />
      
      <TouchableOpacity style={styles.button}>
        <Text style={{color: 'white'}}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#208AEF', // O seu azul do FitMatch
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 32, color: 'white', fontWeight: 'bold' },
  input: { backgroundColor: 'white', width: '80%', padding: 15, marginVertical: 10, borderRadius: 10 },
  button: { backgroundColor: '#003366', padding: 15, borderRadius: 10, width: '80%', alignItems: 'center' }
});