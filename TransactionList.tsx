
import React from 'react';
import { Transaction } from '../types';
import { TransactionItem } from './TransactionItem';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onEdit, onDelete }) => {
  if (transactions.length === 0) {
    return <p className="text-center text-slate-400 py-8">No transactions found. Add one to get started!</p>;
  }

  return (
    <div className="mt-6 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg bg-slate-700/50">
            <table className="min-w-full divide-y divide-slate-600">
              <thead className="bg-slate-700">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-200 sm:pl-6">Description</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200">Category</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200 hidden sm:table-cell">Date</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200">Amount</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200 hidden md:table-cell">Status</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-semibold text-slate-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-600 bg-slate-800">
                {transactions.map((transaction) => (
                  <TransactionItem key={transaction.id} transaction={transaction} onEdit={onEdit} onDelete={onDelete} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
