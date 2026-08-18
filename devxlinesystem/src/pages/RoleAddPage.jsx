import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import RolesAPI from '../api/roles';

const RoleAddPage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    roleName: '',
    roleCode: '',
    level: 1,
    isActive: true,
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Prepare the data for the API
      const roleData = {
        roleName: formData.roleName,
        roleCode: formData.roleCode,
        level: formData.level,
        isActive: formData.isActive,
        description: formData.description || ''
      };
      
      await RolesAPI.create(roleData);
      
      Swal.fire({
        title: 'Success!',
        text: 'Role created successfully',
        icon: 'success',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
      navigate('/roles');
    } catch (error) {
      console.error('Error creating role:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to create role',
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/roles')}
          className="icon-btn"
          disabled={loading}
        >
          <ArrowBackIcon />
        </button>
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Add New Role
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            Create a new role
          </p>
        </div>
      </div>

      <div className={`rounded-xl p-6 border ${
        isDark ? 'border-[#1e2d45] bg-[#141c2b]' : 'border-gray-200 bg-white'
      }`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Role Name *
              </label>
              <input
                type="text"
                value={formData.roleName}
                onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark ? 'bg-[#1a2438] border-[#1e2d45] text-white' : 'bg-white border-gray-300'
                }`}
                required
                placeholder="Enter role name"
                disabled={loading}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Role Code *
              </label>
              <input
                type="text"
                value={formData.roleCode}
                onChange={(e) => setFormData({ ...formData, roleCode: e.target.value.toUpperCase() })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark ? 'bg-[#1a2438] border-[#1e2d45] text-white' : 'bg-white border-gray-300'
                }`}
                required
                placeholder="e.g., ADMIN"
                disabled={loading}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Level
              </label>
              <input
                type="number"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark ? 'bg-[#1a2438] border-[#1e2d45] text-white' : 'bg-white border-gray-300'
                }`}
                min="1"
                disabled={loading}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Status
              </label>
              <select
                value={formData.isActive ? 'active' : 'inactive'}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark ? 'bg-[#1a2438] border-[#1e2d45] text-white' : 'bg-white border-gray-300'
                }`}
                disabled={loading}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark ? 'bg-[#1a2438] border-[#1e2d45] text-white' : 'bg-white border-gray-300'
                }`}
                placeholder="Enter role description"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-[#1e2d45]">
            <button
              type="button"
              onClick={() => navigate('/roles')}
              className="px-6 py-2 rounded-lg border border-gray-300 dark:border-[#1e2d45] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a2438] transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2 px-6 py-2 rounded-lg text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <SaveIcon className="w-5 h-5" />
                  <span>Create Role</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleAddPage;