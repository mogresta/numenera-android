import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, TextInput, ScrollView, ActivityIndicator, Pressable, Alert} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '@/constants/Styles';
import { apiService } from '@/services/api.service';
import MultiSelect from '@/components/MultiSelect';
import {Item} from '@/interfaces/item.interface';
import { Sources, SourceNames } from '@/enums/source.enum';
import { Types, TypeNames } from '@/enums/type.enum';
import { PlanTypes, PlanTypeNames } from '@/enums/planType.enum';
import BackButton from "@/components/BackButton";
import {router} from "expo-router";
import ItemRow from '@/components/ItemRow';
import CharacterSelectModal from '@/components/CharacterSelectModal';
import {useCharacters} from "@/contexts/CharacterContext";
import {useFocusEffect} from "@react-navigation/native";

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedSources, setSelectedSources] = useState<Sources[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<Types[]>([]);
  const [selectedPlanTypes, setSelectedPlanTypes] = useState<PlanTypes[]>([]);
  const sourceOptions = Object.values(Sources).filter(v => !isNaN(Number(v))) as Sources[];
  const typeOptions = Object.values(Types).filter(v => !isNaN(Number(v))) as Types[];
  const planTypeOptions = Object.values(PlanTypes).filter(v => !isNaN(Number(v))) as PlanTypes[];
  const [pressedId, setPressedId] = useState<number | null>(null);
  const [showCharacterSelect, setShowCharacterSelect] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const { characters } = useCharacters();
  const [needsRefresh, setNeedsRefresh] = useState(false);

  useEffect(() => {
    loadItems();
  }, [selectedSources, selectedTypes, selectedPlanTypes]);

  useFocusEffect(
    useCallback(() => {
      if (selectedSources.length === 0 && selectedTypes.length === 0 && selectedPlanTypes.length === 0) {
        loadItems();
      }
    }, [])
  );

  const loadItems = async () => {
    try {
      setLoading(true);

      const response = await apiService.getItems(
        selectedSources,
        selectedTypes,
        selectedPlanTypes
      );

      setItems(response.items || []);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await apiService.searchItems(searchText);
      setItems(response.items || []);
    } catch (error) {
      console.error('Failed to search items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = (itemId: number) => {
    router.replace(`/(tabs)/item/${itemId}`);
  };

  const handleAction = async (actionType: string, item: Item) => {
    try {
      switch (actionType) {
        case 'addToGroup':
          try {
            await apiService.addItemToGroupInventory(item.id);

            Alert.alert('Success', 'Item successfully added to group inventory');
          } catch (error) {
            console.error('Failed to add item to group:', error);
          }
          break;
        case 'addToCharacter':
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

  const handleCharacterSelect = async (characterId: number) => {
    if (!selectedItem) return;
    console.log("Character: " + characterId)
    try {
      await apiService.addItemToCharacterInventory(characterId, selectedItem.id);

      Alert.alert('Success', 'Item successfully added to your inventory');
    } catch (error) {
      console.error('Failed to add item to character inventory:', error);
    } finally {
      setSelectedItem(null);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a2151', '#0a0f2d']}
        style={styles.background}
      />
      <BackButton />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Items</Text>

        {/* Search Bar */}
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search items..."
          placeholderTextColor="#999"
          onSubmitEditing={handleSearch}
        />

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <MultiSelect
            title="Sources"
            items={sourceOptions}
            selected={selectedSources}
            onSelectionChange={setSelectedSources}
            getDisplayName={(value) => SourceNames[value]} // Convert ID to display name
          />
          <MultiSelect
            title="Types"
            items={typeOptions}
            selected={selectedTypes}
            onSelectionChange={setSelectedTypes}
            getDisplayName={(value) => TypeNames[value]} // Convert ID to display name
          />
          <MultiSelect
            title="PlanTypes"
            items={planTypeOptions}
            selected={selectedPlanTypes}
            onSelectionChange={setSelectedPlanTypes}
            getDisplayName={(value) => PlanTypeNames[value]} // Convert ID to display name
          />
        </View>

        {/* Items Table */}
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <ScrollView style={styles.tableContainer}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, styles.nameColumn]}>Name</Text>
              <Text style={[styles.tableHeader, styles.typeColumn]}>Type</Text>
              <Text style={[styles.tableHeader, styles.sourceColumn]}>Source</Text>
              <Text style={[styles.tableHeader, styles.sourceColumn]}>PlanType</Text>
            </View>

            {items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                mode="item-list"
                onPress={handleItemPress}
                onPressIn={() => setPressedId(item.id)}
                onPressOut={() => setPressedId(null)}
                pressedId={pressedId}
                onAction={(actionType) => handleAction(actionType, item)}
              />
            ))}
          </ScrollView>
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