import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import { TransactionType, CategoryInfo } from '../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants/categories';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';

export default function AddTransactionScreen() {
  const { addTransaction } = useTransactions();
  const [type, setType] = useState<TransactionType>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dateText, setDateText] = useState(() => {
    const now = new Date();
    return `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  });

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setSelectedCategory('');
    const now = new Date();
    setDateText(`${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`);
  };

  const parseDate = (text: string): Date | null => {
    const parts = text.split('/');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    const date = new Date(year, month, day);
    if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) return null;
    return date;
  };

  const handleSave = async () => {
    if (!description.trim()) {
      Alert.alert('Erro', 'Informe uma descricao para a transacao.');
      return;
    }
    const numAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Erro', 'Informe um valor valido maior que zero.');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Erro', 'Selecione uma categoria.');
      return;
    }
    const date = parseDate(dateText);
    if (!date) {
      Alert.alert('Erro', 'Informe uma data valida no formato DD/MM/AAAA.');
      return;
    }

    await addTransaction({
      description: description.trim(),
      amount: numAmount,
      type,
      category: selectedCategory,
      date: date.toISOString(),
    });

    Alert.alert('Sucesso', 'Transacao adicionada com sucesso!');
    resetForm();
  };

  const formatAmountInput = (text: string) => {
    const cleaned = text.replace(/[^0-9,\.]/g, '');
    setAmount(cleaned);
  };

  const formatDateInput = (text: string) => {
    let cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length > 8) cleaned = cleaned.substring(0, 8);
    let formatted = '';
    if (cleaned.length > 0) formatted += cleaned.substring(0, Math.min(2, cleaned.length));
    if (cleaned.length > 2) formatted += '/' + cleaned.substring(2, Math.min(4, cleaned.length));
    if (cleaned.length > 4) formatted += '/' + cleaned.substring(4, 8);
    setDateText(formatted);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Nova Transacao</Text>
        </View>

        {/* Type Selector */}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeBtn, type === 'income' && styles.typeBtnIncomeActive]}
            onPress={() => { setType('income'); setSelectedCategory(''); }}
          >
            <Feather name="arrow-up-circle" size={18} color={type === 'income' ? COLORS.white : COLORS.income} />
            <Text style={[styles.typeText, type === 'income' && styles.typeTextActive]}>Receita</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeBtn, type === 'expense' && styles.typeBtnExpenseActive]}
            onPress={() => { setType('expense'); setSelectedCategory(''); }}
          >
            <Feather name="arrow-down-circle" size={18} color={type === 'expense' ? COLORS.white : COLORS.expense} />
            <Text style={[styles.typeText, type === 'expense' && styles.typeTextActive]}>Despesa</Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descricao</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Supermercado, Salario..."
            placeholderTextColor={COLORS.textLight}
            value={description}
            onChangeText={setDescription}
            maxLength={100}
          />
        </View>

        {/* Amount */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Valor (R$)</Text>
          <TextInput
            style={styles.input}
            placeholder="0,00"
            placeholderTextColor={COLORS.textLight}
            value={amount}
            onChangeText={formatAmountInput}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Data</Text>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={COLORS.textLight}
            value={dateText}
            onChangeText={formatDateInput}
            keyboardType="number-pad"
            maxLength={10}
          />
        </View>

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Categoria</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat: CategoryInfo) => (
              <TouchableOpacity
                key={cat.key}
                style={[
                  styles.categoryChip,
                  selectedCategory === cat.key && { backgroundColor: cat.color, borderColor: cat.color },
                ]}
                onPress={() => setSelectedCategory(cat.key)}
              >
                <Feather
                  name={cat.icon as keyof typeof Feather.glyphMap}
                  size={16}
                  color={selectedCategory === cat.key ? COLORS.white : cat.color}
                />
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === cat.key && { color: COLORS.white },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
          <Feather name="check" size={20} color={COLORS.white} />
          <Text style={styles.saveBtnText}>Salvar Transacao</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl + 20,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: FONTS.xlarge,
    fontWeight: '700',
    color: COLORS.text,
  },
  typeSelector: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    gap: SPACING.sm,
  },
  typeBtnIncomeActive: {
    backgroundColor: COLORS.income,
    borderColor: COLORS.income,
  },
  typeBtnExpenseActive: {
    backgroundColor: COLORS.expense,
    borderColor: COLORS.expense,
  },
  typeText: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.text,
  },
  typeTextActive: {
    color: COLORS.white,
  },
  inputGroup: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONTS.regular,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    gap: SPACING.xs,
  },
  categoryChipText: {
    fontSize: FONTS.small,
    fontWeight: '500',
    color: COLORS.text,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.md,
    paddingVertical: SPACING.md + 2,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.white,
  },
});
