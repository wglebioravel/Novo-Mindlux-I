import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Transaction } from '../types';
import { getCategoryInfo } from '../constants/categories';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { formatCurrency, formatDate } from '../utils/format';

interface Props {
  transaction: Transaction;
  onDelete?: (id: string) => void;
}

export default function TransactionItem({ transaction, onDelete }: Props) {
  const category = getCategoryInfo(transaction.category);
  const isIncome = transaction.type === 'income';

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
        <Feather name={category.icon as keyof typeof Feather.glyphMap} size={20} color={category.color} />
      </View>
      <View style={styles.info}>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.description}
        </Text>
        <Text style={styles.category}>
          {category.label} &middot; {formatDate(transaction.date)}
        </Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: isIncome ? COLORS.income : COLORS.expense }]}>
          {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
        </Text>
        {onDelete && (
          <TouchableOpacity
            onPress={() => onDelete(transaction.id)}
            style={styles.deleteBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="trash-2" size={14} color={COLORS.textLight} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  info: {
    flex: 1,
  },
  description: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  category: {
    fontSize: FONTS.xsmall,
    color: COLORS.textSecondary,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: FONTS.regular,
    fontWeight: '700',
  },
  deleteBtn: {
    marginTop: SPACING.xs,
    padding: SPACING.xs,
  },
});
