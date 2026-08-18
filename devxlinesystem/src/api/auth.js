// src/api/auth.js
import apiClient from './config';

const AuthAPI = {
  login: async (credentials) => {
    try {
      console.log('📤 AuthAPI.login called for:', credentials.email);
      
      const response = await apiClient.post('/auth/login', credentials);
      
      console.log('📥 AuthAPI.login response status:', response?.status);
      console.log('📥 AuthAPI.login response data:', response?.data);
      
      return response;
    } catch (error) {
      console.error('❌ AuthAPI.login error:', error);
      
      if (error.isTimeout || (error.code === 'ECONNABORTED')) {
        throw new Error('Login request timed out. The server is taking too long to respond.');
      }
      
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
        return error.response;
      }
      
      throw error;
    }
  },

  // Make getCurrentUser optional - don't throw if it fails
  getCurrentUser: async () => {
    try {
      console.log('📤 AuthAPI.getCurrentUser called');
      
      const response = await apiClient.get('/auth/me', { timeout: 5000 });
      
      if (response && response.data) {
        console.log('📥 AuthAPI.getCurrentUser success');
        return response;
      }
      
      // If no data, return null instead of throwing
      return null;
    } catch (error) {
      console.warn('⚠️ AuthAPI.getCurrentUser not available:', error.message);
      // Return null instead of throwing
      return null;
    }
  },

  logout: async () => {
    try {
      const response = await apiClient.post('/auth/logout');
      return response;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      const response = await apiClient.post('/auth/refresh-token');
      return response;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await apiClient.post('/auth/reset-password', { token, newPassword });
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },
};

export default AuthAPI;