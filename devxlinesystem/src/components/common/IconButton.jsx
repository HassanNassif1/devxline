import React from 'react';

const IconButton = ({ 
  children, 
  onClick, 
  className = '', 
  title = '',
  variant = 'default' // 'default', 'danger', 'success', 'warning'
}) => {
  const variants = {
    default: 'hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:text-blue-600 dark:hover:text-blue-400',
    danger: 'hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-500/5 hover:text-red-600 dark:hover:text-red-400',
    success: 'hover:bg-gradient-to-r hover:from-green-500/10 hover:to-green-500/5 hover:text-green-600 dark:hover:text-green-400',
    warning: 'hover:bg-gradient-to-r hover:from-yellow-500/10 hover:to-yellow-500/5 hover:text-yellow-600 dark:hover:text-yellow-400',
  };

  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-lg transition-all duration-300 text-gray-500 dark:text-gray-400 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default IconButton;