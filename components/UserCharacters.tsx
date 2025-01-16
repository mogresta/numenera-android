import React, {useCallback, useState} from 'react';
import {View, Text, ActivityIndicator, Pressable, Alert, StyleSheet, Dimensions} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {router} from 'expo-router';
import styles from '@/constants/Styles';
import { useUser } from '@/contexts/UserContext';
import Character from '@/interfaces/character.interface';
import { useCharacterEdit } from '@/contexts/CharacterContext';
import {apiService} from "@/services/api.service";
import {CharacterTypeNames, CharacterTypes} from "@/enums/characterType.enum";

const UserCharacters = () => {
  const { user } = useUser();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setEditingCharacter } = useCharacterEdit();
  const screenWidth = Dimensions.get('window').width;

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        loadCharacters();
      }
    }, [user?.id])
  );

  const loadCharacters = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.id) return;
      const data = await apiService.getCharacters(user?.id);

      setCharacters(data);
    } catch (error) {
      console.error('Failed to load characters:', error);
      setError('Failed to load characters');
    } finally {
      setLoading(false);
    }
  };

  const handleInventoryPress = (character: Character) => {
    if (!character?.id) return;
    setEditingCharacter(character);
    router.push('/(tabs)/character-inventory/[id]');
  };

  const handleUpdatePress = (character: Character) => {
    setEditingCharacter(character);
    router.push('/(tabs)/character-update/[id]');
  }

  const handleDeletePress = async (characterId: number) => {
    Alert.alert(
      "Delete Character",
      "Are you sure you want to delete this character?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await apiService.deleteCharacter(characterId);
              setCharacters(characters.filter(char => char.id !== characterId));
            } catch (error) {
              console.error('Failed to delete character:', error);
              Alert.alert('Error', 'Failed to delete character');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return <ActivityIndicator size="small" color="#fff" />;
  }

  if (error) {
    return (
      <View style={styles.card}>
        <Text style={styles.text}>{error}</Text>
      </View>
    );
  }

  if (characters.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.text}>No characters found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {characters.map((character) => (
        <View key={character.id} style={styles.card}>
          {/* Character Info Section */}
          <View style={styles.characterInfo}>
            <Text style={styles.characterName}>{character.name}</Text>
            <Text style={styles.characterType}>
              {CharacterTypeNames[Number(character.characterType) as CharacterTypes]}
            </Text>
            <Text style={styles.characterTier}>Tier {character.tier}</Text>
            <Text style={styles.characterDescription}>{character.description}</Text>
          </View>

          {/* Buttons Section */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.actionButton}
              onPress={() => handleUpdatePress(character)}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDeletePress(character.id!)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
            <Pressable
              style={styles.actionButton}
              onPress={() => handleInventoryPress(character)}
            >
              <Text style={styles.buttonText}>Inventory</Text>
            </Pressable>
          </View>
        </View>
      ))}
      <Pressable
        style={styles.buttonContainer}
        onPress={() => router.push('/(tabs)/character-create')}
      >
        <Text style={styles.buttonText}>Create New Character</Text>
      </Pressable>
    </View>
  );
};

export default UserCharacters;