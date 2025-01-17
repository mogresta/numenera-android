import React from 'react';
import { View, Text, Modal, Pressable, ScrollView } from 'react-native';
import styles from '@/constants/Styles';
import Character from "@/interfaces/character.interface";

interface CharacterSelectModalProps {
  visible: boolean;
  characters: Character[];
  onSelect: (characterId: number) => void;
  onClose: () => void;
}

export default function CharacterSelectModal({
 visible,
 characters,
 onSelect,
 onClose,
}: CharacterSelectModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Character</Text>
          <ScrollView>
            {characters.map((character) => (
              <Pressable
                key={character.id}
                style={styles.modalItem}
                onPress={() => {
                  onSelect(character.id!);
                  onClose();
                }}
              >
                <Text style={styles.modalItemText}>{character.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <Pressable
            style={styles.modalCloseButton}
            onPress={onClose}
          >
            <Text style={styles.modalCloseButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}