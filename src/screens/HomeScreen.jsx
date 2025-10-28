import React, { useState, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import colors from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

function HomeScreen() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [animals, setAnimals] = useState([]);
  const flatListRef = useRef(null);
  const [showGradient, setShowGradient] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadAnimals = async () => {
        try {
          const stored = await AsyncStorage.getItem('animals');
          setAnimals(stored ? JSON.parse(stored) : []);
        } catch (err) {
          console.log('Error cargando animales:', err);
        }
      };
      loadAnimals();
    }, [])
  );

  const handleContentSizeChange = (contentWidth, contentHeight) => {
    flatListRef.current?.measure?.((x, y, width, height) => {
      if (contentHeight > height + 10) setShowGradient(true);
      else setShowGradient(false);
    });
  };

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isAtBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    setShowGradient(!isAtBottom);
  };

  return (
    <SafeAreaView style={[styles.container, { flex: 1 }]}>

      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, {userName || 'Usuario'} 🐾</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.settings}>⚙️</Text>
        </TouchableOpacity>
      </View>

    
      <View style={styles.listWrapper}>
        <FlatList
          ref={flatListRef}
          data={animals}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aún no has añadido animales 🐾</Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('AnimalDetail', { animal: item })}
            >
              <View style={styles.cardContent}>
                {item.photo ? (
                  <Image source={{ uri: item.photo }} style={styles.thumbnail} />
                ) : (
                  <View style={styles.emptyCircle} />
                )}
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.species}>{item.species}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          onContentSizeChange={handleContentSizeChange}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />

        {/* Degradado solo visible cuando hay más contenido */}
        {showGradient && (
         <LinearGradient
  colors={['transparent', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.2)']}
  style={styles.scrollHint}
/>

        )}
      </View> 

      {/* Botón añadir */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AnimalForm')}
      >
        <Text style={styles.addText}>+ Añadir animal</Text>
      </TouchableOpacity>

      {/* Cerrar sesión */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
          await AsyncStorage.removeItem('userData');
          navigation.navigate('Login');
        }}
      >
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    paddingBottom: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  settings: {
    fontSize: 24,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginVertical: 20,
  },
  listWrapper: {
    flex: 1,
    position: 'relative',
  },
  scrollHint: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 60, 
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  zIndex: 2,
},

  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  species: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  emptyCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  info: {
    flex: 1,
  },
  addButton: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  addText: {
    color: colors.cardBackground,
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: colors.buttonHover,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  logoutText: {
    color: colors.cardBackground,
    fontSize: 15,
    fontWeight: '600',
  },
});
