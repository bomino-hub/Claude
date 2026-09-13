import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFinance } from '../context/FinanceContext';
import { colors, radius, spacing } from '../constants/theme';
import { TransactionType } from '../types';

const ICONS: (keyof typeof Ionicons.glyphMap)[] = [
  'restaurant',
  'car',
  'home',
  'game-controller',
  'medkit',
  'bag',
  'receipt',
  'school',
  'cash',
  'briefcase',
  'trending-up',
  'gift',
  'airplane',
  'paw',
  'fitness',
  'cafe',
  'wine',
  'card',
  'phone-portrait',
  'construct',
];

const PALETTE: string[] = [
  '#F97316',
  '#0EA5E9',
  '#8B5CF6',
  '#EC4899',
  '#22C55E',
  '#F43F5E',
  '#EAB308',
  '#3B82F6',
  '#34D399',
  '#38BDF8',
  '#A78BFA',
  '#FB923C',
];

export default function ManageCategoriesScreen() {
  const navigation = useNavigation();
  const { categories, addCategory } = useFinance();
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [icon, setIcon] = useState<keyof typeof Ionicons.glyphMap>(ICONS[0]);
  const [color, setColor] = useState(PALETTE[0]);

  const handleAdd = () => {
    if (!name.trim()) return;
    addCategory({ name: name.trim(), icon, color, type });
    setName('');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="close" size={26} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Catégories</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Dépenses</Text>
        <View style={styles.grid}>
          {categories
            .filter((c) => c.type === 'expense')
            .map((c) => (
              <View key={c.id} style={styles.categoryChip}>
                <Ionicons name={c.icon as keyof typeof Ionicons.glyphMap} size={14} color={c.color} />
                <Text style={styles.categoryChipText}>{c.name}</Text>
              </View>
            ))}
        </View>

        <Text style={styles.sectionTitle}>Revenus</Text>
        <View style={styles.grid}>
          {categories
            .filter((c) => c.type === 'income')
            .map((c) => (
              <View key={c.id} style={styles.categoryChip}>
                <Ionicons name={c.icon as keyof typeof Ionicons.glyphMap} size={14} color={c.color} />
                <Text style={styles.categoryChipText}>{c.name}</Text>
              </View>
            ))}
        </View>

        <Text style={styles.sectionTitle}>Nouvelle catégorie</Text>
        <View style={styles.typeToggle}>
          {(['expense', 'income'] as TransactionType[]).map((t) => (
            <Pressable
              key={t}
              style={[styles.typeButton, type === t && { backgroundColor: colors.primary }]}
              onPress={() => setType(t)}
            >
              <Text style={[styles.typeButtonText, type === t && { color: colors.white }]}>
                {t === 'income' ? 'Revenu' : 'Dépense'}
              </Text>
            </Pressable>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Nom de la catégorie"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Icône</Text>
        <View style={styles.iconGrid}>
          {ICONS.map((i) => (
            <Pressable
              key={i}
              style={[styles.iconOption, icon === i && { backgroundColor: color }]}
              onPress={() => setIcon(i)}
            >
              <Ionicons name={i} size={18} color={icon === i ? colors.white : colors.textSecondary} />
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Couleur</Text>
        <View style={styles.colorGrid}>
          {PALETTE.map((c) => (
            <Pressable
              key={c}
              style={[styles.colorOption, { backgroundColor: c }, color === c && styles.colorOptionActive]}
              onPress={() => setColor(c)}
            />
          ))}
        </View>

        <Pressable style={styles.saveButton} onPress={handleAdd}>
          <Text style={styles.saveButtonText}>Ajouter la catégorie</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg },
  title: { color: colors.textPrimary, fontSize: 17, fontWeight: '700' },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl * 2 },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  categoryChipText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  typeToggle: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.md, padding: 4, marginBottom: spacing.md },
  typeButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: radius.sm },
  typeButtonText: { color: colors.textMuted, fontWeight: '700' },
  input: { backgroundColor: colors.surface, color: colors.textPrimary, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md },
  label: { color: colors.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: spacing.sm },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  iconOption: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  colorOption: { width: 32, height: 32, borderRadius: radius.full },
  colorOptionActive: { borderWidth: 3, borderColor: colors.white },
  saveButton: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center' },
  saveButtonText: { color: colors.white, fontSize: 15, fontWeight: '700' },
});
