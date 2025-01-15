import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../../constants/Styles';
import { authService } from '@/services/auth.service';
import { router } from 'expo-router';
import { useUser } from '@/contexts/UserContext';


export default function LoginScreen() {
  const { setUser } = useUser();
  const [ identifier, setIdentifier ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ loading, setLoading ] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await authService.login(identifier, password);

      if (!response.user) {
        throw new Error('No user data in response');
      }

      setUser(response.user);
      await new Promise(resolve => setTimeout(resolve, 100));
      router.replace('/(tabs)');

    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Login Failed', error.message || 'An error occurred');
      } else {
        Alert.alert('Login Failed', 'An unknown error occurred');
      }
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
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email or Username"
          placeholderTextColor="#999"
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Pressable
          style={styles.buttonContainer}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}