import React, {useEffect, useState} from "react";
import {Inventory, InventoryItem } from "@/interfaces/inventory.interface";
import {apiService} from "@/services/api.service";
import {ActivityIndicator, ScrollView, Text, View} from "react-native";
import styles from "@/constants/Styles";
import {LinearGradient} from "expo-linear-gradient";
import BackButton from "@/components/BackButton";
import {useCharacterEdit} from "@/contexts/CharacterContext";

export default function InventoryItemList() {
  const [inventory, setInventory] = useState<Inventory>();
  const [loading, setLoading] = useState(true);
  const { editingCharacter } = useCharacterEdit();

  useEffect(() => {
    loadItems();
  }, [editingCharacter]);

  const loadItems = async () => {
    if (!editingCharacter?.id) return;

    try {
      setLoading(true);

      const response = await apiService.getInventoryItems(editingCharacter.id);

      setInventory(response.inventory);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderInventoryTable = (items: InventoryItem[], title: string) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView style={styles.tableContainer}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableHeader, styles.nameColumn]}>Name</Text>
          <Text style={[styles.tableHeader, styles.typeColumn]}>Type</Text>
          <Text style={[styles.tableHeader, styles.sourceColumn]}>Source</Text>
          <Text style={[styles.tableHeader, styles.sourceColumn]}>PlanType</Text>
        </View>

        {items.map((inventoryItem) => (
          <View key={inventoryItem.id} style={[
            styles.tableRow,
            inventoryItem.expended && styles.expendedRow
          ]}>
            <Text style={[styles.tableCell, styles.nameColumn]}>{inventoryItem.item.name}</Text>
            <Text style={[styles.tableCell, styles.typeColumn]}>
              {inventoryItem.item.type.name}
            </Text>
            <Text style={[styles.tableCell, styles.sourceColumn]}>
              {inventoryItem.item.source?.name || ''}
            </Text>
            <Text style={[styles.tableCell, styles.sourceColumn]}>
              {inventoryItem.item.planType?.name || ''}
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
        <Text style={styles.title}>Inventory</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <>
            {inventory?.items && (
              <>
                {renderInventoryTable(
                  inventory.items.filter(item => !item.expended),
                  'Available Items'
                )}
                {inventory.items.some(item => item.expended) &&
                  renderInventoryTable(
                    inventory.items.filter(item => item.expended),
                    'Expended Items'
                  )
                }
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
}