// src/api/config.js
import axios from 'axios';

const API_BASE_URL = 'https://codevelopapi-dev.up.railway.app/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 120 seconds (2 minutes)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

console.log('🔧 API Client initialized with timeout:', apiClient.defaults.timeout, 'ms');

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    config.metadata = { startTime: Date.now() };
    
    console.log(`➡️ ${config.method.toUpperCase()} ${config.url} (timeout: ${config.timeout || 'default'}ms)`);
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    const duration = Date.now() - response.config.metadata?.startTime;
    console.log(`✅ ${response.config.url} - ${response.status} (${duration}ms)`);
    
    if (response.data?.token) {
      sessionStorage.setItem('authToken', response.data.token);
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response;
  },
  (error) => {
    const duration = error.config?.metadata?.startTime 
      ? Date.now() - error.config.metadata.startTime 
      : 'unknown';
    
    const timeout = error.config?.timeout || 'unknown';
    
    console.error(`❌ ${error.config?.url} - ${error.message} (${duration}ms, timeout: ${timeout}ms)`);
    
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      const timeoutSeconds = (error.config?.timeout || 120000) / 1000;
      return Promise.reject({
        ...error,
        isTimeout: true,
        message: `The server is taking too long to respond (${timeoutSeconds}s timeout). Please try again.`
      });
    }
    
    if (error.message === 'Network Error') {
      return Promise.reject({
        ...error,
        isNetworkError: true,
        message: 'Network error. Please check your internet connection.'
      });
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;