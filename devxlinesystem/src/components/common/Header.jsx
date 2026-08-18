import React, { useState, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../common/ThemeToggle';
import Loader from '../common/Loader'; 

import logoLight from '../../assets/images/CoDevelop.jpg';
import logoDark from '../../assets/images/CoDevelopDark.jpg';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); 
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = () => {
    const firstName = user?.firstName || 'A';
    const lastName = user?.lastName || 'D';
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const handleLogout = async () => {
    // 1. Close dropdown
    setIsDropdownOpen(false);
    
    // 2. Force the loader state update to commit immediately using flushSync
    flushSync(() => {
      setIsLoggingOut(true);
    });

    try {
      // 3. Execute the logout routine
      await logout();

      // 4. Brief delay to keep the loader visible for a polished user experience
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // 5. Hide loader and navigate to login
      setIsLoggingOut(false);
      navigate('/login');
    }
  };

  const logoToRender = isDark ? logoDark : logoLight;

  return (
    <>
      {/* Global Logout Loader - Renders ONLY when isLoggingOut is true */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0814]/90 backdrop-blur-xl animate-fade-in">
          <Loader fullScreen={true} />
        </div>
      )}

      <header className="bg-white dark:bg-[#0a0e17] border-b border-gray-200 dark:border-[#1e2d45] px-6 py-5 flex items-center justify-between w-full transition-theme">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="icon-btn lg:hidden"
          >
            <MenuIcon className="w-6 h-6 dark:text-gray-400" />
          </button>
          
          <div className="lg:hidden">
            <img 
              src={logoToRender} 
              alt="Co Develop" 
              className="h-10 w-auto object-contain transition-all duration-300"
            />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white hidden sm:block transition-colors duration-300">
            Welcome back, {user?.firstName || 'Admin'}!
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:block">
            <ThemeToggle variant="icon" />
          </div>

          <button className="icon-btn relative">
            <NotificationsIcon className="text-gray-600 dark:text-gray-400 w-6 h-6 transition-colors duration-300" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></span>
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="relative group">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 text-white flex items-center justify-center text-lg font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
                  {getInitials()}
                </div>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-[#0a0e17] rounded-full"></div>
              </div>
              
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors duration-300">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1 transition-colors duration-300">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block"></span>
                  <span>{user?.role || 'Admin'}</span>
                </p>
              </div>
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-[#141c2b] rounded-xl shadow-2xl border border-gray-200 dark:border-[#1e2d45] overflow-hidden animate-fade-in z-50">
                <div className="p-4 border-b border-gray-200 dark:border-[#1e2d45]">
                  <div className="flex items-center space-x-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 text-white flex items-center justify-center text-xl font-medium shadow-lg shadow-blue-500/30">
                      {getInitials()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        {user?.email || 'admin@codevelop.com'}
                      </p>
                      <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-400/20">
                        {user?.role || 'Super Admin'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button 
                    onClick={() => { navigate('/profile'); setIsDropdownOpen(false); }}
                    className="flex items-center space-x-3 w-full px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                  >
                    <AccountCircleIcon className="w-5 h-5" />
                    <span className="text-sm">My Profile</span>
                  </button>
                  
                  <button 
                    onClick={() => { navigate('/settings'); setIsDropdownOpen(false); }}
                    className="flex items-center space-x-3 w-full px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                  >
                    <SettingsIcon className="w-5 h-5" />
                    <span className="text-sm">Settings</span>
                  </button>
                  
                  <button 
                    onClick={() => { setIsDropdownOpen(false); }}
                    className="flex items-center space-x-3 w-full px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                  >
                    <HelpIcon className="w-5 h-5" />
                    <span className="text-sm">Help & Support</span>
                  </button>
                </div>

                {/* LOGOUT BUTTON */}
                <div className="p-2 border-t border-gray-200 dark:border-[#1e2d45]">
                  <button 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center justify-center space-x-3 w-full px-4 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 disabled:opacity-70"
                  >
                    <LogoutIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;