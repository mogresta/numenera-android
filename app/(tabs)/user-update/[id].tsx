import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '@/constants/Styles';
import { authService } from '@/services/auth.service';
import { useUser } from '@/contexts/UserContext';
import BackButton from "@/components/BackButton";

export default function UserUpdate() {
  const { user, setUser } = useUser();
  const [username, setUsername] = useState(user?.username || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const updatedUser = await authService.updateUsername(user.id, username);
      setUser(updatedUser); // Update the global user context
      router.back();
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to update profile');
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
      <BackButton />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Edit Profile</Text>

        <Text style={styles.text}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          placeholderTextColor="#999"
        />

        <Pressable
          style={styles.buttonContainer}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Update Profile</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}