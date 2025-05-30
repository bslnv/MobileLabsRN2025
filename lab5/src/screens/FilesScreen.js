import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { theme } from '../styles/theme';

const FilesScreen = ({ navigation }) => {
  const handleOpenFileExplorer = () => {
    const initialPath = FileSystem.documentDirectory + 'AppData';
    navigation.navigate('FileManager', { basePath: initialPath });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <MaterialCommunityIcons name="folder-search-outline" size={100} color={theme.colors.primary} />
        <Text style={styles.title}>Файловий менеджер</Text>
        <Text style={styles.subtitle}>
          Переглядайте та керуйте файлами вашого додатку
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleOpenFileExplorer}>
          <MaterialCommunityIcons name="folder-open-outline" size={24} color={theme.colors.surface} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Відкрити файли</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.large,
  },
  title: {
    fontSize: theme.typography.h2,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.large,
    marginBottom: theme.spacing.small,
  },
  subtitle: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xlarge,
    paddingHorizontal: theme.spacing.medium,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.xlarge,
    borderRadius: 8,
    shadowColor: theme.colors.text, 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: theme.spacing.small,
  },
  buttonText: {
    color: theme.colors.surface,
    fontSize: theme.typography.button,
    fontWeight: 'bold',
  },
});

export default FilesScreen;