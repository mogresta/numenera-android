import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from "react-native";

const API_URL = Platform.select({
  web: process.env.EXPO_PUBLIC_API_URL_WEB,
  android: process.env.EXPO_PUBLIC_API_URL_ANDROID,
  ios: process.env.EXPO_PUBLIC_API_URL_IOS,
});

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client;