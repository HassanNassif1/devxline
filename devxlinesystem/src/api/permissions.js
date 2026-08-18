import apiClient from './config';

const PermissionsAPI = {
  // POST /api/Permissions
  create: (permissionData) => {
    return apiClient.post('/Permissions', permissionData);
  },

  // GET /api/Permissions
  getAll: () => {
    return apiClient.get('/Permissions');
  },

  // GET /api/Permissions/{permId}
  getById: (permId) => {
    return apiClient.get(`/Permissions/${permId}`);
  },

  // PUT /api/Permissions/{permId}
  update: (permId, permissionData) => {
    return apiClient.put(`/Permissions/${permId}`, permissionData);
  },

  // DELETE /api/Permissions/{permId}
  delete: (permId) => {
    return apiClient.delete(`/Permissions/${permId}`);
  },

  // GET /api/Permissions/check-name
  checkName: (name) => {
    return apiClient.get('/Permissions/check-name', { params: { name } });
  },
};

export default PermissionsAPI;