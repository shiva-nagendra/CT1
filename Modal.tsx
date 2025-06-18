
import React, { ReactNode } from 'react';
import { XMarkIcon } from './icons/XMarkIcon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow p-0"
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#4A5568 #2D3748' }} // Custom scrollbar for Firefox
        // For Webkit browsers, if more specific scrollbar styling is needed and Tailwind doesn't suffice,
        // one might need to use a utility class that applies ::-webkit-scrollbar styles defined in index.html,
        // or accept default browser scrollbars. The current inline style is for Firefox.
      >
        <div className="sticky top-0 bg-slate-800 z-10 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
          <h2 id="modal-title" className="text-xl font-semibold text-sky-400">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
      {/* The <style jsx global> block has been removed from here. 
          Animation keyframes are expected to be in index.html or a global stylesheet.
          The 'animate-modalShow' class will use keyframes defined in index.html:
          @keyframes modalShow {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-modalShow { animation: modalShow 0.3s forwards; }
      */}
    </div>
  );
};
