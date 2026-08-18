// src/layouts/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import { useTheme } from '../context/ThemeContext';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const { isDark } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Content Area with Cyberpunk/Tech Background */}
      <div 
        className="flex-1 flex flex-col w-full overflow-hidden relative"
        style={{
          background: isDark 
            ? 'linear-gradient(135deg, #0a0e17 0%, #0d1520 30%, #0a0e17 60%, #0d1520 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 30%, #f8fafc 60%, #f1f5f9 100%)',
        }}
      >
        {/* Cyberpunk Grid Background */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: isDark 
              ? `
                linear-gradient(rgba(0, 229, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 229, 255, 0.03) 1px, transparent 1px)
              `
              : `
                linear-gradient(rgba(0, 229, 255, 0.015) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 229, 255, 0.015) 1px, transparent 1px)
              `,
            backgroundSize: '30px 30px',
          }}
        />

        {/* Ambient Light Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Top Right Cyan Glow */}
          <div 
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(0, 229, 255, 0.12), transparent 70%)'
                : 'radial-gradient(circle, rgba(0, 229, 255, 0.04), transparent 70%)'
            }}
          />
          
          {/* Bottom Left Pink Glow */}
          <div 
            className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(255, 0, 127, 0.10), transparent 70%)'
                : 'radial-gradient(circle, rgba(255, 0, 127, 0.03), transparent 70%)'
            }}
          />
          
          {/* Center Purple Glow */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(179, 0, 255, 0.06), transparent 70%)'
                : 'radial-gradient(circle, rgba(179, 0, 255, 0.02), transparent 70%)'
            }}
          />

          {/* Animated Floating Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 3 + 1 + 'px',
                  height: Math.random() * 3 + 1 + 'px',
                  background: isDark 
                    ? `rgba(0, 229, 255, ${Math.random() * 0.1 + 0.02})`
                    : `rgba(0, 229, 255, ${Math.random() * 0.05 + 0.01})`,
                  top: Math.random() * 100 + '%',
                  left: Math.random() * 100 + '%',
                  animation: `float${i % 5} ${15 + Math.random() * 25}s infinite linear`,
                  animationDelay: `${Math.random() * 10}s`,
                }}
              />
            ))}
          </div>

          {/* Diagonal Scan Line Effect */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isDark 
                ? 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0, 229, 255, 0.005) 3px, rgba(0, 229, 255, 0.005) 4px)'
                : 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0, 229, 255, 0.002) 3px, rgba(0, 229, 255, 0.002) 4px)',
            }}
          />
        </div>

        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 w-full relative z-10">
          <div className="w-full max-w-full">
            <Outlet />
          </div>
        </main>

        {/* Subtle Footer Glow Line */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background: isDark 
              ? 'linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.1), rgba(255, 0, 127, 0.1), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.05), rgba(255, 0, 127, 0.05), transparent)',
          }}
        />

        {/* Bottom Status Bar */}
        <div className={`relative z-10 px-6 py-1.5 border-t ${
          isDark ? 'border-white/5' : 'border-gray-200/30'
        }`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className={`text-[10px] font-mono ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}>
                <span className={isDark ? 'text-green-400' : 'text-green-600'}>●</span> SYSTEM ONLINE
              </span>
              <span className={`text-[10px] font-mono ${
                isDark ? 'text-gray-600' : 'text-gray-300'
              }`}>
                v2.0.1
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`text-[10px] font-mono ${
                isDark ? 'text-gray-600' : 'text-gray-300'
              }`}>
                {new Date().toLocaleTimeString()}
              </span>
              <span className={`text-[10px] font-mono ${
                isDark ? 'text-gray-600' : 'text-gray-300'
              }`}>
                <span className={isDark ? 'text-blue-400' : 'text-blue-500'}>✦</span> SECURE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float0 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(30px, -20px) rotate(90deg); }
          50% { transform: translate(-20px, 30px) rotate(180deg); }
          75% { transform: translate(40px, 10px) rotate(270deg); }
        }
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-30px, 20px) rotate(120deg); }
          66% { transform: translate(20px, -30px) rotate(240deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.5); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-20px, -30px) rotate(180deg); }
        }
        @keyframes float4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, 20px) scale(1.3); }
          50% { transform: translate(-10px, -20px) scale(0.8); }
          75% { transform: translate(20px, -10px) scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;