import { Text, View } from 'react-native';
import styles from '@/constants/Styles';
import { useUser } from '@/contexts/UserContext';

const UserData = () => {
    const { user } = useUser();

    if (!user) {
        return null;
    }

    return (
      <View style={styles.contentContainer}>
          <View style={styles.card}>
              <Text style={styles.text}>Username: {user.username}</Text>
              <Text style={styles.text}>Email: {user.email}</Text>
          </View>
      </View>
    );
};

export default UserData;