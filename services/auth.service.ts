import client from '../api/Client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LoginResponse, UpdateUsernameResponse, User} from '@/interfaces/user.interface';
import Character from '@/interfaces/character.interface';

export const authService = {
  async login(identifier: string, password: string): Promise<LoginResponse> {
    const response = await client.post('/login', {
      identifier,
      password
    });

    if (response.data.token) {
      await AsyncStorage.setItem('userToken', response.data.token);
    }

    return response.data;
  },

  async logout() {
    await AsyncStorage.removeItem('userToken');
  },

  async updateUsername(userId: number, username: string): Promise<User> {
    try {
      const response = await client.post<UpdateUsernameResponse>('/update-username', {
        id: userId,
        username: username
      });
      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
      }

      return response.data.user;
    } catch (error) {
      console.error('Error updating username:', error);
      throw error;
    }
  },

  async deleteCharacter(characterId: number): Promise<void> {
    try {
      await client.delete(`/characters/delete/${characterId}`);
    } catch (error) {
      console.error('Error deleting character:', error);
      throw error;
    }
  },

  async getCharacters(userId: number): Promise<Character[]> {
    try {
      const response = await client.post('/characters/all', {user: userId});
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Error fetching characters:', error);
      throw error;
    }
  },

  async updateCharacter(characterId: number, characterData: {
    name: string;
    description: string;
    tier: number;
  }): Promise<void> {
    try {
      await client.patch(`/characters/update`, {
        id: characterId,
        ...characterData
      });
    } catch (error) {
      console.error('Error updating character:', error);
      throw error;
    }
  },
};