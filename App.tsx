
import React, { useState, useMemo, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { TransactionForm } from './components/TransactionForm.tsx';
import { TransactionList } from './components/TransactionList.tsx';
import { SummaryWidget } from './components/SummaryWidget.tsx';
import { FilterControls } from './components/FilterControls.tsx';
import { PlusIcon } from './components/icons/PlusIcon.tsx';
import { useTransactions } from './hooks/useTransactions';
import { Transaction, TransactionFilter, TransactionSort } from './types';
import { DEFAULT_FILTER, CATEGORIES, TRANSACTION_STATUSES, TRANSACTION_TYPES } from './constants';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    parseTransactionText,
    exportToCSV,
    exportToPDF, // Added new export function
    isLoadingNLP,
  } = useTransactions();

  const [filters, setFilters] = useState<TransactionFilter>(DEFAULT_FILTER);
  const [sort, setSort] = useState<TransactionSort>({ field: 'date', order: 'desc' });

  const openModal = (transaction?: Transaction) => {
    setEditingTransaction(transaction || null);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleSaveTransaction = (transaction: Transaction) => {
    if (editingTransaction) {
      updateTransaction(transaction);
    } else {
      addTransaction(transaction);
    }
    closeModal();
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter(t => {
      if (filters.type && t.type !== filters.type) return false;
      if (filters.category && t.category !== filters.category) return false;
      if (filters.status && t.status !== filters.status) return false;
      if (filters.searchTerm) {
        const searchTermLower = filters.searchTerm.toLowerCase();
        if (
          !t.description.toLowerCase().includes(searchTermLower) &&
          !(t.counterparty && t.counterparty.toLowerCase().includes(searchTermLower)) &&
          !t.amount.toString().includes(searchTermLower)
        ) return false;
      }
      if (filters.dateRange.start && new Date(t.date) < new Date(filters.dateRange.start)) return false;
      if (filters.dateRange.end && new Date(t.date) > new Date(filters.dateRange.end)) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      const fieldA = a[sort.field];
      const fieldB = b[sort.field];
      let comparison = 0;
      if (fieldA > fieldB) {
        comparison = 1;
      } else if (fieldA < fieldB) {
        comparison = -1;
      }
      return sort.order === 'asc' ? comparison : -comparison;
    });
  }, [transactions, filters, sort]);

  const handleExportCSV = useCallback(() => {
    exportToCSV(filteredAndSortedTransactions);
  }, [exportToCSV, filteredAndSortedTransactions]);

  const handleExportPDF = useCallback(() => {
    exportToPDF(filteredAndSortedTransactions);
  }, [exportToPDF, filteredAndSortedTransactions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-gray-100 flex flex-col items-center p-4 selection:bg-sky-500 selection:text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Header />
      <main className="w-full max-w-4xl mx-auto space-y-6 mt-6">
        <SummaryWidget transactions={filteredAndSortedTransactions} />
        
        <div className="bg-slate-800 shadow-xl rounded-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-sky-400">Transactions</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => openModal()}
                className="flex items-center bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Entry
              </button>
              <button
                onClick={handleExportCSV}
                disabled={filteredAndSortedTransactions.length === 0}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export CSV
              </button>
              <button
                onClick={handleExportPDF}
                disabled={filteredAndSortedTransactions.length === 0}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export PDF
              </button>
            </div>
          </div>
          
          <FilterControls 
            filters={filters} 
            setFilters={setFilters} 
            sort={sort}
            setSort={setSort}
            categories={CATEGORIES} 
            statuses={TRANSACTION_STATUSES}
            types={TRANSACTION_TYPES}
          />

          {isModalOpen && (
            <TransactionForm
              isOpen={isModalOpen}
              onClose={closeModal}
              onSave={handleSaveTransaction}
              existingTransaction={editingTransaction}
              parseTransactionText={parseTransactionText}
              isLoadingNLP={isLoadingNLP}
            />
          )}

          <TransactionList
            transactions={filteredAndSortedTransactions}
            onEdit={openModal}
            onDelete={deleteTransaction}
          />
        </div>
      </main>
      <footer className="text-center py-8 text-slate-500 text-sm">
        CashTally &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;