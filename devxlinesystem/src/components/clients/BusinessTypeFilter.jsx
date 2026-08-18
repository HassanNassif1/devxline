import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const BusinessTypeFilter = ({ selectedType, onTypeSelect }) => {
  const { isDark } = useTheme();

  const businessTypes = [
    { value: '', label: 'All Types', icon: '📊' },
    { value: 'Restaurant', label: 'Restaurant', icon: '🍽️' },
    { value: 'Medical', label: 'Medical', icon: '🏥' },
    { value: 'E-commerce', label: 'E-commerce', icon: '🛒' },
    { value: 'Retail', label: 'Retail', icon: '🏬' },
    { value: 'Education', label: 'Education', icon: '📚' },
    { value: 'Others', label: 'Others', icon: '📌' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {businessTypes.map((type) => (
        <button
          key={type.value}
          onClick={() => onTypeSelect(type.value)}
          className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
            selectedType === type.value
              ? isDark
                ? 'bg-blue-500/30 text-blue-400 border border-blue-400/50 shadow-lg shadow-blue-500/10'
                : 'bg-blue-50 text-blue-700 border border-blue-200 shadow-md shadow-blue-100'
              : isDark
                ? 'bg-[#1a2438] text-gray-400 hover:bg-[#1e2d45] hover:text-white border border-transparent hover:border-gray-600'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-transparent hover:border-gray-300'
          }`}
        >
          <span>{type.icon}</span>
          <span>{type.label}</span>
          {selectedType === type.value && (
            <span className="ml-1 text-xs">✓</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default BusinessTypeFilter;