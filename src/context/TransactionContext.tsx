import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, TransactionType, MonthSummary } from '../types';
import { loadTransactions, saveTransactions } from '../utils/storage';
import { getMonthKey } from '../utils/format';

interface TransactionContextType {
  transactions: Transaction[];
  isLoading: boolean;
  addTransaction: (data: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getMonthSummary: (monthKey?: string) => MonthSummary;
  getTransactionsByMonth: (monthKey?: string) => Transaction[];
  getExpensesByCategory: (monthKey?: string) => { category: string; total: number }[];
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTransactions().then(data => {
      setTransactions(data);
      setIsLoading(false);
    });
  }, []);

  const addTransaction = useCallback(async (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newTransaction, ...transactions];
    setTransactions(updated);
    await saveTransactions(updated);
  }, [transactions]);

  const deleteTransaction = useCallback(async (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    await saveTransactions(updated);
  }, [transactions]);

  const getCurrentMonthKey = () => getMonthKey(new Date().toISOString());

  const getTransactionsByMonth = useCallback((monthKey?: string) => {
    const key = monthKey || getCurrentMonthKey();
    return transactions
      .filter(t => getMonthKey(t.date) === key)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  const getMonthSummary = useCallback((monthKey?: string): MonthSummary => {
    const monthTransactions = getTransactionsByMonth(monthKey);
    const totalIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }, [getTransactionsByMonth]);

  const getExpensesByCategory = useCallback((monthKey?: string) => {
    const monthTransactions = getTransactionsByMonth(monthKey);
    const expenses = monthTransactions.filter(t => t.type === 'expense');
    const categoryMap = new Map<string, number>();
    expenses.forEach(t => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });
    return Array.from(categoryMap.entries())
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
  }, [getTransactionsByMonth]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        isLoading,
        addTransaction,
        deleteTransaction,
        getMonthSummary,
        getTransactionsByMonth,
        getExpensesByCategory,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions(): TransactionContextType {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within TransactionProvider');
  }
  return context;
}
