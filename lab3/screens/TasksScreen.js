import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { GameContext } from '../contexts/GameContext';
import TaskItem from '../components/TaskItem'; 

export default function TasksScreen() {
  const { tasks } = useContext(GameContext); 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Список Завдань</Text>
      <FlatList
        data={tasks}
        renderItem={({item}) => <TaskItem item={item} />} 
        keyExtractor={item => item.id}
        style={styles.list}
        extraData={tasks} 
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
});