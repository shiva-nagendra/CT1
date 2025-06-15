
import { Category, TransactionFilter, TransactionStatus, TransactionType } from './types';

export const CATEGORIES: Category[] = [
  'Salary', 
  'Freelance Project', 
  'Client Work', 
  'Side Hustle',
  'Investment',
  'Gifts Received',
  'Rent', 
  'Groceries', 
  'Utilities', 
  'Transportation',
  'Healthcare',
  'Education',
  'Entertainment',
  'Software/Tools',
  'Loan Payment',
  'Taxes',
  'Other'
];

export const TRANSACTION_TYPES: TransactionType[] = ['income', 'expense'];
export const TRANSACTION_STATUSES: TransactionStatus[] = ['paid', 'due'];

export const DEFAULT_FILTER: TransactionFilter = {
  searchTerm: '',
  type: '',
  category: '',
  status: '',
  dateRange: { start: null, end: null },
};

export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';
