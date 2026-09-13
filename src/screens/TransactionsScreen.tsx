import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFinance } from '../context/FinanceContext';
import { colors, radius, spacing } from '../constants/theme';
import { sortByDateDesc } from '../utils/selectors';
import { getCategoryById } from '../constants/categories';
import TransactionItem from '../components/TransactionItem';
import EmptyState from '../components/EmptyState';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Filter = 'all' | 'income' | 'expense';

export default function TransactionsScreen() {
  const { transactions, categories, settings } = useFinance();
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    let list = sortByDateDesc(transactions);
    if (filter !== 'all') list = list.filter((t) => t.type === filter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((t) => {
        const category = getCategoryById(categories, t.categoryId);
        return category.name.toLowerCase().includes(q) || (t.note ?? '').toLowerCase().includes(q);
      });
    }
    return list;
  }, [transactions, filter, query, categories]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Transactions</Text>
        <Pressable style={styles.addButton} onPress={() => navigation.navigate('AddTransaction')}>
          <Ionicons name="add" size={22} color={colors.white} />
        </Pressable>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une transaction..."
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <View style={styles.filters}>
        {(['all', 'income', 'expense'] as Filter[]).map((f) => (
          <Pressable
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? 'Tout' : f === 'income' ? 'Revenus' : 'Dépenses'}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="Aucun résultat"
            subtitle="Essayez un autre filtre ou terme de recherche"
          />
        }
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            category={getCategoryById(categories, item.categoryId)}
            currencySymbol={settings.currencySymbol}
            onPress={() => navigation.navigate('AddTransaction', { transactionId: item.id })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.md },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '800' },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  searchInput: { flex: 1, color: colors.textPrimary, paddingVertical: 10, fontSize: 14 },
  filters: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, marginBottom: spacing.sm },
  filterChip: { paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radius.full, backgroundColor: colors.surface },
  filterChipActive: { backgroundColor: colors.primary },
  filterText: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: colors.white },
  listContent: { paddingBottom: spacing.xl * 2 },
});
