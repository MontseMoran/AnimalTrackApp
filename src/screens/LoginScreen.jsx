import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../constants/colors';


 function LoginScreen() {
  const navigation = useNavigation();
const [error, setError] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicia sesión</Text>

 <TextInput
  style={styles.input}
  placeholder="Correo electrónico"
  keyboardType="email-address"
  value={email}
  onChangeText={(text) => {
    setEmail(text);
    setError(''); // borra el error al escribir
  }}
/>

<TextInput
  style={styles.input}
  placeholder="Contraseña"
  secureTextEntry
  value={password}
  onChangeText={(text) => {
    setPassword(text);
    setError(''); 
  }}
/>

<TouchableOpacity
  style={styles.button}
  onPress={() => {
    if (email === 'prueba@correo.com' && password === '1234') {
      setError('');
      navigation.navigate('Home');
    } else {
      setError('Correo o contraseña incorrectos');
    }
  }}
>
  <Text style={styles.buttonText}>Entrar</Text>
</TouchableOpacity>

{error ? <Text style={styles.error}>{error}</Text> : null}


      <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
        <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>¿No tienes cuenta? Crear cuenta</Text>
      </TouchableOpacity>
    </View>
  );
}
export default LoginScreen;

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
    color: '#523e0b',
    marginBottom: 30,
  },
  input: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  link: {
    color: '#523e0b',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  error: {
  color: '#a33c3c',
  marginTop: 10,
  fontSize: 14,
  textAlign: 'center',
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

});
