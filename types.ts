
export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'paid' | 'due';
export type Category = 
  | 'Salary' 
  | 'Freelance Project' 
  | 'Client Work' 
  | 'Side Hustle'
  | 'Investment'
  | 'Gifts Received'
  | 'Rent' 
  | 'Groceries' 
  | 'Utilities' 
  | 'Transportation'
  | 'Healthcare'
  | 'Education'
  | 'Entertainment'
  | 'Software/Tools'
  | 'Loan Payment'
  | 'Taxes'
  | 'Other';

export interface Transaction {
  id: string;
  date: string; // ISO string
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  status: TransactionStatus;
  counterparty?: string;
  dueDate?: string; // ISO string, optional
}

export interface ParsedTransactionData {
  description: string;
  amount: number;
  type: TransactionType;
  category_suggestion: Category;
  counterparty: string | null;
}

export interface TransactionFilter {
  searchTerm: string;
  type: TransactionType | '';
  category: Category | '';
  status: TransactionStatus | '';
  dateRange: {
    start: string | null;
    end: string | null;
  };
}

export interface TransactionSort {
  field: keyof Transaction;
  order: 'asc' | 'desc';
}

export interface SummaryData {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  totalDueToUser: number; // Income marked as 'due'
  totalUserOwes: number;   // Expenses marked as 'due'
}
