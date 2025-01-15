import React, { useEffect, useState } from 'react';
import {View, Text, ActivityIndicator, Pressable, Alert} from 'react-native';
import styles from '@/constants/Styles';
import { authService } from '@/services/auth.service';
import { useUser } from '@/contexts/UserContext';
import { router } from 'expo-router';
import Character from '@/interfaces/character.interface';
import { useCharacterEdit } from '@/contexts/CharacterContext';

const UserCharacters = () => {
  const { user } = useUser();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setEditingCharacter } = useCharacterEdit();

  useEffect(() => {
    if (user?.id) {
      loadCharacters();
    }
  }, [user?.id]);

  const loadCharacters = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.id) return;
      const data = await authService.getCharacters(user?.id);

      setCharacters(data);
    } catch (error) {
      console.error('Failed to load characters:', error);
      setError('Failed to load characters');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePress = (character: Character) => {
    setEditingCharacter(character);
    router.push('/(tabs)/character-update/[id]');
  };

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
              await authService.deleteCharacter(characterId);
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
    <View style={styles.contentContainer}>
      {characters.map((character) => (
        <View key={character.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.characterName}>{character.name}</Text>
            <Pressable
              style={styles.updateButton}
              onPress={() => handleUpdatePress(character)}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </Pressable>
            <Pressable
              style={styles.deleteButton}
              onPress={() => handleDeletePress(character.id)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.tierContainer}>
              <Text style={styles.label}>Tier:</Text>
              <Text style={styles.text}>{character.tier}</Text>
            </View>
            <Text style={styles.description}>{character.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default UserCharacters;