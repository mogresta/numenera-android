import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../../..//constants/Styles';
import { apiService } from '../../../services/api.service';
import BackButton from '../../../components/BackButton';
import { Item } from '../../../interfaces/item.interface';


export default function ItemDetail() {
  const { id } = useLocalSearchParams();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    if (!id) return;

    try {
      setLoading(true);

      const response = await apiService.getItem(Number(id));

      setItem(response.item);
    } catch (error) {
      console.error('Failed to load item:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a2151', '#0a0f2d']}
        style={styles.background}
      />
      <BackButton />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : item ? (
            <>
              <Text style={styles.title}>{item.name}</Text>
              <View style={styles.detailCard}>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Type:</Text>
                  <Text style={styles.value}>{item.type.name}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Source:</Text>
                  <Text style={styles.value}>{item.source?.name || '-'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Plan Type:</Text>
                  <Text style={styles.value}>{item.planType?.name || '-'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Description:</Text>
                  <Text style={styles.value}>{item.description || '-'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Level:</Text>
                  <Text style={styles.value}>{item.level || '-'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Forms:</Text>
                  <Text style={styles.value}>{item.forms || '-'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Depletion:</Text>
                  <Text style={styles.value}>{item.depletion || '-'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Material:</Text>
                  <Text style={styles.value}>{item.material || '-'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Modification:</Text>
                  <Text style={styles.value}>{item.modification || '-'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Reproduction:</Text>
                  <Text style={styles.value}>{item.reproduction || '-'}</Text>
                </View>
              </View>
            </>
          ) : (
            <Text style={styles.errorText}>Item not found</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}