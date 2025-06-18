
import React from 'react';
import { Transaction, TransactionFilter, TransactionSort, Category, TransactionType, TransactionStatus } from '../types';

interface FilterControlsProps {
  filters: TransactionFilter;
  setFilters: React.Dispatch<React.SetStateAction<TransactionFilter>>;
  sort: TransactionSort;
  setSort: React.Dispatch<React.SetStateAction<TransactionSort>>;
  categories: Category[];
  types: TransactionType[];
  statuses: TransactionStatus[];
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  setFilters,
  sort,
  setSort,
  categories,
  types,
  statuses
}) => {
  const handleInputChange = <K extends keyof TransactionFilter>(
    field: K,
    value: TransactionFilter[K]
  ) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string | null) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { ...prev.dateRange, [field]: value },
    }));
  };

  const handleSortChange = (newField: keyof Transaction, newOrder?: 'asc' | 'desc') => {
    setSort((prevSort: TransactionSort): TransactionSort => {
      if (prevSort.field === newField && !newOrder) { // Toggle order if same field clicked
        return { field: newField, order: prevSort.order === 'asc' ? 'desc' : 'asc' };
      }
      return { field: newField, order: newOrder || 'asc' };
    });
  };
  
  const commonInputClass = "mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100 placeholder-slate-400";
  const commonLabelClass = "block text-sm font-medium text-slate-300";

  const sortableFields: Array<keyof Transaction> = ['date', 'description', 'amount', 'category'];


  return (
    <div className="my-6 p-4 bg-slate-700/50 rounded-lg space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label htmlFor="searchTerm" className={commonLabelClass}>Search</label>
          <input
            type="text"
            id="searchTerm"
            placeholder="Description, counterparty, amount..."
            value={filters.searchTerm}
            onChange={e => handleInputChange('searchTerm', e.target.value)}
            className={commonInputClass}
          />
        </div>
        <div>
          <label htmlFor="filterType" className={commonLabelClass}>Type</label>
          <select
            id="filterType"
            value={filters.type}
            onChange={e => handleInputChange('type', e.target.value as TransactionType | '')}
            className={commonInputClass}
          >
            <option value="">All Types</option>
            {types.map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="filterCategory" className={commonLabelClass}>Category</label>
          <select
            id="filterCategory"
            value={filters.category}
            onChange={e => handleInputChange('category', e.target.value as Category | '')}
            className={commonInputClass}
          >
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="filterStatus" className={commonLabelClass}>Status</label>
          <select
            id="filterStatus"
            value={filters.status}
            onChange={e => handleInputChange('status', e.target.value as TransactionStatus | '')}
            className={commonInputClass}
          >
            <option value="">All Statuses</option>
            {statuses.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="dateStart" className={commonLabelClass}>Date From</label>
          <input
            type="date"
            id="dateStart"
            value={filters.dateRange.start || ''}
            onChange={e => handleDateRangeChange('start', e.target.value || null)}
            className={commonInputClass}
          />
        </div>
        <div>
          <label htmlFor="dateEnd" className={commonLabelClass}>Date To</label>
          <input
            type="date"
            id="dateEnd"
            value={filters.dateRange.end || ''}
            onChange={e => handleDateRangeChange('end', e.target.value || null)}
            className={commonInputClass}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <span className={`${commonLabelClass} mr-2`}>Sort by:</span>
        {sortableFields.map(field => (
          <button
            key={field as string}
            onClick={() => handleSortChange(field)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              sort.field === field 
                ? 'bg-sky-500 text-white' 
                : 'bg-slate-600 hover:bg-slate-500 text-slate-200'
            }`}
          >
            { (field as string).charAt(0).toUpperCase() + (field as string).slice(1) } 
            {sort.field === field && (sort.order === 'asc' ? ' ▲' : ' ▼')}
          </button>
        ))}
      </div>
    </div>
  );
};
