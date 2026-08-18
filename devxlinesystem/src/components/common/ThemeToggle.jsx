// src/components/common/ThemeToggle.jsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Brightness4, Brightness7, WbSunny, NightsStay } from '@mui/icons-material';

const ThemeToggle = ({ variant = 'icon', className = '', showLabel = false }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  const variants = {
    icon: {
      button: 'p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors',
      icon: 'w-6 h-6',
      container: 'flex items-center'
    },
    full: {
      button: 'flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors w-full',
      icon: 'w-6 h-6',
      container: 'flex items-center justify-between'
    },
    minimal: {
      button: 'p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors',
      icon: 'w-5 h-5',
      container: 'flex items-center'
    },
    sidebar: {
      button: 'flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-700/30 transition-colors w-full',
      icon: 'w-6 h-6',
      container: 'flex items-center'
    }
  };

  const style = variants[variant] || variants.icon;

  return (
    <div className={style.container}>
      <button
        onClick={toggleTheme}
        className={`${style.button} ${className}`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? (
          <>
            <WbSunny className={`${style.icon} text-yellow-400`} />
            {showLabel && (
              <span className="text-sm font-medium text-gray-300">Light Mode</span>
            )}
          </>
        ) : (
          <>
            <NightsStay className={`${style.icon} text-indigo-600 dark:text-indigo-400`} />
            {showLabel && (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
            )}
          </>
        )}
        {variant === 'full' && (
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
            {isDark ? 'Switch to Light' : 'Switch to Dark'}
          </span>
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;