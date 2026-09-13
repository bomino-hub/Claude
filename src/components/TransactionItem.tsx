import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category, Transaction } from '../types';
import { colors, radius, spacing } from '../constants/theme';
import { formatDayMonth } from '../utils/format';
import AmountText from './AmountText';

interface Props {
  transaction: Transaction;
  category: Category;
  currencySymbol: string;
  onPress?: () => void;
}

export default function TransactionItem({ transaction, category, currencySymbol, onPress }: Props) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={[styles.iconWrap, { backgroundColor: `${category.color}26` }]}>
        <Ionicons name={category.icon as keyof typeof Ionicons.glyphMap} size={20} color={category.color} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {category.name}
        </Text>
        <Text style={styles.note} numberOfLines={1}>
          {transaction.note || formatDayMonth(transaction.date)}
        </Text>
      </View>
      <View style={styles.right}>
        <AmountText amount={transaction.amount} type={transaction.type} symbol={currencySymbol} />
        <Text style={styles.date}>{formatDayMonth(transaction.date)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  info: { flex: 1, marginRight: spacing.sm },
  name: { color: colors.textPrimary, fontSize: 15, fontWeight: '600' },
  note: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  date: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
});
