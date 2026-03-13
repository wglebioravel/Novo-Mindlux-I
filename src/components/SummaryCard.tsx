import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { formatCurrency } from '../utils/format';

interface Props {
  balance: number;
  income: number;
  expense: number;
}

export default function SummaryCard({ balance, income, expense }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.balanceLabel}>Saldo Atual</Text>
      <Text style={[styles.balance, { color: balance >= 0 ? COLORS.white : '#FF8A80' }]}>
        {formatCurrency(balance)}
      </Text>
      <View style={styles.row}>
        <View style={styles.summaryItem}>
          <View style={styles.iconRow}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Feather name="arrow-up-circle" size={16} color="#A5D6A7" />
            </View>
            <Text style={styles.summaryLabel}>Receitas</Text>
          </View>
          <Text style={styles.incomeValue}>{formatCurrency(income)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <View style={styles.iconRow}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Feather name="arrow-down-circle" size={16} color="#FF8A80" />
            </View>
            <Text style={styles.summaryLabel}>Despesas</Text>
          </View>
          <Text style={styles.expenseValue}>{formatCurrency(expense)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  balanceLabel: {
    fontSize: FONTS.small,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: SPACING.xs,
  },
  balance: {
    fontSize: FONTS.xxlarge,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  summaryLabel: {
    fontSize: FONTS.xsmall,
    color: 'rgba(255,255,255,0.7)',
  },
  incomeValue: {
    fontSize: FONTS.large,
    fontWeight: '600',
    color: '#A5D6A7',
    marginLeft: 36,
  },
  expenseValue: {
    fontSize: FONTS.large,
    fontWeight: '600',
    color: '#FF8A80',
    marginLeft: 36,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: SPACING.md,
  },
});
