import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../constants/colors';

import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function RegisterScreen() {
  const navigation = useNavigation();
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [error, setError] = useState('');

const handleRegister = async () => {
  if (!name || !email || !password || !confirmPassword) {
    setError('Por favor, completa todos los campos.');
    return;
  }

  if (password !== confirmPassword) {
    setError('Las contraseñas no coinciden.');
    return;
  }

  try {
    
    const userData = {
      name,
      email,
      password,
    };

    
    await AsyncStorage.setItem('userData', JSON.stringify(userData));

    setError('');
    navigation.navigate('Home', { userName: name }); 
  } catch (err) {
    console.log('Error al registrar usuario:', err);
    setError('Hubo un problema al guardar los datos.');
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

     <TextInput
  style={styles.input}
  placeholder="Nombre"
  value={name}
  onChangeText={setName}
/>


    <TextInput
  style={styles.input}
  placeholder="Correo electrónico"
  keyboardType="email-address"
  value={email}
  onChangeText={setEmail}
/>

<TextInput
  style={styles.input}
  placeholder="Contraseña"
  secureTextEntry
  value={password}
  onChangeText={setPassword}
/>

<TextInput
  style={styles.input}
  placeholder="Confirmar contraseña"
  secureTextEntry
  value={confirmPassword}
  onChangeText={setConfirmPassword}
/>


  <TouchableOpacity style={styles.button} onPress={handleRegister}>
  <Text style={styles.buttonText}>Registrarse</Text>
</TouchableOpacity>


{error ? <Text style={styles.error}>{error}</Text> : null}



      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}
export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    backgroundColor: colors.cardBackground,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    color: colors.textPrimary,
  },
  button: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 15,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: colors.cardBackground,
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: colors.textSecondary,
    marginTop: 15,
    textDecorationLine: 'underline',
  },
  error: {
    color: colors.error,
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
  },
});



