// src/api/rolePermissions.js
import apiClient from './config';

const RolePermissionsAPI = {
  // GET /api/RolePermissions/summary - Get summary of all role permissions
  getSummary: () => {
    return apiClient.get('/RolePermissions/summary');
  },

  // GET /api/RolePermissions/role/{roleId} - Get permissions for a specific role
  getByRole: (roleId) => {
    return apiClient.get(`/RolePermissions/role/${roleId}`);
  },

  // PUT /api/RolePermissions/role/{roleId} - Assign permissions to a role
  assignPermissions: (roleId, permissionsData) => {
    console.log(`📤 PUT /RolePermissions/role/${roleId}`, permissionsData);
    return apiClient.put(`/RolePermissions/role/${roleId}`, permissionsData);
  },

  // DELETE /api/RolePermissions/role/{roleId} - Remove all permissions from a role
  removePermissions: (roleId) => {
    return apiClient.delete(`/RolePermissions/role/${roleId}`);
  },

  // GET /api/RolePermissions/role/{roleId}/categorized - Get categorized permissions for a role
  getCategorizedByRole: (roleId) => {
    return apiClient.get(`/RolePermissions/role/${roleId}/categorized`);
  },
};

export default RolePermissionsAPI;