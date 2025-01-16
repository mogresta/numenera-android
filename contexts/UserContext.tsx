import React, { createContext, useContext, useState, useEffect } from 'react';
import {User} from '@/interfaces/user.interface';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStoredUser = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');

      if (userToken && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadStoredUser();
  }, []);

  const updateUser = async (newUser: User | null) => {
    if (newUser) {
      await AsyncStorage.setItem('userData', JSON.stringify(newUser));
    } else {
      await AsyncStorage.removeItem('userData');
    }
    setUser(newUser);
  };

  if (isLoading) {
    return null;
  }

  return (
    <UserContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}