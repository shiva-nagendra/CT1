
import React, { useState, useEffect, useCallback } from 'react';
import { Transaction, Category, TransactionType, TransactionStatus, ParsedTransactionData } from '../types';
import { CATEGORIES, TRANSACTION_STATUSES, TRANSACTION_TYPES } from '../constants';
import { Modal } from './Modal';
import { SparklesIcon } from './icons/SparklesIcon';
import { ArrowPathIcon } from './icons/ArrowPathIcon';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
  existingTransaction?: Transaction | null;
  parseTransactionText: (text: string) => Promise<ParsedTransactionData | null>;
  isLoadingNLP: boolean;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  isOpen,
  onClose,
  onSave,
  existingTransaction,
  parseTransactionText,
  isLoadingNLP
}) => {
  const [nlpInput, setNlpInput] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<Category>('Other');
  const [status, setStatus] = useState<TransactionStatus>('paid');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [counterparty, setCounterparty] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    if (existingTransaction) {
      setDescription(existingTransaction.description);
      setAmount(existingTransaction.amount);
      setType(existingTransaction.type);
      setCategory(existingTransaction.category);
      setStatus(existingTransaction.status);
      setDate(new Date(existingTransaction.date).toISOString().split('T')[0]);
      setCounterparty(existingTransaction.counterparty || '');
      setDueDate(existingTransaction.dueDate ? new Date(existingTransaction.dueDate).toISOString().split('T')[0] : '');
      setNlpInput(''); // Clear NLP input when editing
    } else {
      resetForm();
    }
  }, [existingTransaction, isOpen]);

  const resetForm = () => {
    setNlpInput('');
    setDescription('');
    setAmount('');
    setType('expense');
    setCategory('Other');
    setStatus('paid');
    setDate(new Date().toISOString().split('T')[0]);
    setCounterparty('');
    setDueDate('');
    setParseError(null);
  };

  const handleNlpParse = useCallback(async () => {
    if (!nlpInput.trim()) return;
    setParseError(null);
    try {
      const parsedData = await parseTransactionText(nlpInput);
      if (parsedData) {
        setDescription(parsedData.description);
        setAmount(parsedData.amount);
        setType(parsedData.type);
        setCategory(CATEGORIES.includes(parsedData.category_suggestion) ? parsedData.category_suggestion : 'Other');
        if (parsedData.counterparty) {
          setCounterparty(parsedData.counterparty);
        }
      } else {
        setParseError('Could not parse text. Please enter manually or try rephrasing.');
      }
    } catch (error) {
      console.error("NLP parsing error:", error);
      setParseError('Error parsing text. Please enter manually.');
    }
  }, [nlpInput, parseTransactionText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount === '' || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    const transactionData: Transaction = {
      id: existingTransaction?.id || crypto.randomUUID(),
      date: new Date(date).toISOString(),
      description,
      amount: Number(amount),
      type,
      category,
      status,
      counterparty: counterparty.trim() || undefined,
      dueDate: status === 'due' && dueDate ? new Date(dueDate).toISOString() : undefined,
    };
    onSave(transactionData);
    resetForm();
  };
  
  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6 p-1">
      <div>
        <label htmlFor="nlpInput" className="block text-sm font-medium text-slate-300 mb-1">
          Smart Entry (e.g., "Received ₹1000 from John for design work")
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            id="nlpInput"
            value={nlpInput}
            onChange={(e) => setNlpInput(e.target.value)}
            placeholder="Describe transaction..."
            className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100 placeholder-slate-400"
          />
          <button
            type="button"
            onClick={handleNlpParse}
            disabled={isLoadingNLP || !nlpInput.trim()}
            className="p-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 disabled:opacity-50 flex items-center justify-center h-[38px] w-[38px] mt-1"
            title="Parse with AI"
          >
            {isLoadingNLP ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <SparklesIcon className="w-5 h-5" />}
          </button>
        </div>
        {parseError && <p className="mt-1 text-xs text-red-400">{parseError}</p>}
        {isLoadingNLP && <p className="mt-1 text-xs text-sky-400">Parsing with AI, please wait...</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100"
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-slate-300">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || '')}
            required
            min="0.01"
            step="0.01"
            className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-slate-300">Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as TransactionType)}
            className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100"
          >
            {TRANSACTION_TYPES.map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-300">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100"
          >
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-slate-300">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TransactionStatus)}
            className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100"
          >
            {TRANSACTION_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-slate-300">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="counterparty" className="block text-sm font-medium text-slate-300">Client/Vendor (Optional)</label>
          <input
            type="text"
            id="counterparty"
            value={counterparty}
            onChange={(e) => setCounterparty(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100"
          />
        </div>
        {status === 'due' && (
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-slate-300">Due Date (Optional)</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100"
            />
          </div>
        )}
      </div>

      <div className="pt-5 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-600 hover:bg-slate-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500"
        >
          {existingTransaction ? 'Save Changes' : 'Add Transaction'}
        </button>
      </div>
    </form>
  );
  
  return (
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title={existingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
      >
        {formContent}
      </Modal>
  );
};
