import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TaskItem({ item }) {
  let progressText = '';
  if (item.type === 'singleTap' || item.type === 'doubleTap' || item.type === 'score' || item.type === 'longPressDuration') {
    const currentDisplayProgress = item.type === 'longPressDuration' && item.target ? (item.progress / 1000).toFixed(1) : item.progress;
    const targetDisplayProgress = item.type === 'longPressDuration' && item.target ? (item.target / 1000).toFixed(1) : item.target;
    
    if (item.target !== undefined) {
         progressText = `(${currentDisplayProgress} / ${targetDisplayProgress})`;
    }
  }

  return (
    <View style={[styles.taskItem, item.completed ? styles.taskItemCompleted : {}]}>
      <View style={styles.taskTextContainer}>
        <Text style={[styles.taskText, item.completed ? styles.taskTextCompleted : {}]}>
          {item.text}
        </Text>
        {!item.completed && progressText && <Text style={styles.progressText}>{progressText}</Text>}
      </View>
      <Text style={[styles.taskStatus, item.completed ? styles.taskStatusCompleted : {}]}>
        {item.completed ? '✅ Виконано' : '⏳ В процесі'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  taskItem: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
  },
  taskItemCompleted: {
    backgroundColor: '#d4edda', 
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
  taskTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#555',
  },
  progressText: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },
  taskStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskStatusCompleted: {
    color: 'green',
  }
});