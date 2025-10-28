import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../constants/colors'

 function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenida a AnimalTrack 🐾</Text>
      <Text style={styles.subtitle}>
        Registra, cuida y sigue la historia clínica de tus animales desde tu móvil.
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Comenzar"
          color="#8b6b18"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </View>
  );
}
export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: colors.cardBackground,
    fontSize: 18,
    fontWeight: 'bold',
  },
});