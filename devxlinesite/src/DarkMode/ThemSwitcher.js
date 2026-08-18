import React from 'react';
import { useDarkMode } from '../DarkMode/DarkModeContext';

const ThemeSwitcher = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button onClick={toggleDarkMode} className="theme-toggle-btn">
      {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    </button>
  );
};

export default ThemeSwitcher;
