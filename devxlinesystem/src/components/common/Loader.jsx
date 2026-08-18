import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Loader = ({ fullScreen = false }) => {
  const { isDark } = useTheme();

  const containerClasses = fullScreen 
    ? 'fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0814]/90 backdrop-blur-md' 
    : 'flex items-center justify-center w-full h-full py-20';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-6">
        {/* Outer Ring - Purple Gradient */}
        <div className="relative w-20 h-20">
          <div className={`absolute inset-0 rounded-full border-4 border-t-transparent border-r-transparent ${
            isDark 
              ? 'border-purple-400/30 border-b-purple-400' 
              : 'border-purple-300/30 border-b-purple-500'
          } animate-spin`}></div>
          
          {/* Inner Reverse Ring - Pure Purple Spectrum */}
          <div className={`absolute inset-2 rounded-full border-4 border-b-transparent border-l-transparent ${
            isDark 
              ? 'border-purple-600/30 border-t-purple-600' 
              : 'border-purple-400/30 border-t-purple-600'
          } animate-spin-reverse`}></div>

          {/* Center Core Pulse - Purple Glow */}
          <div className={`absolute inset-4 rounded-full blur-md ${
            isDark ? 'bg-purple-500/20' : 'bg-purple-400/20'
          } animate-pulse`}></div>
        </div>
        
        <div className={`text-xs font-mono tracking-widest ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
          LOADING SYSTEM...
        </div>
      </div>

      {/* Required CSS for this loader to work globally */}
      <style>{`
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-reverse {
          animation: spin-reverse 1.2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;