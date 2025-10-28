import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../constants/colors';
import { resetServerContext } from 'expo-font/build/server';

 function ResetPasswordScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar contraseña</Text>

      <Text style={styles.subtitle}>
        Introduce tu correo electrónico y te enviaremos las instrucciones para
        restablecer tu contraseña.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
      />

    
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Volver al inicio de sesión</Text>
      </TouchableOpacity>
    </View>
  );
}
export default ResetPasswordScreen;
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
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  input: {
    width: '80%',
    backgroundColor: colors.cardBackground,
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  button: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
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
    color: colors.textPrimary,
    marginTop: 15,
    textDecorationLine: 'underline',
  },
});
