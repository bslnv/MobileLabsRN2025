import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import Constants from 'expo-constants';

import AddTaskForm from './components/AddTaskForm';
import TaskItem from './components/TaskItem';
import { 
  registerForPushNotificationsAsync, 
  scheduleTaskNotification, 
  cancelTaskNotification,
  setupNotificationListeners 
} from './services/notificationService';


export default function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    registerForPushNotificationsAsync();
    const removeNotificationListeners = setupNotificationListeners();
    return () => {
      removeNotificationListeners();
    };
  }, []);

  const handleAddTask = async (taskData) => {
    const tempId = Math.random().toString(36).substr(2, 9); // Генеруємо ID тут
    
    let notificationId = null;
    if (taskData.reminderTime.getTime() > Date.now()) {
        notificationId = await scheduleTaskNotification({ 
            ...taskData,
            id: tempId, // Передаємо ID в сповіщення
        });
    } else if (taskData.reminderTime) {
        Alert.alert("Увага", "Обраний час нагадування вже минув. Завдання буде додано без сповіщення.");
    }
    
    const newTask = {
      ...taskData,
      id: tempId, // Використовуємо той самий ID
      notificationId: notificationId,
    };

    setTasks(currentTasks => [...currentTasks, newTask]);
  };

  const handleDeleteTask = async (taskId) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    if (taskToDelete) {
      await cancelTaskNotification(taskToDelete.notificationId);
    }
    setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.header}>To-Do Reminder</Text>
        <AddTaskForm onAddTask={handleAddTask} />
        <FlatList
          data={tasks}
          renderItem={({item}) => <TaskItem item={item} onDelete={handleDeleteTask} />}
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
  list: {
    flex: 1,
    marginTop: 10, 
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});