import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../types';
import { colors, radius, spacing } from '../constants/theme';

interface Props {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function CategoryPicker({ categories, selectedId, onSelect }: Props) {
  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id}
      numColumns={4}
      scrollEnabled={false}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        const selected = item.id === selectedId;
        return (
          <Pressable style={styles.cell} onPress={() => onSelect(item.id)}>
            <View
              style={[
                styles.iconWrap,
                {
                  backgroundColor: selected ? item.color : `${item.color}26`,
                  borderColor: item.color,
                  borderWidth: selected ? 0 : 1,
                },
              ]}
            >
              <Ionicons
                name={item.icon as keyof typeof Ionicons.glyphMap}
                size={20}
                color={selected ? colors.white : item.color}
              />
            </View>
            <Text style={styles.label} numberOfLines={1}>
              {item.name}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
  cell: { width: '25%', alignItems: 'center', marginBottom: spacing.md, paddingHorizontal: 2 },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  label: { color: colors.textSecondary, fontSize: 11, textAlign: 'center' },
});
