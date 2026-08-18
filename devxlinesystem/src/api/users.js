// src/api/users.js
import apiClient from './config';

const UsersAPI = {
  create: async (userData, signal) => {
    try {
      let phoneValue = '0';
      if (userData.phone !== undefined && userData.phone !== null && userData.phone !== '') {
        phoneValue = String(userData.phone).replace(/\D/g, '');
        if (!phoneValue) phoneValue = '0';
      }
      
      const createData = {
        email: String(userData.email || '').trim().toLowerCase(),
        firstName: String(userData.firstName || '').trim(),
        lastName: String(userData.lastName || '').trim(),
        department: String(userData.department || '').trim(),
        phone: phoneValue,
        isActive: userData.isActive === true || userData.isActive === 'true',
        roleId: userData.roleId ? parseInt(String(userData.roleId), 10) : 0
      };
      
      console.log('📤 Creating user with data:', JSON.stringify(createData, null, 2));
      
      // IMPORTANT: Don't set timeout here - it will override the config
      // Just use the signal for cancellation
      const response = await apiClient.post('/Users', createData, {
        signal: signal
        // No timeout here - let the config handle it
      });
      
      return response;
    } catch (error) {
      if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
        console.warn('⚠️ Request was cancelled');
        throw new Error('Request was cancelled');
      }
      throw error;
    }
  },

  getAll: (signal) => {
    return apiClient.get('/Users', { signal });
  },

  getById: (userId, signal) => {
    return apiClient.get(`/Users/${userId}`, { signal });
  },

  update: (userId, userData, signal) => {
    let phoneValue = '0';
    if (userData.phone !== undefined && userData.phone !== null && userData.phone !== '') {
      phoneValue = String(userData.phone).replace(/\D/g, '');
      if (!phoneValue) phoneValue = '0';
    }
    
    const firstName = String(userData.firstName || '').trim();
    const lastName = String(userData.lastName || '').trim();
    const fullName = `${firstName} ${lastName}`.trim();
    
    const updateData = {
      userId: userData.userId || parseInt(userId, 10) || 0,
      email: String(userData.email || '').trim().toLowerCase(),
      firstName: firstName,
      lastName: lastName,
      fullName: fullName,
      department: String(userData.department || '').trim(),
      phone: phoneValue,
      roleId: userData.roleId ? parseInt(String(userData.roleId), 10) : 0,
      roleName: String(userData.roleName || ''),
      isActive: userData.isActive === true || userData.isActive === 'true'
    };
    
    return apiClient.put(`/Users/${userId}`, updateData, { signal });
  },

  delete: (userId, signal) => {
    return apiClient.delete(`/Users/${userId}`, { signal });
  },

  toggleStatus: (userId, signal) => {
    return apiClient.patch(`/Users/${userId}/toggle-status`, {}, { signal });
  },
};

export default UsersAPI;