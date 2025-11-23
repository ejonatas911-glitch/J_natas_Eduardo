import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>}
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-600 transition-colors">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg 
            focus:ring-2 focus:ring-brand-500 focus:border-brand-500 block p-2.5 
            ${icon ? 'pl-10' : ''} 
            ${error ? 'border-red-500 focus:ring-red-500' : 'hover:border-brand-300'}
            transition-all duration-200 shadow-sm
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>}
      <textarea
        className={`
          w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg 
          focus:ring-2 focus:ring-brand-500 focus:border-brand-500 block p-2.5 
          ${error ? 'border-red-500' : 'hover:border-brand-300'}
          transition-all duration-200 shadow-sm
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};