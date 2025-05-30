import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import { theme } from '../../styles/theme';

const CreateFolderModal = ({ visible, onClose, onCreate }) => {
  const [folderName, setFolderName] = useState('');

  const handleCreate = () => {
    if (!folderName.trim()) {
      Alert.alert('Помилка', 'Назва папки не може бути порожньою.');
      return;
    }
    onCreate(folderName.trim());
    setFolderName('');
  };

  const handleClose = () => {
    setFolderName('');
    onClose();
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Створити папку</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Назва папки"
            value={folderName}
            onChangeText={setFolderName}
            autoCapitalize="none"
          />
          <View style={styles.modalActions}>
            <TouchableOpacity style={[styles.modalButton, styles.createButton]} onPress={handleCreate}>
              <Text style={styles.modalButtonText}>Створити</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleClose}>
              <Text style={[styles.modalButtonText, { color: theme.colors.primary }]}>Скасувати</Text>
            </TouchableOpacity>
          </View>
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
  modalInput: { 
    borderWidth: 1, 
    borderColor: theme.colors.borderColor, 
    borderRadius: 6, 
    paddingHorizontal: theme.spacing.medium, 
    paddingVertical: theme.spacing.small + 2, 
    fontSize: theme.typography.body, 
    marginBottom: theme.spacing.medium, 
    backgroundColor: theme.colors.background 
  },
  modalActions: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: theme.spacing.small 
  },
  modalButton: { 
    flex: 1, 
    paddingVertical: theme.spacing.medium - 2, 
    borderRadius: 6, 
    alignItems: 'center', 
    elevation: 1 
  },
  createButton: { 
    backgroundColor: theme.colors.primary, 
    marginRight: theme.spacing.small / 2 
  },
  cancelButton: { 
    backgroundColor: theme.colors.modalButtonCancelBackground, 
    marginLeft: theme.spacing.small / 2 
  },
  modalButtonText: { 
    color: theme.colors.surface, 
    fontSize: theme.typography.button, 
    fontWeight: 'bold' 
  },
});

export default CreateFolderModal;