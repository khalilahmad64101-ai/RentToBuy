import React from 'react';

export function Loader({ size = 'md', className = '', label = 'Loading vehicle datasets...' }) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 p-8 ${className}`}>
      <div className={`animate-spin rounded-full border-t-indigo-600 border-gray-200 ${sizes[size]}`}></div>
      {label && <p className="text-sm font-sans text-gray-500 font-medium animate-pulse">{label}</p>}
    </div>
  );
}
