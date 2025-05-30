import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

const InfoRow = ({ label, value, isPath = false }) => (
  <View style={styles.infoRowContainer}>
    <Text style={styles.infoRowLabel}>{label}</Text>
    <Text 
      style={[styles.infoRowValue, isPath && styles.pathText]} 
      numberOfLines={isPath ? 3 : 1} 
      ellipsizeMode="tail"
    >
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  infoRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderColor,
  },
  infoRowLabel: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginRight: theme.spacing.small,
    flex: 0.4,
  },
  infoRowValue: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
    flex: 0.6,
    textAlign: 'right',
  },
  pathText: {
    fontSize: theme.typography.caption,
    textAlign: 'left',
    color: theme.colors.primary, 
  },
});

export default InfoRow;