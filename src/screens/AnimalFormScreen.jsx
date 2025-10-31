import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import colors from "../constants/colors";
import * as Notifications from "expo-notifications";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

function AnimalFormScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const editingAnimal = route.params?.animal || null;

  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [sex, setSex] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [hasChip, setHasChip] = useState(false);
  const [chipNumber, setChipNumber] = useState("");
  const [isSterilized, setIsSterilized] = useState(false);
  const [sterilizationDate, setSterilizationDate] = useState("");
  const [treatments, setTreatments] = useState([]);
  const [tempType, setTempType] = useState("");
  const [tempName, setTempName] = useState("");
  const [tempDate, setTempDate] = useState("");
  const [tempNotes, setTempNotes] = useState("");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState("");
  const [editingTreatmentId, setEditingTreatmentId] = useState(null);

  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderDate, setReminderDate] = useState(null);
  const [reminderRepeat, setReminderRepeat] = useState("once");
  const [customHours, setCustomHours] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [veterinaryReports, setVeterinaryReports] = useState([]);

  useEffect(() => {
    if (editingAnimal) {
      setName(editingAnimal.name || "");
      setSpecies(editingAnimal.species || "");
      setBreed(editingAnimal.breed || "");
      setSex(editingAnimal.sex || "");
      setBirthDate(editingAnimal.birthDate || "");
      setHasChip(editingAnimal.hasChip || false);
      setChipNumber(editingAnimal.chipNumber || "");
      setIsSterilized(editingAnimal.isSterilized || false);
      setSterilizationDate(editingAnimal.sterilizationDate || "");
      setTreatments(editingAnimal.treatments || []);
      setNotes(editingAnimal.notes || "");
      setPhoto(editingAnimal.photo || "");
    }
  }, [editingAnimal]);

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      Toast.show({
        type: "error",
        text1: "Falta el nombre 🐾",
        text2: "Por favor, escribe el nombre del animal.",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    const newAnimal = {
      id: editingAnimal ? editingAnimal.id : Date.now(),
      name,
      species,
      breed,
      sex,
      birthDate,
      hasChip,
      chipNumber,
      isSterilized,
      sterilizationDate,
      treatments,
      notes,
      photo,
    };

    try {
      const stored = await AsyncStorage.getItem("animals");
      const animalsList = stored ? JSON.parse(stored) : [];

      const updatedList = editingAnimal
        ? animalsList.map((a) => (a.id === editingAnimal.id ? newAnimal : a))
        : [...animalsList, newAnimal];

      await AsyncStorage.setItem("animals", JSON.stringify(updatedList));

      Toast.show({
        type: "success",
        text1: editingAnimal
          ? `${name} actualizado correctamente 🐾`
          : `${name} se ha guardado correctamente 🐾`,
        position: "top",
        visibilityTime: 2000,
      });

      navigation.goBack();
    } catch (err) {
      console.log("Error guardando animal", err);
      Toast.show({
        type: "error",
        text1: "Error al guardar",
        text2: "Intenta de nuevo.",
        position: "top",
        visibilityTime: 3000,
      });
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Necesitas permitir el acceso a la cámara 🐾");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const scheduleNotification = async (title, body, dateTime, repeat, hours) => {
    try {
      let trigger;

      if (repeat === "once") {
        trigger = new Date(dateTime);
      } else if (repeat === "daily") {
        trigger = {
          hour: dateTime.getHours(),
          minute: dateTime.getMinutes(),
          repeats: true,
        };
      } else if (repeat === "weekly") {
        trigger = {
          weekday: dateTime.getDay(),
          hour: dateTime.getHours(),
          minute: dateTime.getMinutes(),
          repeats: true,
        };
      } else if (repeat === "customHours" && hours) {
        trigger = { seconds: parseInt(hours) * 3600, repeats: true };
      }

      await Notifications.scheduleNotificationAsync({
        content: { title, body, sound: true },
        trigger,
      });
      console.log("🔔 Notificación programada:", title, trigger);
    } catch (error) {
      console.log("Error al programar notificación:", error);
    }
  };

  const handleAddTreatment = () => {
    if (!tempType.trim() || !tempName.trim()) return;

    const newTreatment = {
      id: editingTreatmentId || Date.now(),
      type: tempType,
      name: tempName,
      date: tempDate,
      notes: tempNotes,
      reminderEnabled,
      reminderDate,
      reminderRepeat,
      customHours,
    };

    if (editingTreatmentId) {
      setTreatments(
        treatments.map((t) => (t.id === editingTreatmentId ? newTreatment : t))
      );
      setEditingTreatmentId(null);
    } else {
      setTreatments([...treatments, newTreatment]);
    }

    if (reminderEnabled && reminderDate) {
      scheduleNotification(
        `Tratamiento: ${tempName}`,
        `Recordatorio de ${tempType}`,
        reminderDate,
        reminderRepeat,
        customHours
      );
    }

    setTempType("");
    setTempName("");
    setTempDate("");
    setTempNotes("");
    setReminderEnabled(false);
    setReminderDate(null);
    setReminderRepeat("once");
    setCustomHours("");
  };

  const handleEditTreatment = (t) => {
    setTempType(t.type);
    setTempName(t.name);
    setTempDate(t.date);
    setTempNotes(t.notes);
    setEditingTreatmentId(t.id);
  };

  const handleDeleteTreatment = (id) => {
    setTreatments((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAttachReport = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*"],
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const fileUri = result.assets[0].uri;
      setVeterinaryReports((prev) => [...prev, fileUri]);

      Toast.show({
        type: "success",
        text1: "Informe adjuntado 📎",
        position: "top",
        visibilityTime: 2000,
      });

      console.log("📄 Archivo adjuntado:", fileUri);
    } else {
      console.log("❌ No se seleccionó ningún archivo o se canceló.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100} // ajustar según  header
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          {editingAnimal ? "Editar Animal 🐾" : "Añadir Animal 🐾"}
        </Text>

        <TouchableOpacity onPress={pickImage} style={styles.photoContainer}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photo} />
          ) : (
            <Text style={styles.photoPlaceholder}>+ Añadir foto</Text>
          )}
        </TouchableOpacity>

        <View style={styles.photoButtons}>
          <TouchableOpacity style={styles.smallButton} onPress={pickImage}>
            <Text style={styles.smallButtonText}>Galería</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallButton} onPress={takePhoto}>
            <Text style={styles.smallButtonText}>Cámara</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Especie (Perro, Gato...)"
          value={species}
          onChangeText={setSpecies}
        />
        <TextInput
          style={styles.input}
          placeholder="Raza"
          value={breed}
          onChangeText={setBreed}
        />
        <TextInput
          style={styles.input}
          placeholder="Sexo (Macho / Hembra)"
          value={sex}
          onChangeText={setSex}
        />
        <TextInput
          style={styles.input}
          placeholder="Fecha de nacimiento"
          value={birthDate}
          onChangeText={setBirthDate}
        />

        <View style={styles.switchContainer}>
          <Text>Tiene chip</Text>
          <Switch value={hasChip} onValueChange={setHasChip} />
        </View>
        {hasChip && (
          <TextInput
            style={styles.input}
            placeholder="Número de chip"
            value={chipNumber}
            onChangeText={setChipNumber}
          />
        )}

        <View style={styles.switchContainer}>
          <Text>Esterilizado</Text>
          <Switch value={isSterilized} onValueChange={setIsSterilized} />
        </View>
        {isSterilized && (
          <TextInput
            style={styles.input}
            placeholder="Fecha de esterilización"
            value={sterilizationDate}
            onChangeText={setSterilizationDate}
          />
        )}

        <Text style={styles.sectionTitle}>Tratamientos / recordatorios</Text>
        <TextInput
          style={styles.input}
          placeholder="Tipo (Vacuna, Medicación...)"
          value={tempType}
          onChangeText={setTempType}
        />
        <TextInput
          style={styles.input}
          placeholder="Nombre del tratamiento"
          value={tempName}
          onChangeText={setTempName}
        />
        <TextInput
          style={styles.input}
          placeholder="Fecha o frecuencia"
          value={tempDate}
          onChangeText={setTempDate}
        />
        <TextInput
          style={[styles.input, { height: 60 }]}
          placeholder="Notas o dosis"
          value={tempNotes}
          onChangeText={setTempNotes}
          multiline
        />

        <View style={styles.switchContainer}>
          <Text>¿Activar recordatorio?</Text>
          <Switch value={reminderEnabled} onValueChange={setReminderEnabled} />
        </View>

        {reminderEnabled && (
          <View>
            {/* Fecha */}
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={styles.input}
                placeholder="Seleccionar fecha"
                value={reminderDate ? reminderDate.toLocaleDateString() : ""}
                editable={false}
              />
            </TouchableOpacity>

            {/* Hora */}
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <TextInput
                style={styles.input}
                placeholder="Seleccionar hora"
                value={
                  reminderDate
                    ? reminderDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""
                }
                editable={false}
              />
            </TouchableOpacity>

            {/* Frecuencia */}
            <View style={styles.input}>
              <Picker
                selectedValue={reminderRepeat}
                onValueChange={(v) => setReminderRepeat(v)}
              >
                <Picker.Item label="Una vez (no repetir)" value="once" />
                <Picker.Item label="Cada X horas" value="customHours" />
                <Picker.Item label="Diario" value="daily" />
                <Picker.Item label="Semanal" value="weekly" />
                <Picker.Item label="Mensual" value="monthly" />
                <Picker.Item label="Anual" value="yearly" />
              </Picker>
            </View>

            {reminderRepeat === "customHours" && (
              <TextInput
                style={styles.input}
                placeholder="Introduce cada cuántas horas (ej. 4)"
                keyboardType="numeric"
                value={customHours}
                onChangeText={setCustomHours}
              />
            )}

            {reminderDate && (
              <Text style={styles.summary}>
                📅 Próximo recordatorio: {reminderDate.toLocaleDateString()} a
                las{" "}
                {reminderDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {"\n"}🔁{" "}
                {reminderRepeat === "once"
                  ? "Una sola vez"
                  : reminderRepeat === "customHours"
                  ? `Cada ${customHours} horas`
                  : `Repetición: ${reminderRepeat}`}
              </Text>
            )}

            {showDatePicker && (
              <DateTimePicker
                value={reminderDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setReminderDate(selectedDate);
                }}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={reminderDate || new Date()}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) {
                    const updated = new Date(reminderDate || new Date());
                    updated.setHours(
                      selectedTime.getHours(),
                      selectedTime.getMinutes()
                    );
                    setReminderDate(updated);
                  }
                }}
              />
            )}
          </View>
        )}

        <TouchableOpacity
          style={styles.smallButton}
          onPress={handleAddTreatment}
        >
          <Text style={styles.smallButtonText}>
            {editingTreatmentId ? "💾 Guardar cambios" : "+ Añadir tratamiento"}
          </Text>
        </TouchableOpacity>

        {treatments.length > 0 && (
          <View style={{ marginTop: 10 }}>
            {treatments.map((t) => (
              <View
                key={t.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.textPrimary }}>
                    💊 {t.type}: {t.name} ({t.date})
                  </Text>
                  {t.notes ? (
                    <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                      → {t.notes}
                    </Text>
                  ) : null}
                </View>
                <TouchableOpacity
                  onPress={() => handleEditTreatment(t)}
                  style={{ marginHorizontal: 6 }}
                >
                  <Text>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteTreatment(t.id)}>
                  <Text>🗑️</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        {/* Adjuntar informes veterinarios */}
        <Text style={styles.sectionTitle}>Informes veterinarios</Text>

        <TouchableOpacity
          style={styles.smallButton}
          onPress={handleAttachReport}
        >
          <Text style={styles.smallButtonText}>📎 Adjuntar informe</Text>
        </TouchableOpacity>

        {veterinaryReports.length > 0 && (
          <View style={{ marginTop: 10, alignSelf: "flex-start" }}>
            {veterinaryReports.map((uri, i) => (
              <Text
                key={i}
                style={{ color: colors.textSecondary, marginBottom: 4 }}
              >
                📄 {uri.split("/").pop()}
              </Text>
            ))}
          </View>
        )}

        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Notas generales del animal"
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>
              {editingAnimal ? "Guardar cambios" : "Guardar"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default AnimalFormScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 15,
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 10,
  },

  input: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderColor: "#ddd",
    borderWidth: 1,
    color: colors.textPrimary,
  },

  summary: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
  },

  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  buttonContainer: {
    marginTop: 25,
    marginBottom: 40,
  },

  button: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },

  buttonText: {
    color: colors.cardBackground,
    fontSize: 16,
    fontWeight: "bold",
  },

  photoContainer: {
    alignSelf: "center",
    marginBottom: 20,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.cardBackground,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.primary,
  },

  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 80,
  },

  photoPlaceholder: {
    color: colors.textSecondary,
    fontSize: 16,
  },

  photoButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },

  smallButton: {
    backgroundColor: "#fff",
    borderColor: colors.buttonPrimary,
    borderWidth: 1.5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
    marginTop: 15,
    marginBottom: 20,
  },

  smallButtonText: {
    color: colors.buttonPrimary,
    fontWeight: "bold",
  },
});
