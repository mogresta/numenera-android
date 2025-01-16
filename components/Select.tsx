import React, { useState } from 'react';
import {View, Text, Pressable, Modal} from 'react-native';
import styles from '@/constants/Styles';
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface SelectProps<T extends number> {
  label: string;                        //menu name
  value: T;                             //currently picked value
  onValueChange: (value: T) => void;    //what to do on pick
  items: { value: T; label: string }[]; //choices
}

export default function Select<T extends number>({
                                                   label,
                                                   value,
                                                   onValueChange,
                                                   items
                                                 }: SelectProps<T>) {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedItem = items.find(item => item.value === value);

  return (
    <View style={styles.selectContainer}>
      <Text style={styles.text}>{label}</Text>
      <Pressable
        style={styles.selectButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectButtonText}>
          {selectedItem?.label || 'Select...'}
        </Text>
        <FontAwesome name="chevron-down" size={14} color="#e4e4ff" />
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{label}</Text>
            {items.map((item) => (
              <Pressable
                key={item.value}
                style={[
                  styles.modalItem,
                  value === item.value && styles.modalItemSelected
                ]}
                onPress={() => {
                  onValueChange(item.value);
                  setModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.modalItemText,
                    value === item.value && styles.modalItemTextSelected
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}