import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFinance } from '../context/FinanceContext';
import { colors, radius, spacing } from '../constants/theme';
import { RootStackParamList } from '../navigation/types';
import CategoryPicker from '../components/CategoryPicker';
import { TransactionType } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AddTransaction'>;
type Route = RouteProp<RootStackParamList, 'AddTransaction'>;

function isoDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export default function AddTransactionScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { transactions, categories, addTransaction, updateTransaction, deleteTransaction } = useFinance();

  const editing = useMemo(
    () =>
      route.params?.transactionId
        ? transactions.find((t) => t.id === route.params?.transactionId)
        : undefined,
    [route.params?.transactionId, transactions]
  );

  const [type, setType] = useState<TransactionType>(editing?.type ?? route.params?.type ?? 'expense');
  const [amount, setAmount] = useState(editing ? String(editing.amount) : '');
  const [categoryId, setCategoryId] = useState<string | null>(editing?.categoryId ?? null);
  const [dateText, setDateText] = useState(editing ? editing.date.slice(0, 10) : isoDateOnly(new Date()));
  const [note, setNote] = useState(editing?.note ?? '');
  const [error, setError] = useState<string | null>(null);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setCategoryId(null);
  }, [type]);

  const filteredCategories = useMemo(() => categories.filter((c) => c.type === type), [categories, type]);

  const setQuickDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() - offsetDays);
    setDateText(isoDateOnly(d));
  };

  const handleSave = () => {
    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (!numericAmount || numericAmount <= 0) {
      setError('Entrez un montant valide');
      return;
    }
    if (!categoryId) {
      setError('Choisissez une catégorie');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateText)) {
      setError('Date invalide (AAAA-MM-JJ)');
      return;
    }
    const isoDate = new Date(`${dateText}T12:00:00`).toISOString();

    if (editing) {
      updateTransaction({
        ...editing,
        type,
        amount: numericAmount,
        categoryId,
        date: isoDate,
        note: note.trim() || undefined,
      });
    } else {
      addTransaction({ type, amount: numericAmount, categoryId, date: isoDate, note: note.trim() || undefined });
    }
    navigation.goBack();
  };

  const handleDelete = () => {
    if (editing) {
      deleteTransaction(editing.id);
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
            <Ionicons name="close" size={26} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.title}>{editing ? 'Modifier' : 'Nouvelle transaction'}</Text>
          {editing ? (
            <Pressable onPress={handleDelete} hitSlop={12}>
              <Ionicons name="trash-outline" size={22} color={colors.danger} />
            </Pressable>
          ) : (
            <View style={{ width: 22 }} />
          )}
        </View>

        <View style={styles.typeToggle}>
          {(['expense', 'income'] as TransactionType[]).map((t) => (
            <Pressable
              key={t}
              style={[
                styles.typeButton,
                type === t && { backgroundColor: t === 'income' ? colors.income : colors.expense },
              ]}
              onPress={() => setType(t)}
            >
              <Text style={[styles.typeButtonText, type === t && styles.typeButtonTextActive]}>
                {t === 'income' ? 'Revenu' : 'Dépense'}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Montant</Text>
        <View style={styles.amountRow}>
          <TextInput
            style={styles.amountInput}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={colors.textMuted}
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <Text style={styles.label}>Catégorie</Text>
        <CategoryPicker categories={filteredCategories} selectedId={categoryId} onSelect={setCategoryId} />

        <Text style={styles.label}>Date</Text>
        <View style={styles.quickDateRow}>
          <Pressable style={styles.quickDateChip} onPress={() => setQuickDate(0)}>
            <Text style={styles.quickDateText}>Aujourd'hui</Text>
          </Pressable>
          <Pressable style={styles.quickDateChip} onPress={() => setQuickDate(1)}>
            <Text style={styles.quickDateText}>Hier</Text>
          </Pressable>
        </View>
        <TextInput
          style={styles.textInput}
          placeholder="AAAA-MM-JJ"
          placeholderTextColor={colors.textMuted}
          value={dateText}
          onChangeText={setDateText}
        />

        <Text style={styles.label}>Note (optionnel)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Ex: Courses de la semaine"
          placeholderTextColor={colors.textMuted}
          value={note}
          onChangeText={setNote}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{editing ? 'Enregistrer' : 'Ajouter'}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  title: { color: colors.textPrimary, fontSize: 17, fontWeight: '700' },
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.lg,
  },
  typeButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: radius.sm },
  typeButtonText: { color: colors.textMuted, fontWeight: '700' },
  typeButtonTextActive: { color: colors.white },
  label: { color: colors.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: spacing.sm, marginTop: spacing.sm },
  amountRow: { backgroundColor: colors.surface, borderRadius: radius.md, marginBottom: spacing.lg },
  amountInput: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: '800',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  quickDateRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  quickDateChip: { backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radius.full },
  quickDateText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  textInput: {
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    fontSize: 14,
  },
  error: { color: colors.danger, marginBottom: spacing.md, textAlign: 'center' },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  saveButtonText: { color: colors.white, fontSize: 16, fontWeight: '700' },
});
