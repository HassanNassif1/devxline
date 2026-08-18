import React from 'react';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';

const ClientFilters = ({ onFilterChange, filters, onBusinessTypeSelect }) => {
  const { isDark } = useTheme();

  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };

  const handleStatusChange = (e) => {
    onFilterChange({ status: e.target.value });
  };

  const handleBusinessTypeChange = (e) => {
    const value = e.target.value;
    onFilterChange({ businessType: value });
    if (onBusinessTypeSelect) {
      onBusinessTypeSelect(value);
    }
  };

  const handleClearFilters = () => {
    onFilterChange({ search: '', status: '', businessType: '' });
    if (onBusinessTypeSelect) {
      onBusinessTypeSelect('');
    }
  };

  const hasActiveFilters = filters.search || filters.status || filters.businessType;

  const businessTypes = ['Restaurant', 'Medical', 'E-commerce', 'Retail', 'Education', 'Others'];
  const statusOptions = ['Active', 'Pending', 'Cancelled', 'Suspended'];

  return (
    <div className={`rounded-xl p-4 border transition-theme ${
      isDark ? 'bg-[#141c2b] border-[#1e2d45]' : 'bg-white border-gray-200 shadow-card'
    }`}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <SearchIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="Search clients by name, email, or business..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              isDark 
                ? 'bg-[#1a2438] border-[#1e2d45] text-white placeholder-gray-500' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>

        <select
          value={filters.status || ''}
          onChange={handleStatusChange}
          className={`px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
            isDark 
              ? 'bg-[#1a2438] border-[#1e2d45] text-white' 
              : 'bg-white border-gray-300 text-gray-700'
          }`}
        >
          <option value="">All Status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <select
          value={filters.businessType || ''}
          onChange={handleBusinessTypeChange}
          className={`px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
            isDark 
              ? 'bg-[#1a2438] border-[#1e2d45] text-white' 
              : 'bg-white border-gray-300 text-gray-700'
          }`}
        >
          <option value="">All Business Types</option>
          {businessTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className={`flex items-center space-x-1 px-4 py-2.5 rounded-lg transition whitespace-nowrap ${
              isDark 
                ? 'text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
            }`}
          >
            <ClearIcon className="w-4 h-4" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-[#1e2d45]">
          {filters.search && (
            <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs ${
              isDark ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400' : 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700'
            }`}>
              <span>Search: {filters.search}</span>
            </span>
          )}
          {filters.status && (
            <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs ${
              isDark ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400' : 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700'
            }`}>
              <span>Status: {filters.status}</span>
            </span>
          )}
          {filters.businessType && (
            <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs ${
              isDark ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400' : 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700'
            }`}>
              <span>Type: {filters.businessType}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientFilters;