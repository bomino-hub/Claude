import React, { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '../context/FinanceContext';
import { colors, radius, spacing } from '../constants/theme';
import { formatCurrency, monthLabel } from '../utils/format';
import { filterByMonth, getCategoryTotals, sumByType } from '../utils/selectors';
import { getCategoryById } from '../constants/categories';
import EmptyState from '../components/EmptyState';
import ProgressBar from '../components/ProgressBar';

function shiftMonth(key: string, delta: number): string {
  const [year, month] = key.split('-').map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export default function StatisticsScreen() {
  const { transactions, categories, settings } = useFinance();
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));

  const monthTransactions = useMemo(() => filterByMonth(transactions, month), [transactions, month]);
  const income = useMemo(() => sumByType(monthTransactions, 'income'), [monthTransactions]);
  const expense = useMemo(() => sumByType(monthTransactions, 'expense'), [monthTransactions]);
  const categoryTotals = useMemo(() => getCategoryTotals(monthTransactions, 'expense'), [monthTransactions]);
  const totalExpense = expense || 1;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistiques</Text>
      </View>

      <View style={styles.monthNav}>
        <Pressable onPress={() => setMonth((m) => shiftMonth(m, -1))} hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
        </Pressable>
        <Text style={styles.monthLabel}>{monthLabel(month)}</Text>
        <Pressable onPress={() => setMonth((m) => shiftMonth(m, 1))} hitSlop={10}>
          <Ionicons name="chevron-forward" size={22} color={colors.textSecondary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.compareCard}>
          <View style={styles.compareRow}>
            <Text style={styles.compareLabel}>Revenus</Text>
            <Text style={[styles.compareValue, { color: colors.income }]}>
              {formatCurrency(income, settings.currencySymbol)}
            </Text>
          </View>
          <ProgressBar progress={income + expense ? income / (income + expense) : 0} color={colors.income} />
          <View style={[styles.compareRow, { marginTop: spacing.md }]}>
            <Text style={styles.compareLabel}>Dépenses</Text>
            <Text style={[styles.compareValue, { color: colors.expense }]}>
              {formatCurrency(expense, settings.currencySymbol)}
            </Text>
          </View>
          <ProgressBar progress={income + expense ? expense / (income + expense) : 0} color={colors.expense} />
        </View>

        <Text style={styles.sectionTitle}>Répartition des dépenses</Text>
        {categoryTotals.length === 0 ? (
          <EmptyState icon="pie-chart-outline" title="Pas de dépenses ce mois-ci" />
        ) : (
          categoryTotals.map((item) => {
            const category = getCategoryById(categories, item.categoryId);
            const pct = Math.round((item.total / totalExpense) * 100);
            return (
              <View key={item.categoryId} style={styles.categoryCard}>
                <View style={styles.categoryHeader}>
                  <View style={[styles.iconWrap, { backgroundColor: `${category.color}26` }]}>
                    <Ionicons name={category.icon as keyof typeof Ionicons.glyphMap} size={16} color={category.color} />
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryPct}>{pct}%</Text>
                </View>
                <ProgressBar progress={item.total / totalExpense} color={category.color} />
                <Text style={styles.categoryAmount}>{formatCurrency(item.total, settings.currencySymbol)}</Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg },
  header: { paddingTop: spacing.md },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '800' },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  monthLabel: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'capitalize',
    minWidth: 140,
    textAlign: 'center',
  },
  content: { paddingBottom: spacing.xl * 2 },
  compareCard: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.lg },
  compareRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  compareLabel: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  compareValue: { fontSize: 13, fontWeight: '700' },
  sectionTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '700', marginBottom: spacing.sm },
  categoryCard: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  iconWrap: { width: 28, height: 28, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  categoryName: { flex: 1, color: colors.textPrimary, fontSize: 13, fontWeight: '600' },
  categoryPct: { color: colors.textMuted, fontSize: 12, fontWeight: '700' },
  categoryAmount: { color: colors.textMuted, fontSize: 12, marginTop: 6 },
});
