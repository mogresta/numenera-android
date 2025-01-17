import {Text, View, Pressable, ActivityIndicator, Alert, ScrollView} from 'react-native';
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
    router.replace('/(tabs)/user-update/[id]');
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

  const handleShowCharactersTable = () => {
    router.replace('/(tabs)/characters');
  }

  const handleShowItemsTable = () => {
    router.replace('/(tabs)/items');
  }

  const handleGroupInventoryTable = () => {
    router.replace('/(tabs)/group-items');
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a2151', '#0a0f2d']}
        style={styles.background}
      />
      <ScrollView style={styles.scrollContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.userInfoContainer}>
          <Text style={styles.title}>User Profile</Text>
        <Text style={styles.welcomeText}>Welcome, {user.username}</Text>
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
          <Pressable
            style={styles.buttonContainer}
            onPress={handleShowCharactersTable}
          >
            <Text style={styles.buttonText}>All Characters</Text>
          </Pressable>
        </View>
        <View style={styles.userInfoContainer}>
          <Text style={styles.title}>Items</Text>
          <Pressable
            style={styles.buttonContainer}
            onPress={handleShowItemsTable}
          >
            <Text style={styles.buttonText}>All Items</Text>
          </Pressable>
        </View>
        <View style={styles.userInfoContainer}>
          <Text style={styles.title}>Group Inventory</Text>
          <Pressable
            style={styles.buttonContainer}
            onPress={handleGroupInventoryTable}
          >
            <Text style={styles.buttonText}>Show Group Inventory</Text>
          </Pressable>
        </View>
      </View>
        </ScrollView>
    </View>
  );
};

export default UserProfile;