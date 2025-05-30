import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const initialTasks = [
  { id: '1', text: 'Зробити 10 кліків', completed: false, targetClicks: 10, currentProgress: 0 },
  { id: '2', text: 'Зробити подвійний клік 5 разів', completed: false, targetDoubleClicks: 5, currentProgress: 0 },
  { id: '3', text: 'Утримувати об\'єкт 3 секунди', completed: false, targetHoldDuration: 3000, currentProgress: 0 },
  { id: '4', text: 'Перетягнути об\'єкт', completed: false },
  { id: '5', text: 'Зробити свайп вправо', completed: false },
  { id: '6', text: 'Зробити свайп вліво', completed: false },
  { id: '7', text: 'Змінити розмір об\'єкта', completed: false },
  { id: '8', text: 'Отримати 100 очок', completed: false, targetScore: 100, currentProgress: 0 },
];

export default function TasksScreen() {
  const [tasks, setTasks] = useState(initialTasks);

  const renderTaskItem = ({ item }) => (
    <View style={[styles.taskItem, item.completed ? styles.taskItemCompleted : {}]}>
      <Text style={[styles.taskText, item.completed ? styles.taskTextCompleted : {}]}>
        {item.text}
      </Text>
      <Text style={styles.taskStatus}>
        {item.completed ? '✅ Виконано' : '⏳ В процесі'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Список Завдань</Text>
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  list: {
    width: '100%',
  },
  taskItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  taskItemCompleted: {
    backgroundColor: '#e0ffe0',
    borderColor: 'green',
    borderWidth: 1,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
    flexShrink: 1,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#555',
  },
  taskStatus: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 10,
  }
});