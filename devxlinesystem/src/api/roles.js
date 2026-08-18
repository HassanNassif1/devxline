import apiClient from './config';

const RolesAPI = {
  // POST /api/Roles
  create: (roleData) => {
    return apiClient.post('/Roles', roleData);
  },

  // GET /api/Roles
  getAll: () => {
    return apiClient.get('/Roles');
  },

  // GET /api/Roles/{roleId}
  getById: (roleId) => {
    return apiClient.get(`/Roles/${roleId}`);
  },

  // PUT /api/Roles/{roleId}
  update: (roleId, roleData) => {
    return apiClient.put(`/Roles/${roleId}`, roleData);
  },

  // DELETE /api/Roles/{roleId}
  delete: (roleId) => {
    return apiClient.delete(`/Roles/${roleId}`);
  },
};

export default RolesAPI;