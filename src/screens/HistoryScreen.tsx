import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import TransactionItem from '../components/TransactionItem';
import { TransactionType } from '../types';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { getMonthKey, getMonthYear, formatCurrency } from '../utils/format';

type FilterType = 'all' | 'income' | 'expense';

export default function HistoryScreen() {
  const { transactions, deleteTransaction } = useTransactions();
  const [filter, setFilter] = useState<FilterType>('all');
  const [monthOffset, setMonthOffset] = useState(0);

  const currentMonthKey = useMemo(() => {
    const now = new Date();
    now.setMonth(now.getMonth() + monthOffset);
    return getMonthKey(now.toISOString());
  }, [monthOffset]);

  const monthLabel = useMemo(() => {
    const now = new Date();
    now.setMonth(now.getMonth() + monthOffset);
    return getMonthYear(now.toISOString());
  }, [monthOffset]);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => getMonthKey(t.date) === currentMonthKey)
      .filter(t => filter === 'all' || t.type === filter)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, currentMonthKey, filter]);

  const totalFiltered = useMemo(() => {
    return filteredTransactions.reduce((sum, t) => {
      return t.type === 'income' ? sum + t.amount : sum - t.amount;
    }, 0);
  }, [filteredTransactions]);

  const handleDelete = (id: string) => {
    Alert.alert(
      'Excluir transacao',
      'Tem certeza que deseja excluir esta transacao?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteTransaction(id),
        },
      ]
    );
  };

  const filterButtons: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'income', label: 'Receitas' },
    { key: 'expense', label: 'Despesas' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historico</Text>
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={() => setMonthOffset(prev => prev - 1)} style={styles.monthBtn}>
            <Feather name="chevron-left" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.monthText}>{monthLabel}</Text>
          <TouchableOpacity
            onPress={() => setMonthOffset(prev => Math.min(prev + 1, 0))}
            style={styles.monthBtn}
            disabled={monthOffset >= 0}
          >
            <Feather name="chevron-right" size={20} color={monthOffset >= 0 ? COLORS.textLight : COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {filterButtons.map(fb => (
          <TouchableOpacity
            key={fb.key}
            style={[styles.filterBtn, filter === fb.key && styles.filterBtnActive]}
            onPress={() => setFilter(fb.key)}
          >
            <Text style={[styles.filterText, filter === fb.key && styles.filterTextActive]}>
              {fb.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Summary */}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>
          {filteredTransactions.length} transacao(oes)
        </Text>
        <Text
          style={[
            styles.summaryValue,
            { color: totalFiltered >= 0 ? COLORS.income : COLORS.expense },
          ]}
        >
          {formatCurrency(Math.abs(totalFiltered))}
        </Text>
      </View>

      {/* Transaction List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TransactionItem transaction={item} onDelete={handleDelete} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="search" size={48} color={COLORS.textLight} />
            <Text style={styles.emptyText}>Nenhuma transacao encontrada</Text>
          </View>
        }
      />
    </View>
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
    paddingBottom: SPACING.sm,
  },
  title: {
    fontSize: FONTS.xlarge,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthBtn: {
    padding: SPACING.sm,
  },
  monthText: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.text,
    marginHorizontal: SPACING.md,
    textTransform: 'capitalize',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  summaryLabel: {
    fontSize: FONTS.small,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: FONTS.large,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  emptyText: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
});
