
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-4xl mx-auto py-6 text-center">
      <h1 className="text-5xl font-bold text-sky-400" style={{ fontFamily: "'Poppins', sans-serif" }}>
        CashTally
      </h1>
      <p className="text-slate-400 mt-2 text-lg">Smartly track your income and expenses.</p>
    </header>
  );
};
