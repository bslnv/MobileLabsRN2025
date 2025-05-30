import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function NewsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Новини</Text>
      {[...Array(10)].map((_, index) => (
        <View key={index} style={styles.newsCard}>
          <Text style={styles.newsTitle}>Заголовок новини</Text>
          <Text style={styles.newsText}>Короткий текст новини</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  newsCard: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  newsText: {
    fontSize: 14,
    color: '#666',
  },
});