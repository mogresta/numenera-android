import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, ScrollView, ActivityIndicator, Pressable, Alert} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '@/constants/Styles';
import { apiService } from '@/services/api.service';
import BackButton from "@/components/BackButton";
import {GroupInventory} from "@/interfaces/groupInventory.interface";
import {router} from "expo-router";
import ItemRow from "@/components/ItemRow";
import {Item} from "@/interfaces/item.interface";
import CharacterSelectModal from "@/components/CharacterSelectModal";
import {useCharacters} from "@/contexts/CharacterContext";
import {useFocusEffect} from "@react-navigation/native";

export default function GroupItemList() {
  const [groupInventory, setGroupInventory] = useState<GroupInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [pressedId, setPressedId] = useState<number | null>(null);
  const [showCharacterSelect, setShowCharacterSelect] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const activeItems = groupInventory.filter(item => !item.expended);
  const expendedItems = groupInventory.filter(item => item.expended)
  const { characters } = useCharacters();
  const [needsRefresh, setNeedsRefresh] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (needsRefresh) {
        loadItems();
        setNeedsRefresh(false);
      }
    }, [needsRefresh])
  );

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

  const handleAction = async (actionType: string, item: Item) => {
    try {
      switch (actionType) {
        case 'loan':
          setSelectedItem(item);
          setShowCharacterSelect(true);
          break;
      }
      setNeedsRefresh(true);
    } catch (error) {
      console.error('Action failed:', error);
      Alert.alert('Error', 'Failed to perform action');
    }
  };

  const handleItemPress = (itemId: number) => {
    router.replace(`/(tabs)/item/${itemId}`);
  };

  const handleCharacterSelect = async (characterId: number) => {
    if (!selectedItem) return;
    console.log("Character: " + characterId)
    try {
      await apiService.loanItemFromGroup(selectedItem.id, characterId);

      Alert.alert('Success', 'Item successfully added to your inventory');
    } catch (error) {
      console.error('Failed to add item to character inventory:', error);
    } finally {
      setSelectedItem(null);
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
          <ItemRow
            key={groupItem.id}
            item={groupItem}
            mode="group-inventory"
            onPress={handleItemPress}
            onPressIn={() => setPressedId(groupItem.id)}
            onPressOut={() => setPressedId(null)}
            pressedId={pressedId}
            onAction={(actionType) => handleAction(actionType, groupItem.item)}
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

      <CharacterSelectModal
        visible={showCharacterSelect}
        characters={characters}
        onSelect={handleCharacterSelect}
        onClose={() => {
          setShowCharacterSelect(false);
          setSelectedItem(null);
        }}
      />
    </View>
  );
}