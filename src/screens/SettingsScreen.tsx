import React from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFinance } from '../context/FinanceContext';
import { colors, radius, spacing } from '../constants/theme';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const CURRENCIES = [
  { code: 'EUR', symbol: '€' },
  { code: 'USD', symbol: '$' },
  { code: 'GBP', symbol: '£' },
  { code: 'XOF', symbol: 'CFA' },
  { code: 'XAF', symbol: 'FCFA' },
  { code: 'CAD', symbol: 'CA$' },
];

export default function SettingsScreen() {
  const { settings, updateSettings, resetAll } = useFinance();
  const navigation = useNavigation<Nav>();

  const handleReset = () => {
    Alert.alert(
      'Réinitialiser les données',
      'Toutes vos transactions, budgets et catégories personnalisées seront supprimés définitivement. Continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Réinitialiser', style: 'destructive', onPress: () => resetAll() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Réglages</Text>

        <Text style={styles.sectionTitle}>Devise</Text>
        <View style={styles.currencyGrid}>
          {CURRENCIES.map((c) => (
            <Pressable
              key={c.code}
              style={[styles.currencyChip, settings.currency === c.code && styles.currencyChipActive]}
              onPress={() => updateSettings({ currency: c.code, currencySymbol: c.symbol })}
            >
              <Text style={[styles.currencyText, settings.currency === c.code && styles.currencyTextActive]}>
                {c.code} ({c.symbol})
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Général</Text>
        <Pressable style={styles.row} onPress={() => navigation.navigate('ManageCategories')}>
          <Ionicons name="pricetags-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.rowText}>Gérer les catégories</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </Pressable>

        <Pressable style={styles.row} onPress={handleReset}>
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
          <Text style={[styles.rowText, { color: colors.danger }]}>Réinitialiser les données</Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Mon Budget · v1.0.0</Text>
          <Text style={styles.footerText}>Vos données restent sur cet appareil</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '800', marginBottom: spacing.lg },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
    textTransform: 'uppercase',
  },
  currencyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  currencyChip: { paddingHorizontal: spacing.md, paddingVertical: 10, borderRadius: radius.full, backgroundColor: colors.surface },
  currencyChipActive: { backgroundColor: colors.primary },
  currencyText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  currencyTextActive: { color: colors.white },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  rowText: { flex: 1, color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  footer: { alignItems: 'center', marginTop: spacing.xl },
  footerText: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
});
