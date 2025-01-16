import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '@/constants/Styles';
import { apiService } from '@/services/api.service';
import { useUser } from '@/contexts/UserContext';
import {CharacterTypeNames, CharacterTypes} from "@/enums/characterType.enum";
import Select from "@/components/Select";

export default function CharacterCreate() {
  const { user } = useUser();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tier, setTier] = useState('1'); //default tier 1
  const [loading, setLoading] = useState(false);
  const [characterType, setCharacterType] = useState<CharacterTypes>(CharacterTypes.GLAIVE);

  const characterTypeOptions = Object.values(CharacterTypes)
    .filter(value => !isNaN(Number(value)))
    .map(value => ({
      value: value as CharacterTypes,
      label: CharacterTypeNames[value as CharacterTypes]
    }));

  const handleCreate = async () => {
    try {
      setLoading(true);
      await apiService.createCharacter({
        name,
        description,
        tier,
        characterType,
        user: user?.id
      });
      Alert.alert('Success', 'Character created successfully');
      router.back();
    } catch (error) {
      console.error('Failed to create character:', error);
      Alert.alert('Error', 'Failed to create character');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a2151', '#0a0f2d']}
        style={styles.background}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Create Character</Text>

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

        <Select
          label="Character Type"
          value={characterType}
          onValueChange={setCharacterType}
          items={characterTypeOptions}
        />

        <Pressable
          style={styles.buttonContainer}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Character</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}