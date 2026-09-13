import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../constants/theme';
import { formatCurrency } from '../utils/format';

interface Props {
  label: string;
  amount: number;
  symbol: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export default function SummaryCard({ label, amount, symbol, icon, color }: Props) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: `${color}26` }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.amount}>{formatCurrency(amount, symbol)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  label: { color: colors.textMuted, fontSize: 12, marginBottom: 4 },
  amount: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
});
