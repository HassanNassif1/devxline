// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthAPI from '../api/auth';
import apiClient from '../api/config';
import storage from '../utils/storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  const clearAuth = () => {
    storage.clear();
    delete apiClient.defaults.headers.Authorization;
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = storage.getToken();
        const storedUser = storage.getUser();
        
        console.log('🔍 Checking authentication...');
        console.log('Token found:', !!token);
        console.log('Stored user found:', !!storedUser);
        
        if (token && storedUser) {
          apiClient.defaults.headers.Authorization = `Bearer ${token}`;
          setUser(storedUser);
          setIsAuthenticated(true);
          console.log('✅ User authenticated from storage:', storedUser.firstName || storedUser.email);
          
          // Optional: Verify token with server
          try {
            const response = await AuthAPI.getCurrentUser();
            if (response?.data?.data?.user) {
              const userData = response.data.data.user;
              setUser(userData);
              storage.setUser(userData, rememberMe);
              console.log('✅ User data refreshed from server');
            }
          } catch (error) {
            console.warn('⚠️ Could not verify token with server, using stored data');
          }
        } else {
          console.log('ℹ️ No auth data found');
          clearAuth();
        }
      } catch (error) {
        console.error('❌ Auth check error:', error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password, remember = false) => {
    try {
      console.log('🔐 Attempting login for:', email);
      
      const response = await AuthAPI.login({ email, password });
      
      if (!response?.data) {
        return { 
          success: false, 
          error: 'No response from server. Please try again.' 
        };
      }

      const responseData = response.data;
      console.log('📊 Response data:', responseData);

      if (responseData.success !== true) {
        const errorMessage = responseData.message || responseData.error || 'Login failed. Please try again.';
        console.error('❌ Login failed:', errorMessage);
        return { success: false, error: errorMessage };
      }

      const token = responseData.data?.token || responseData.token;
      const userData = responseData.data?.user || responseData.user;
      
      if (!token || !userData) {
        console.error('❌ Token or user data missing in response');
        return { 
          success: false, 
          error: 'Invalid response format from server.' 
        };
      }

      // Store with remember me preference
      storage.setToken(token, remember);
      storage.setUser(userData, remember);
      apiClient.defaults.headers.Authorization = `Bearer ${token}`;
      
      setUser(userData);
      setIsAuthenticated(true);
      setRememberMe(remember);
      
      console.log('✅ Login successful for:', userData.firstName || userData.email);
      return { success: true, user: userData };
      
    } catch (error) {
      console.error('❌ Login error:', error);
      
      const errorMessages = {
        timeout: 'Login request timed out. Please check your connection and try again.',
        'Network Error': 'Network error. Please check your internet connection.',
      };
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.message) {
        errorMessage = errorMessages[error.message] || error.message;
      }
      
      if (error.response?.data) {
        const data = error.response.data;
        if (data.message) errorMessage = data.message;
        else if (data.error) errorMessage = data.error;
        else if (data.errors) {
          const errors = Object.values(data.errors).flat();
          errorMessage = errors.join(', ');
        }
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    clearAuth();
    setRememberMe(false);
  };

  const value = {
    isAuthenticated,
    loading,
    user,
    rememberMe,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;