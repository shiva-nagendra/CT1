
import React, { useMemo } from 'react';
import { Transaction, SummaryData } from '../types';

interface SummaryWidgetProps {
  transactions: Transaction[];
}

const calculateSummary = (transactions: Transaction[]): SummaryData => {
  return transactions.reduce<SummaryData>(
    (acc, t) => {
      if (t.type === 'income') {
        acc.totalIncome += t.amount;
        if (t.status === 'due') {
          acc.totalDueToUser += t.amount;
        }
      } else {
        acc.totalExpenses += t.amount;
        if (t.status === 'due') {
          acc.totalUserOwes += t.amount;
        }
      }
      acc.netBalance = acc.totalIncome - acc.totalExpenses;
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0, netBalance: 0, totalDueToUser: 0, totalUserOwes: 0 }
  );
};

export const SummaryWidget: React.FC<SummaryWidgetProps> = ({ transactions }) => {
  const summary = useMemo(() => calculateSummary(transactions), [transactions]);

  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;

  return (
    <div className="bg-slate-800 shadow-xl rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-sky-400 mb-6 text-center sm:text-left">Financial Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard title="Total Income" value={formatCurrency(summary.totalIncome)} color="text-green-400" />
        <SummaryCard title="Total Expenses" value={formatCurrency(summary.totalExpenses)} color="text-red-400" />
        <SummaryCard title="Net Balance" value={formatCurrency(summary.netBalance)} color={summary.netBalance >= 0 ? "text-sky-400" : "text-red-400"} />
        <SummaryCard title="Income Due to You" value={formatCurrency(summary.totalDueToUser)} color="text-yellow-400" />
        <SummaryCard title="Expenses You Owe" value={formatCurrency(summary.totalUserOwes)} color="text-orange-400" />
      </div>
    </div>
  );
};

interface SummaryCardProps {
  title: string;
  value: string;
  color: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, color }) => (
  <div className="bg-slate-700/50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">{title}</h3>
    <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
  </div>
);
