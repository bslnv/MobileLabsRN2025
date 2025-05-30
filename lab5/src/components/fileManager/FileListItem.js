import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { formatBytes } from '../../utils/formatBytes';

const FileListItem = ({ item, onPressItem, onShowInfo, onDeleteItem }) => { // Додано onDeleteItem
  return (
    <TouchableOpacity onPress={() => onPressItem(item)} style={styles.itemOuterContainer}>
      <View style={styles.itemInnerContainer}>
        <MaterialCommunityIcons
          name={item.isDirectory ? 'folder' : 'file-outline'}
          size={28}
          color={item.isDirectory ? theme.colors.folderIcon : theme.colors.fileIcon}
          style={styles.itemIcon}
        />
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="middle">{item.name}</Text>
          <Text style={styles.itemDetails}>
            {item.isDirectory ? 'Папка' : `Файл • ${formatBytes(item.size)}`}
          </Text>
        </View>
        <TouchableOpacity onPress={() => onShowInfo(item)} style={styles.actionIcon}>
          <Ionicons name="information-circle-outline" size={26} color={theme.colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDeleteItem(item)} style={styles.actionIcon}> {/* Нова кнопка видалення */}
          <Ionicons name="trash-outline" size={24} color={theme.colors.destructive} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemOuterContainer: {
    backgroundColor: theme.colors.surface,
  },
  itemInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.medium - 2,
    paddingHorizontal: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderColor,
  },
  itemIcon: {
    marginRight: theme.spacing.medium,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
  },
  itemDetails: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  actionIcon: { 
    paddingLeft: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
  },
});

export default FileListItem;