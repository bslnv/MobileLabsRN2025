import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Keyboard } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddTaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [showPicker, setShowPicker] = useState(false);

  const handleFormSubmit = () => {
    if (title.trim() === '') {
      Alert.alert('Увага', 'Будь ласка, введіть назву завдання.');
      return;
    }
    onAddTask({ title, description, reminderTime: new Date(date) });
    setTitle('');
    setDescription('');
    setDate(new Date());
    Keyboard.dismiss();
  };

  const onChangeDateTime = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showModePicker = (currentMode) => {
    setShowPicker(true);
    setMode(currentMode);
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Назва завдання"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.inputDescription]}
        placeholder="Опис (необов'язково)"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <View style={styles.datePickerContainer}>
        <TouchableOpacity onPress={() => showModePicker('date')} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>Обрати дату</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => showModePicker('time')} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>Обрати час</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.selectedDateTime}>
        Обрано: {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeDateTime}
          minimumDate={new Date()}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={handleFormSubmit}>
        <Text style={styles.addButtonText}>Додати завдання</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputDescription: {
    height: 80,
    textAlignVertical: 'top',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: '#5cb85c',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  dateButtonText: {
    color: 'white',
    fontSize: 16,
  },
  selectedDateTime: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 15,
    color: '#555',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});