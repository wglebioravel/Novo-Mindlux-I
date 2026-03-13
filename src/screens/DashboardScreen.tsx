import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { useTransactions } from '../context/TransactionContext';
import SummaryCard from '../components/SummaryCard';
import TransactionItem from '../components/TransactionItem';
import { getCategoryInfo } from '../constants/categories';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { getMonthKey, getMonthYear } from '../utils/format';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
  const {
    isLoading,
    getMonthSummary,
    getTransactionsByMonth,
    getExpensesByCategory,
    deleteTransaction,
  } = useTransactions();

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

  const summary = getMonthSummary(currentMonthKey);
  const recentTransactions = getTransactionsByMonth(currentMonthKey).slice(0, 5);
  const expensesByCategory = getExpensesByCategory(currentMonthKey);

  const pieData = useMemo(() => {
    if (expensesByCategory.length === 0) return [];
    return expensesByCategory.map(item => {
      const info = getCategoryInfo(item.category);
      return {
        name: info.label,
        amount: item.total,
        color: info.color,
        legendFontColor: COLORS.textSecondary,
        legendFontSize: 12,
      };
    });
  }, [expensesByCategory]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Controle Financeiro</Text>
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

      <SummaryCard
        balance={summary.balance}
        income={summary.totalIncome}
        expense={summary.totalExpense}
      />

      {pieData.length > 0 && (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Despesas por Categoria</Text>
          <View style={styles.chartCard}>
            <PieChart
              data={pieData}
              width={screenWidth - 64}
              height={200}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="0"
              absolute={false}
            />
          </View>
        </View>
      )}

      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Transacoes Recentes</Text>
        {recentTransactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={48} color={COLORS.textLight} />
            <Text style={styles.emptyText}>Nenhuma transacao neste mes</Text>
            <Text style={styles.emptySubtext}>
              Toque em + para adicionar sua primeira transacao
            </Text>
          </View>
        ) : (
          recentTransactions.map(transaction => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onDelete={deleteTransaction}
            />
          ))
        )}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl + 20,
    paddingBottom: SPACING.sm,
  },
  greeting: {
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
  chartSection: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  chartCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  recentSection: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
  },
  emptyText: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  emptySubtext: {
    fontSize: FONTS.small,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});
