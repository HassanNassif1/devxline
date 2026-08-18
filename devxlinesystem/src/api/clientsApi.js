// clientsApi.js
import apiClient from "./config";

export const clientsApi = {
  // GET /api/Clients - Get all clients with pagination and filters
  getClients: (params) => {
    // Make sure we're sending the businessType parameter correctly
    const queryParams = { ...params };
    
    // Remove empty filters to avoid sending unnecessary params
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
        delete queryParams[key];
      }
    });
    
    console.log('Sending API request with params:', queryParams);
    return apiClient.get('/Clients', { params: queryParams });
  },
  
  // GET /api/Clients/{clientId} - Get a single client by ID
  getClient: (id) => {
    return apiClient.get(`/Clients/${id}`);
  },
  
  // POST /api/Clients - Create a new client
  createClient: (data) => {
    return apiClient.post('/Clients', data);
  },
  
  // PUT /api/Clients/{clientId} - Update a client
  updateClient: (id, data) => {
    return apiClient.put(`/Clients/${id}`, data);
  },
  
  // DELETE /api/Clients/{clientId} - Delete a client
  deleteClient: (id) => {
    return apiClient.delete(`/Clients/${id}`);
  },
  
  // GET /api/Clients/active - Get all active clients
  getActiveClients: () => {
    return apiClient.get('/Clients/active');
  },
  
  // GET /api/Clients/check-email - Check if email already exists
  checkEmail: (email) => {
    return apiClient.get('/Clients/check-email', { 
      params: { email } 
    });
  },
  
  // GET /api/Clients/check-mobile - Check if mobile number already exists
  checkMobile: (mobile) => {
    return apiClient.get('/Clients/check-mobile', { 
      params: { mobile } 
    });
  }
};