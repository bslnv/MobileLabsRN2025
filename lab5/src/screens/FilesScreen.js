import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

const FilesScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Files Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  text: {
    fontSize: theme.typography.h2,
    color: theme.colors.text,
  },
});

export default FilesScreen;