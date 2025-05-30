import React, { useState, useEffect, useLayoutEffect } from 'react';
import { ScrollView, Text, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';

const FileViewerScreen = ({ route, navigation }) => {
  const { fileUri, fileName } = route.params;
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({ title: fileName || 'Перегляд файлу' });
  }, [navigation, fileName]);

  useEffect(() => {
    const loadFileContent = async () => {
      try {
        setIsLoading(true);
        const fileContent = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        setContent(fileContent);
      } catch (error) {
        console.error('Error reading file:', error);
        Alert.alert('Помилка', 'Не вдалося прочитати вміст файлу.');
        setContent('Не вдалося завантажити вміст.');
      } finally {
        setIsLoading(false);
      }
    };

    if (fileUri) {
      loadFileContent();
    } else {
      Alert.alert('Помилка', 'Не вказано шлях до файлу.');
      setContent('Помилка: шлях до файлу не вказано.');
      setIsLoading(false);
    }
  }, [fileUri]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: theme.colors.background }]} edges={['bottom', 'left', 'right']}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text selectable style={styles.contentText}>{content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface, 
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: theme.spacing.medium,
  },
  contentText: {
    fontSize: 14, 
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: theme.colors.text,
    lineHeight: 20, 
  },
});

export default FileViewerScreen;