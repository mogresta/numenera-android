import { useUser } from '@/contexts/UserContext';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

export function AuthCheck() {
  const { user } = useUser();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      console.log('Redirecting to login...');
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      console.log('Redirecting to app...');
      router.replace('/(tabs)');
    }
  }, [user, segments]);

  return null;
}