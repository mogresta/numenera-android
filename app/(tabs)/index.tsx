import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '@/constants/Styles';
import UserProfile from '../../components/UserProfile';

export default function MainScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a2151', '#0a0f2d']}
        style={styles.background}
      />

       <UserProfile />
    </View>
  );
}
