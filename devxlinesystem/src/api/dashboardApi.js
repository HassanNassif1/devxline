
import apiClient from './config';
export const dashboardApi = {
  getStats: () => 
    apiClient.get('/dashboard/stats'),
  
  getRevenueData: () => 
    apiClient.get('/dashboard/revenue'),
  
  getServiceDistribution: () => 
    apiClient.get('/dashboard/services'),
  
  getBusinessTypes: () => 
    apiClient.get('/dashboard/business-types'),
  
  getClientGrowth: () => 
    apiClient.get('/dashboard/growth'),
};