import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import styles from '@/constants/Styles';

interface ItemActionButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

export default function ItemActionButton({
 onPress,
 title,
 variant = 'primary'
}: ItemActionButtonProps) {
  return (
    <Pressable
      style={[
        styles.actionButton,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'danger' && styles.dangerButton
      ]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}