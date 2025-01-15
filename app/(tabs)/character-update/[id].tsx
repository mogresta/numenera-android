import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import styles from '@/constants/Styles';
import { authService } from '@/services/auth.service';
import { useCharacterEdit } from '@/contexts/CharacterContext';
import BackButton from "@/components/BackButton";

export default function CharacterUpdate() {
  const { editingCharacter, setEditingCharacter } = useCharacterEdit();
  const [name, setName] = useState(editingCharacter?.name || '');
  const [description, setDescription] = useState(editingCharacter?.description || '');
  const [tier, setTier] = useState(editingCharacter?.tier?.toString() || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      setEditingCharacter(null);
    };
  }, []);

  const handleUpdate = async () => {
    if (!editingCharacter?.id) return;

    try {
      setLoading(true);
      await authService.updateCharacter(editingCharacter.id, {
        name,
        description,
        tier: Number(tier),
      });
      Alert.alert('Success', 'Character updated successfully');
      router.back();
    } catch (error) {
      console.error('Failed to update character:', error);
      Alert.alert('Error', 'Failed to update character');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#1a2151', '#0a0f2d']}
          style={styles.background}
        />
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a2151', '#0a0f2d']}
        style={styles.background}
      />
      <BackButton />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Update Character</Text>

        <Text style={styles.text}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Character Name"
          placeholderTextColor="#999"
        />

        <Text style={styles.text}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Character Description"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.text}>Tier</Text>
        <TextInput
          style={styles.input}
          value={tier}
          onChangeText={setTier}
          placeholder="Character Tier"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />

        <Pressable
          style={styles.buttonContainer}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Update Character</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}