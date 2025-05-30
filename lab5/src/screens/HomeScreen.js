import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import { theme } from '../styles/theme';

const HomeScreen = () => {
  const [totalSpaceGB, setTotalSpaceGB] = useState(0);
  const [freeSpaceGB, setFreeSpaceGB] = useState(0);
  const [usedSpaceGB, setUsedSpaceGB] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    const fetchStorageData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const totalBytes = await FileSystem.getTotalDiskCapacityAsync();
        const freeBytes = await FileSystem.getFreeDiskStorageAsync();

        if (totalBytes === null || freeBytes === null) {
          throw new Error("Не вдалося отримати дані про сховище. API повернув null.");
        }
        
        const usedBytes = totalBytes - freeBytes;

        const bytesToGB = (bytes) => parseFloat((bytes / (1024 * 1024 * 1024)).toFixed(2));

        setTotalSpaceGB(bytesToGB(totalBytes));
        setFreeSpaceGB(bytesToGB(freeBytes));
        setUsedSpaceGB(bytesToGB(usedBytes));
        
        setLastUpdated(new Date().toLocaleString('uk-UA', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }));

      } catch (e) {
        console.error("Failed to fetch storage data:", e);
        setError("Не вдалося завантажити дані сховища. Перевірте дозволи та спробуйте знову.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStorageData();
  }, []);

  const usedPercentage = totalSpaceGB > 0 ? (usedSpaceGB / totalSpaceGB) * 100 : 0;

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.centered, {backgroundColor: theme.colors.background}]} edges={['top', 'left', 'right']}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Завантаження даних про сховище...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.centered, {backgroundColor: theme.colors.background}]} edges={['top', 'left', 'right']}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.labText}>Лабораторна робота 5</Text>
          <Text style={styles.nameText}>Слинюк Богдан Вадимович ІПЗ-21-5</Text>
        </View>

        <View style={styles.storageInfoContainer}>
          <Text style={styles.storageTitle}>Інформація про сховище</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Загальний обсяг:</Text>
            <Text style={styles.infoValue}>{totalSpaceGB} ГБ</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Вільний простір:</Text>
            <Text style={styles.infoValue}>{freeSpaceGB} ГБ</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Зайнятий простір:</Text>
            <Text style={styles.infoValue}>{usedSpaceGB} ГБ</Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${usedPercentage}%` }]} />
          </View>
          {lastUpdated && (
            <Text style={styles.lastUpdateText}>
              Останнє оновлення: {lastUpdated}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.large,
  },
  loadingText: {
    marginTop: theme.spacing.medium,
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
  },
  errorText: {
    fontSize: theme.typography.body,
    color: theme.colors.destructive,
    textAlign: 'center',
  },
  container: {
    flexGrow: 1,
    padding: theme.spacing.large,
    alignItems: 'center',
  },
  headerTextContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xlarge,
  },
  labText: {
    fontSize: theme.typography.h2,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.small,
  },
  nameText: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
  },
  storageInfoContainer: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    padding: theme.spacing.large,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  storageTitle: {
    fontSize: theme.typography.h3,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.large,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.medium,
    paddingHorizontal: theme.spacing.small,
  },
  infoLabel: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 20,
    width: '100%',
    backgroundColor: theme.colors.borderColor,
    borderRadius: 10,
    marginTop: theme.spacing.small,
    marginBottom: theme.spacing.medium,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
  },
  lastUpdateText: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.medium,
  },
});

export default HomeScreen;