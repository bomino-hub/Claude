import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '../context/FinanceContext';
import { colors, radius, spacing } from '../constants/theme';
import { currentMonthKey, formatCurrency, monthLabel } from '../utils/format';
import { getBudgetSpent } from '../utils/selectors';
import ProgressBar from '../components/ProgressBar';
import EmptyState from '../components/EmptyState';

export default function BudgetsScreen() {
  const { categories, budgets, transactions, settings, setBudget, deleteBudget } = useFinance();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftValue, setDraftValue] = useState('');
  const month = currentMonthKey();

  const expenseCategories = useMemo(() => categories.filter((c) => c.type === 'expense'), [categories]);

  const startEdit = (categoryId: string, currentLimit?: number) => {
    setEditingId(categoryId);
    setDraftValue(currentLimit ? String(currentLimit) : '');
  };

  const confirmEdit = (categoryId: string) => {
    const value = parseFloat(draftValue.replace(',', '.'));
    if (value > 0) {
      setBudget(categoryId, value);
    }
    setEditingId(null);
    setDraftValue('');
  };

  const removeBudget = (categoryId: string) => {
    const budget = budgets.find((b) => b.categoryId === categoryId);
    if (budget) deleteBudget(budget.id);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Budgets</Text>
        <Text style={styles.subtitle}>{monthLabel(month)}</Text>
      </View>
      <FlatList
        data={expenseCategories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState icon="wallet-outline" title="Aucune catégorie" />}
        renderItem={({ item }) => {
          const budget = budgets.find((b) => b.categoryId === item.id);
          const spent = getBudgetSpent(transactions, item.id, month);
          const isEditing = editingId === item.id;
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconWrap, { backgroundColor: `${item.color}26` }]}>
                  <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={18} color={item.color} />
                </View>
                <Text style={styles.categoryName}>{item.name}</Text>
                {budget && !isEditing && (
                  <Pressable onPress={() => removeBudget(item.id)} hitSlop={10}>
                    <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
                  </Pressable>
                )}
              </View>

              {isEditing ? (
                <View style={styles.editRow}>
                  <TextInput
                    style={styles.editInput}
                    keyboardType="decimal-pad"
                    placeholder="Montant limite"
                    placeholderTextColor={colors.textMuted}
                    value={draftValue}
                    onChangeText={setDraftValue}
                    autoFocus
                  />
                  <Pressable style={styles.confirmButton} onPress={() => confirmEdit(item.id)}>
                    <Ionicons name="checkmark" size={18} color={colors.white} />
                  </Pressable>
                </View>
              ) : budget ? (
                <Pressable onPress={() => startEdit(item.id, budget.limit)}>
                  <View style={styles.progressLabelRow}>
                    <Text style={styles.progressLabel}>
                      {formatCurrency(spent, settings.currencySymbol)} /{' '}
                      {formatCurrency(budget.limit, settings.currencySymbol)}
                    </Text>
                    <Text style={[styles.progressPct, spent > budget.limit && { color: colors.danger }]}>
                      {Math.round((spent / budget.limit) * 100)}%
                    </Text>
                  </View>
                  <ProgressBar progress={spent / budget.limit} color={item.color} />
                </Pressable>
              ) : (
                <Pressable style={styles.setButton} onPress={() => startEdit(item.id)}>
                  <Ionicons name="add-circle-outline" size={16} color={colors.primary} />
                  <Text style={styles.setButtonText}>Définir un budget</Text>
                </Pressable>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg },
  header: { paddingTop: spacing.md, marginBottom: spacing.md },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '800' },
  subtitle: { color: colors.textMuted, fontSize: 13, marginTop: 2, textTransform: 'capitalize' },
  listContent: { paddingBottom: spacing.xl * 2 },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: spacing.sm },
  iconWrap: { width: 32, height: 32, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  categoryName: { flex: 1, color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { color: colors.textSecondary, fontSize: 12 },
  progressPct: { color: colors.textSecondary, fontSize: 12, fontWeight: '700' },
  setButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  setButtonText: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  editRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  editInput: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    color: colors.textPrimary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
  confirmButton: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
