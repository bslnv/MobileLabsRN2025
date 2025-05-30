import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    Alert.alert('Помилка', 'Не вдалося отримати дозвіл на push-сповіщення!');
    return;
  }
  
  return token;
}


export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync();

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received: ', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);


  const scheduleNotificationForTask = async (task) => {
    const trigger = new Date(task.reminderTime);
    if (trigger.getTime() <= Date.now()) {
      Alert.alert("Увага", "Час нагадування вже минув. Сповіщення не буде заплановано.");
      return null;
    }

    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Нагадування про завдання!",
          body: task.title,
          data: { taskId: task.id }, 
        },
        trigger,
      });
      return notificationId;
    } catch (e) {
      console.error("Помилка планування сповіщення:", e);
      Alert.alert("Помилка", "Не вдалося запланувати сповіщення.");
      return null;
    }
  };

  const addTask = async () => {
    if (title.trim() === '') {
      Alert.alert('Увага', 'Будь ласка, введіть назву завдання.');
      return;
    }

    const reminderDateTime = new Date(date);
    let notificationId = null;

    if (reminderDateTime.getTime() > Date.now()) {
        notificationId = await scheduleNotificationForTask({ 
            id: 'temp', 
            title, 
            description, 
            reminderTime: reminderDateTime 
        });
    } else {
        Alert.alert("Увага", "Обраний час нагадування вже минув. Завдання буде додано без сповіщення.");
    }
    
    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      reminderTime: reminderDateTime,
      notificationId: notificationId,
    };

    setTasks(currentTasks => [...currentTasks, newTask]);
    setTitle('');
    setDescription('');
    setDate(new Date());
    Keyboard.dismiss();
  };

  const deleteTask = (taskId) => {
    setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
  };

  const onChangeDateTime = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShowPicker(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskTextContainer}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        {item.description ? <Text style={styles.taskDescription}>{item.description}</Text> : null}
        <Text style={styles.taskReminder}>
          Нагадати: {item.reminderTime.toLocaleDateString()} {item.reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        {item.notificationId && <Text style={styles.notificationStatusText}>Сповіщення заплановано</Text>}
      </View>
      <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.header}>To-Do Reminder</Text>
        
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
          <TouchableOpacity onPress={showDatepicker} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>Обрати дату</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={showTimepicker} style={styles.dateButton}>
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

        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Додати завдання</Text>
        </TouchableOpacity>

        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={item => item.id}
          style={styles.list}
          ListEmptyComponent={<Text style={styles.emptyListText}>Список завдань порожній</Text>}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 20,
    paddingHorizontal: 20,
    backgroundColor: '#f4f4f8',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
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
  list: {
    flex: 1,
  },
  taskItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  taskTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },
  taskDescription: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  taskReminder: {
    fontSize: 12,
    color: '#007bff',
    marginTop: 6,
  },
  notificationStatusText: {
    fontSize: 10,
    color: 'green',
    fontStyle: 'italic',
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});