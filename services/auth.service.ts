import client from '../api/Client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LoginResponse} from '@/interfaces/user.interface';

export const authService = {
  async login(identifier: string, password: string): Promise<LoginResponse> {
    try {
      const response = await client.post('/login', {
        identifier,
        password
      });

      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async logout() {
    await AsyncStorage.removeItem('userToken');
  },
};