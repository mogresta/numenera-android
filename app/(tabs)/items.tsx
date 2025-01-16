import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '@/constants/Styles';
import { apiService } from '@/services/api.service';
import MultiSelect from '@/components/MultiSelect';
import {Item} from '@/interfaces/item.interface';
import { Sources, SourceNames } from '@/enums/source.enum';
import { Types, TypeNames } from '@/enums/type.enum';
import { PlanTypes, PlanTypeNames } from '@/enums/planType.enum';
import BackButton from "@/components/BackButton";


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

  useEffect(() => {
    loadItems();
  }, [selectedSources, selectedTypes, selectedPlanTypes]);


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

            {/* Table Content */}
            {items.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.nameColumn]}>{item.name}</Text>
                <Text style={[styles.tableCell, styles.typeColumn]}>
                  {item.type.name}
                </Text>
                <Text style={[styles.tableCell, styles.sourceColumn]}>
                  {item.source?.name || ''}
                </Text>
                <Text style={[styles.tableCell, styles.sourceColumn]}>
                  {item.planType?.name || ''}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}