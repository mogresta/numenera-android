import React, {useCallback, useEffect, useState} from "react";
import {Inventory, InventoryItem } from "@/interfaces/inventory.interface";
import {apiService} from "@/services/api.service";
import {ActivityIndicator, Alert, ScrollView, Text, View} from "react-native";
import styles from "@/constants/Styles";
import {LinearGradient} from "expo-linear-gradient";
import BackButton from "@/components/BackButton";
import {useCharacterEdit} from "@/contexts/CharacterContext";
import {router} from "expo-router";
import ItemRow from "@/components/ItemRow";
import {useFocusEffect} from "@react-navigation/native";

export default function InventoryItemList() {
  const [inventory, setInventory] = useState<Inventory>();
  const [loading, setLoading] = useState(true);
  const { editingCharacter } = useCharacterEdit();
  const [pressedId, setPressedId] = useState<number | null>(null);
  const [needsRefresh, setNeedsRefresh] = useState(false);

  useEffect(() => {
    loadItems();
  }, [editingCharacter]);

  useFocusEffect(
    useCallback(() => {
      if (needsRefresh) {
        loadItems();
        setNeedsRefresh(false);
      }
    }, [needsRefresh])
  );

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

  const handleItemPress = (itemId: number) => {
    router.replace(`/(tabs)/item/${itemId}`);
  };

  const handleAction = async (actionType: string, item: InventoryItem) => {
    try {
      switch (actionType) {
        case 'expend':
          try {
            await apiService.expendItem(item.id);

            Alert.alert('Success', 'Item used successfully.');
          } catch (error) {
            console.error('Failed to mark item as used:', error);
          }
          break;

        case 'return':
          try {
            await apiService.returnItemToGroup(item.item.id, item.groupInventory.id);

            Alert.alert('Success', 'Item successfully added to group inventory');
          } catch (error) {
            console.error('Failed to add item to group inventory:', error);
          }
          break;
      }
      setNeedsRefresh(true);
    } catch (error) {
      console.error('Action failed:', error);
      Alert.alert('Error', 'Failed to perform action');
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
          <ItemRow
            key={inventoryItem.id}
            item={inventoryItem}
            mode="character-inventory"
            onPress={handleItemPress}
            onPressIn={() => setPressedId(inventoryItem.id)}
            onPressOut={() => setPressedId(null)}
            pressedId={pressedId}
            onAction={(actionType) => handleAction(actionType, inventoryItem)}
          />
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