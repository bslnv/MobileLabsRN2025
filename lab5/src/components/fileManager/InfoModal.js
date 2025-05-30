import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { theme } from '../../styles/theme';
import InfoRow from './InfoRow'; 
import { formatBytes } from '../../utils/formatBytes'; 

const InfoModal = ({ visible, onClose, item }) => {
  if (!item) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Інформація</Text>
          <InfoRow label="Ім'я:" value={item.name} />
          <InfoRow label="Тип:" value={item.isDirectory ? 'Папка' : 'Файл'} />
          <InfoRow
            label="Шлях:"
            value={item.uri.replace(FileSystem.documentDirectory, 'Documents/')}
            isPath={true}
          />
          {!item.isDirectory && (
            <InfoRow label="Розмір:" value={formatBytes(item.size)} />
          )}
          {item.modificationTime && (
            <InfoRow
              label="Змінено:"
              value={new Date(item.modificationTime * 1000).toLocaleString('uk-UA', {
                year: 'numeric', month: 'numeric', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            />
          )}
          <TouchableOpacity
            style={[styles.modalButton, styles.infoModalCloseButton]}
            onPress={onClose}
          >
            <Text style={styles.modalButtonText}>Закрити</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    backgroundColor: theme.colors.modalOverlay, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    backgroundColor: theme.colors.surface, 
    padding: theme.spacing.large, 
    borderRadius: 10, 
    width: '90%', 
    elevation: 5, 
    shadowColor: theme.colors.text, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 4 
  },
  modalTitle: { 
    fontSize: theme.typography.h3, 
    fontWeight: 'bold', 
    marginBottom: theme.spacing.large, 
    textAlign: 'center', 
    color: theme.colors.text 
  },
  modalButton: { 
    paddingVertical: theme.spacing.medium - 2, 
    borderRadius: 6, 
    alignItems: 'center', 
    elevation: 1 
  },
  modalButtonText: { 
    color: theme.colors.surface, 
    fontSize: theme.typography.button, 
    fontWeight: 'bold' 
  },
  infoModalCloseButton: {
    backgroundColor: theme.colors.primary,
    marginTop: theme.spacing.large,
  },
});

export default InfoModal;