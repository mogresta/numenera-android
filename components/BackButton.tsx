import React from 'react';
import { Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import styles from '@/constants/Styles';

export default function BackButton() {
  return (
    <Pressable
      style={styles.backButton}
      onPress={() => router.back()}
    >
      <FontAwesome name="arrow-left" size={20} color="#fff" />
      <Text style={styles.backButtonText}>Back</Text>
    </Pressable>
  );
}