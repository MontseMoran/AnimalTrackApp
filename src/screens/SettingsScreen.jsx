import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

 function SettingsScreen() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sí, salir',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('userData'); // borra los datos guardados
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }], // vuelve al login y limpia el historial
          });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración ⚙️</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}
export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eae0bb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#523e0b',
    marginBottom: 40,
  },
  logoutButton: {
    backgroundColor: '#b33b3b',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
