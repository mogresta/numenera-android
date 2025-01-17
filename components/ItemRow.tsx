import React from 'react';
import { View, Text, Pressable } from 'react-native';
import styles from '@/constants/Styles';
import ItemActionButton from './ItemActionButton';

interface ItemRowProps {
  item: any;
  onPress: (itemId: number) => void;
  onPressIn: () => void;
  onPressOut: () => void;
  pressedId: number | null;
  mode: 'item-list' | 'character-inventory' | 'group-inventory';
  onAction?: (actionType: string) => void;
}

export default function ItemRow({
  item,
  onPress,
  onPressIn,
  onPressOut,
  pressedId,
  mode,
  onAction
}: ItemRowProps) {
  const handleItemPress = () => {
    const itemId: number = mode === 'item-list' ? item.id : item.item.id;
    onPress(itemId);
  };

  return (
    <View>
      <Pressable
        onPress={handleItemPress}
        style={[
          styles.rowContent,
          pressedId === item.id && styles.tableRowPressed,
          mode === 'group-inventory' && item.loaned && styles.loanedRow,
          mode === 'character-inventory' && item.expended && styles.expendedRow
        ]}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        delayLongPress={200}
      >
        <Text style={[styles.tableCell, styles.nameColumn]}>
          {mode === 'item-list' ? item.name : item.item.name}
        </Text>
        <Text style={[styles.tableCell, styles.typeColumn]}>
          {mode === 'item-list' ? item.type.name : item.item.type.name}
        </Text>
        <Text style={[styles.tableCell, styles.sourceColumn]}>
          {mode === 'item-list' ? item.source?.name : item.item.source?.name}
        </Text>
        {mode === 'group-inventory' && (
          <Text style={[styles.tableCell, styles.statusColumn]}>
            {item.loaned ? (
              <Text style={styles.loanedText}>
                Loaned to {item.character?.name || 'Unknown'}
              </Text>
            ) : 'Available'}
          </Text>
        )}
      </Pressable>
          <View style={styles.actionButtons}>
            {mode === 'item-list' && (
              <View style={styles.actionButtons}>
                <ItemActionButton
                  title="Add to Group"
                  onPress={() => onAction?.('addToGroup')}
                />
                <ItemActionButton
                  title="Add to Character"
                  onPress={() => onAction?.('addToCharacter')}
                />
              </View>
            )}
            {mode === 'character-inventory' && (
              <View style={styles.actionButtons}>
                {!item.expended && (
                  <ItemActionButton
                  title="Expend"
                  variant="danger"
                  onPress={() => onAction?.('expend')}
                />
                )}
                {item.groupInventory && !item.expended && (
                  <ItemActionButton
                    title="Return"
                    variant="secondary"
                    onPress={() => onAction?.('return')}
                  />
                )}
              </View>
            )}
            {mode === 'group-inventory' && !item.expended && !item.loaned && (
              <View style={styles.actionButtons}>
              <ItemActionButton
                title="Loan"
                onPress={() => onAction?.('loan')}
              />
              </View>
            )}
          </View>
        </View>
  );
}