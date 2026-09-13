import React, { useMemo } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFinance } from '../context/FinanceContext';
import { colors, radius, spacing } from '../constants/theme';
import { currentMonthKey, formatCurrency, monthLabel } from '../utils/format';
import { filterByMonth, getCategoryTotals, sortByDateDesc, sumByType } from '../utils/selectors';
import { getCategoryById } from '../constants/categories';
import SummaryCard from '../components/SummaryCard';
import TransactionItem from '../components/TransactionItem';
import EmptyState from '../components/EmptyState';
import ProgressBar from '../components/ProgressBar';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function DashboardScreen() {
  const { transactions, categories, settings } = useFinance();
  const navigation = useNavigation<Nav>();
  const month = currentMonthKey();

  const monthTransactions = useMemo(() => filterByMonth(transactions, month), [transactions, month]);
  const income = useMemo(() => sumByType(monthTransactions, 'income'), [monthTransactions]);
  const expense = useMemo(() => sumByType(monthTransactions, 'expense'), [monthTransactions]);
  const balance = useMemo(
    () => sumByType(transactions, 'income') - sumByType(transactions, 'expense'),
    [transactions]
  );
  const topCategories = useMemo(() => getCategoryTotals(monthTransactions, 'expense').slice(0, 4), [
    monthTransactions,
  ]);
  const recent = useMemo(() => sortByDateDesc(transactions).slice(0, 5), [transactions]);
  const maxCategoryTotal = topCategories[0]?.total ?? 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Solde total</Text>
            <Text style={styles.balance}>{formatCurrency(balance, settings.currencySymbol)}</Text>
          </View>
          <Pressable style={styles.addButton} onPress={() => navigation.navigate('AddTransaction')}>
            <Ionicons name="add" size={26} color={colors.white} />
          </Pressable>
        </View>

        <Text style={styles.monthLabel}>{monthLabel(month)}</Text>

        <View style={styles.row}>
          <SummaryCard
            label="Revenus"
            amount={income}
            symbol={settings.currencySymbol}
            icon="arrow-down-circle"
            color={colors.income}
          />
          <View style={{ width: spacing.md }} />
          <SummaryCard
            label="Dépenses"
            amount={expense}
            symbol={settings.currencySymbol}
            icon="arrow-up-circle"
            color={colors.expense}
          />
        </View>

        {topCategories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top dépenses du mois</Text>
            {topCategories.map((item) => {
              const category = getCategoryById(categories, item.categoryId);
              return (
                <View key={item.categoryId} style={styles.categoryRow}>
                  <View style={styles.categoryRowHeader}>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryAmount}>
                      {formatCurrency(item.total, settings.currencySymbol)}
                    </Text>
                  </View>
                  <ProgressBar
                    progress={maxCategoryTotal ? item.total / maxCategoryTotal : 0}
                    color={category.color}
                  />
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transactions récentes</Text>
          {recent.length === 0 ? (
            <EmptyState
              icon="receipt-outline"
              title="Aucune transaction"
              subtitle="Ajoutez votre première transaction avec le bouton +"
            />
          ) : (
            recent.map((t) => (
              <TransactionItem
                key={t.id}
                transaction={t}
                category={getCategoryById(categories, t.categoryId)}
                currencySymbol={settings.currencySymbol}
                onPress={() => navigation.navigate('AddTransaction', { transactionId: t.id })}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { color: colors.textMuted, fontSize: 13 },
  balance: { color: colors.textPrimary, fontSize: 30, fontWeight: '800', marginTop: 4 },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textTransform: 'capitalize',
  },
  row: { flexDirection: 'row', marginTop: spacing.xs },
  section: { marginTop: spacing.xl },
  sectionTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '700', marginBottom: spacing.sm },
  categoryRow: { marginBottom: spacing.md },
  categoryRowHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  categoryName: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  categoryAmount: { color: colors.textPrimary, fontSize: 13, fontWeight: '700' },
});
