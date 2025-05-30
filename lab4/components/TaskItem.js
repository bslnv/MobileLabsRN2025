import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TaskItem({ item, onDelete }) {
  return (
    <View style={styles.taskItem}>
      <View style={styles.taskTextContainer}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        {item.description ? <Text style={styles.taskDescription}>{item.description}</Text> : null}
        <Text style={styles.taskReminder}>
          Нагадати: {item.reminderTime.toLocaleDateString()} {item.reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        {item.notificationId && <Text style={styles.notificationStatusText}>Сповіщення заплановано</Text>}
      </View>
      <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
    shadowOffset: { width: 0, height: 1 },
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
});