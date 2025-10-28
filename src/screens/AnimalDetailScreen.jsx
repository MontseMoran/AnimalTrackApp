import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

 function AnimalDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { animal } = route.params; // Recibe el animal desde HomeScreen

  // 🗑️ Eliminar animal con confirmación
  const handleDelete = async () => {
    Alert.alert(
      'Eliminar animal',
      `¿Seguro que deseas eliminar a ${animal.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const stored = await AsyncStorage.getItem('animals');
              const animalsList = stored ? JSON.parse(stored) : [];
              const updatedList = animalsList.filter((a) => a.id !== animal.id);
              await AsyncStorage.setItem('animals', JSON.stringify(updatedList));
              navigation.navigate('Home');
            } catch (err) {
              console.log('Error eliminando animal:', err);
            }
          },
        },
      ]
    );
  };

  // ✏️ Editar animal
  const handleEdit = () => {
    navigation.navigate('AnimalForm', { animal });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {animal.photo ? (
  <Image
    source={{ uri: animal.photo }}
    style={styles.image}
    resizeMode="cover"
  />
) : (
  <Ionicons name="paw" size={80} color={colors.textSecondary} />
)}

      <Text style={styles.title}>{animal.name}</Text>
      <Text style={styles.species}>{animal.species}</Text>

      <View style={styles.detailBox}>
        {animal.breed ? <Text style={styles.detail}>Raza: {animal.breed}</Text> : null}
        {animal.sex ? <Text style={styles.detail}>Sexo: {animal.sex}</Text> : null}
        {animal.birthDate ? (
          <Text style={styles.detail}>Nacimiento: {animal.birthDate}</Text>
        ) : null}
        {animal.hasChip ? (
          <Text style={styles.detail}>Chip: {animal.chipNumber || 'Sí'}</Text>
        ) : (
          <Text style={styles.detail}>Chip: No</Text>
        )}
        {animal.isSterilized ? (
          <Text style={styles.detail}>
            Esterilizado: {animal.sterilizationDate || 'Sí'}
          </Text>
        ) : (
          <Text style={styles.detail}>Esterilizado: No</Text>
        )}
        {animal.treatmentType ? (
          <Text style={styles.detail}>
            Tratamiento: {animal.treatmentType} ({animal.treatmentDate})
          </Text>
        ) : null}
        {animal.notes ? (
          <Text style={[styles.detail, styles.notes]}>Notas: {animal.notes}</Text>
        ) : null}
      </View>

      {/* Botones Editar y Eliminar */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: '#7fa6a3' }]}
          onPress={handleEdit}
        >
          <Ionicons name="pencil" size={22} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: '#b33b3b' }]}
          onPress={handleDelete}
        >
          <Ionicons name="trash" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
export default AnimalDetailScreen;
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  species: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 15,
  },
  detailBox: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  detail: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  notes: {
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginTop: 10,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  image: {
  width: 180,
  height: 180,
  borderRadius: 90,
  marginBottom: 15,
  borderWidth: 2,
  borderColor: colors.primary,
},

});
