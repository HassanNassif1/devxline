import apiClient from './config';

const TicketsAPI = {
  // POST /api/Tickets
  create: (ticketData) => {
    return apiClient.post('/Tickets', ticketData);
  },

  // GET /api/Tickets
  getAll: () => {
    return apiClient.get('/Tickets');
  },

  // GET /api/Tickets/{ticketId}
  getById: (ticketId) => {
    return apiClient.get(`/Tickets/${ticketId}`);
  },

  // PUT /api/Tickets/{ticketId}
  update: (ticketId, ticketData) => {
    return apiClient.put(`/Tickets/${ticketId}`, ticketData);
  },

  // DELETE /api/Tickets/{ticketId}
  delete: (ticketId) => {
    return apiClient.delete(`/Tickets/${ticketId}`);
  },

  // GET /api/Tickets/assigned/{userId}
  getAssignedToUser: (userId) => {
    return apiClient.get(`/Tickets/assigned/${userId}`);
  },

  // GET /api/Tickets/reported/{userId}
  getReportedByUser: (userId) => {
    return apiClient.get(`/Tickets/reported/${userId}`);
  },

  // PATCH /api/Tickets/{ticketId}/assign
  assign: (ticketId, assignData) => {
    return apiClient.patch(`/Tickets/${ticketId}/assign`, assignData);
  },

  // PATCH /api/Tickets/{ticketId}/status
  updateStatus: (ticketId, statusData) => {
    return apiClient.patch(`/Tickets/${ticketId}/status`, statusData);
  },
};

export default TicketsAPI;