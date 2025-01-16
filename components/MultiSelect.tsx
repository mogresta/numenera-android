import React, { useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import styles from '@/constants/Styles';
import MultiSelectProps from "@/interfaces/multiselectprops.interface";

export default function MultiSelect<T extends number>({
  title,
  items,
  selected,
  onSelectionChange,
  getDisplayName
}: MultiSelectProps<T>) {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleItem = (item: T) => {
    const newSelected = selected.includes(item)
      ? selected.filter(i => i !== item)
      : [...selected, item];
    onSelectionChange(newSelected);
  };

  const selectedCount = selected.length;
  const displayText = selectedCount > 0
    ? `${title} (${selectedCount})`
    : title;

  return (
    <View>
      <Pressable
        style={styles.filterButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.filterButtonText}>{displayText}</Text>
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{title}</Text>
            {items.map((item) => (
              <Pressable
                key={item}
                style={[
                  styles.modalItem,
                  selected.includes(item) && styles.modalItemSelected
                ]}
                onPress={() => toggleItem(item)}
              >
                <Text
                  style={[
                    styles.modalItemText,
                    selected.includes(item) && styles.modalItemTextSelected
                  ]}
                >
                  {getDisplayName(item)}
                </Text>
              </Pressable>
            ))}
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}