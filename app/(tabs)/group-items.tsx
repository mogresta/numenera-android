import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '@/constants/Styles';
import { apiService } from '@/services/api.service';
import BackButton from "@/components/BackButton";
import {GroupInventory} from "@/interfaces/groupInventory.interface";

export default function GroupItemList() {
  const [groupInventory, setGroupInventory] = useState<GroupInventory[]>([]);
  const [loading, setLoading] = useState(true);

  const activeItems = groupInventory.filter(item => !item.expended);
  const expendedItems = groupInventory.filter(item => item.expended);

  useEffect(() => {
    loadItems();
  }, []);


  const loadItems = async () => {
    try {
      setLoading(true);

      const response = await apiService.getGroupItems();

      setGroupInventory(response.inventory || []);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderInventoryTable = (items: GroupInventory[], title: string) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView style={styles.tableContainer}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableHeader, styles.nameColumn]}>Name</Text>
          <Text style={[styles.tableHeader, styles.typeColumn]}>Type</Text>
          <Text style={[styles.tableHeader, styles.sourceColumn]}>Source</Text>
          <Text style={[styles.tableHeader, styles.statusColumn]}>Status</Text>
        </View>

        {items.map((groupItem) => (
          <View key={groupItem.id} style={[
            styles.tableRow,
            groupItem.loaned && styles.loanedRow
          ]}>
            <Text style={[styles.tableCell, styles.nameColumn]}>
              {groupItem.item.name}
            </Text>
            <Text style={[styles.tableCell, styles.typeColumn]}>
              {groupItem.item.type.name}
            </Text>
            <Text style={[styles.tableCell, styles.sourceColumn]}>
              {groupItem.item.source?.name || ''}
            </Text>
            <Text style={[styles.tableCell, styles.statusColumn]}>
              {groupItem.loaned ? (
                <Text style={styles.loanedText}>
                  Loaned to {groupItem.character?.name || 'Unknown'}
                </Text>
              ) : 'Available'}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a2151', '#0a0f2d']}
        style={styles.background}
      />
      <BackButton />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Group Inventory</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <>
            {renderInventoryTable(activeItems, 'Available Items')}
            {expendedItems.length > 0 && (
              renderInventoryTable(expendedItems, 'Expended Items')
            )}
          </>
        )}
      </View>
    </View>
  );
}