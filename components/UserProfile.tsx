import {Text, View, Pressable, ActivityIndicator, Alert} from 'react-native';
import React from 'react';
import styles from '../constants/Styles';
import UserData from '@/components/UserData';
import UserCharacters from '@/components/UserCharacters';
import { authService } from '@/services/auth.service';
import { router } from "expo-router";
import { useUser } from '@/contexts/UserContext';
import {LinearGradient} from "expo-linear-gradient";

const UserProfile = () => {
  const { user, setUser } = useUser();

  if (!user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.text}>Loading profile...</Text>
      </View>
    );
  }

  const handleEditProfile = () => {
    router.push('/(tabs)/user-update/[id]');
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a2151', '#0a0f2d']}
        style={styles.background}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>User Profile</Text>
        <View style={styles.userInfoContainer}>
        <Text style={styles.textLarge}>Welcome, {user.username}</Text>
        <UserData />
        <Pressable
          style={styles.buttonContainer}
          onPress={handleEditProfile}
        >
          <Text style={styles.buttonText}>Edit Profile</Text>
        </Pressable>
        <Pressable
          style={styles.buttonContainer}
          onPress={() => handleLogout()}
        >
          <Text style={styles.buttonText}>Log Out</Text>
        </Pressable>
        </View>
        <View style={styles.userInfoContainer}>
          <Text style={styles.title}>Characters</Text>
          <UserCharacters />
        </View>
      </View>
    </View>
  );
};

export default UserProfile;