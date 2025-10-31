import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


 function LoginScreen() {
  const navigation = useNavigation();
const [error, setError] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [remember, setRemember] = useState(false);



useEffect(() => {
  const loadSavedEmail = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('savedEmail');
      if (savedEmail) {
        setEmail(savedEmail);
        setRemember(true);
      }
    } catch (error) {
      console.log('Error al cargar correo guardado:', error);
    }
  };

  loadSavedEmail();
}, []);

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

<View style={styles.passwordContainer}>
  <TextInput
    style={styles.passwordInput}
    placeholder="Contraseña"
    secureTextEntry={!showPassword}
    value={password}
    onChangeText={(text) => {
      setPassword(text);
      setError('');
    }}
  />

  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
    <Ionicons
      name={showPassword ? 'eye-off' : 'eye'}
      size={22}
      color="#555"
    />
  </TouchableOpacity>
</View>

<View style={styles.rememberContainer}>
  <TouchableOpacity onPress={() => setRemember(!remember)}>
    <Ionicons
      name={remember ? 'checkbox' : 'square-outline'}
      size={22}
      color="#007AFF"
    />
  </TouchableOpacity>
  <Text style={styles.rememberText}>Recuérdame</Text>
</View>


<TouchableOpacity
  style={styles.button}
  onPress={async () => {
    if (email === 'prueba@correo.com' && password === '1234') {
      setError('');

      // Guarda el correo si el usuario marca "Recuérdame"
      if (remember) {
        await AsyncStorage.setItem('savedEmail', email);
      } else {
        await AsyncStorage.removeItem('savedEmail');
      }


      await AsyncStorage.setItem('isLoggedIn', 'true');

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
passwordContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  paddingHorizontal: 10,
  marginBottom: 12,
  width: '80%', 
  backgroundColor: '#fff',
},
passwordInput: {
  flex: 1,
  height: 40,
},
rememberContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 20,
},
rememberText: {
  marginLeft: 8,
  fontSize: 16,
  color: '#333',
},

});
