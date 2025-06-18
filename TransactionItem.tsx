
import React from 'react';
import { Transaction } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onEdit, onDelete }) => {
  const amountColor = transaction.type === 'income' ? 'text-green-400' : 'text-red-400';
  const formattedDate = new Date(transaction.date).toLocaleDateString('en-CA'); // YYYY-MM-DD for consistency

  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
        <div className="font-medium text-slate-100">{transaction.description}</div>
        {transaction.counterparty && <div className="text-slate-400 text-xs">{transaction.counterparty}</div>}
        <div className="text-slate-400 text-xs md:hidden">
          {formattedDate} - <span className={`capitalize ${transaction.status === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>{transaction.status}</span>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">{transaction.category}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300 hidden sm:table-cell">{formattedDate}</td>
      <td className={`whitespace-nowrap px-3 py-4 text-sm font-semibold ${amountColor}`}>
        {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300 hidden md:table-cell">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          transaction.status === 'paid' ? 'bg-green-700 text-green-100' : 'bg-yellow-700 text-yellow-100'
        } capitalize`}>
          {transaction.status}
        </span>
        {transaction.status === 'due' && transaction.dueDate && (
          <div className="text-xs text-slate-400 mt-1">Due: {new Date(transaction.dueDate).toLocaleDateString('en-CA')}</div>
        )}
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <button onClick={() => onEdit(transaction)} className="text-sky-400 hover:text-sky-300 mr-3" title="Edit">
          <PencilIcon className="w-5 h-5" />
        </button>
        <button onClick={() => onDelete(transaction.id)} className="text-red-400 hover:text-red-300" title="Delete">
          <TrashIcon className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
};
