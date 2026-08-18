import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  Folder as FolderIcon,
  Code as CodeIcon,
  Shield as ShieldIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import PermissionsAPI from '../api/permissions';

const PermissionViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [permission, setPermission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPermission();
  }, [id]);

  const fetchPermission = async () => {
    try {
      setLoading(true);
      const response = await PermissionsAPI.getById(id);
      console.log('📦 Permission Response:', response);
      
      // Extract permission data from different response formats
      let permData = {};
      const responseData = response?.data || {};
      
      if (responseData.success && responseData.data) {
        permData = responseData.data;
      } else if (responseData.data) {
        permData = responseData.data;
      } else if (responseData.permId || responseData.permissionId) {
        permData = responseData;
      } else if (responseData.$values && Array.isArray(responseData.$values)) {
        permData = responseData.$values[0] || {};
      }
      
      console.log('📋 Extracted Permission Data:', permData);
      setPermission(permData);
    } catch (error) {
      console.error('❌ Error fetching permission:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to load permission',
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
      navigate('/permissions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete permission "${permission?.permName || permission?.name || 'Unnamed Permission'}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete!',
      background: isDark ? '#141c2b' : '#ffffff',
      color: isDark ? '#e8edf5' : '#0f172a',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await PermissionsAPI.delete(id);
          navigate('/permissions');
          Swal.fire({
            title: 'Deleted!',
            text: 'Permission has been deleted.',
            icon: 'success',
            background: isDark ? '#141c2b' : '#ffffff',
            color: isDark ? '#e8edf5' : '#0f172a',
            confirmButtonColor: '#3b82f6',
          });
        } catch (error) {
          console.error('Error deleting permission:', error);
          Swal.fire({
            title: 'Error!',
            text: error.response?.data?.message || 'Failed to delete permission',
            icon: 'error',
            background: isDark ? '#141c2b' : '#ffffff',
            color: isDark ? '#e8edf5' : '#0f172a',
            confirmButtonColor: '#3b82f6',
          });
        }
      }
    });
  };

  const getActionColor = (action) => {
    const colors = {
      'CREATE': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'READ': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'UPDATE': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'DELETE': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'ASSIGN': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'RESOLVE': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    };
    return colors[action] || 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-400';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Loading permission data...
        </p>
      </div>
    );
  }

  if (!permission) {
    return (
      <div className="text-center py-12">
        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Permission not found</p>
        <button
          onClick={() => navigate('/permissions')}
          className="mt-4 btn-primary px-4 py-2 rounded-lg text-white"
        >
          Back to Permissions
        </button>
      </div>
    );
  }

  // Get permission data with fallbacks
  const permName = permission.permName || permission.name || 'Unnamed Permission';
  const category = permission.category || permission.categoryName || 'Uncategorized';
  const module = permission.module || permission.moduleName || 'Unknown Module';
  const resource = permission.resource || permission.resourceName || 'Unknown Resource';
  const action = permission.action || 'READ';
  const description = permission.description || 'No description available';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/permissions')}
            className={`p-2 rounded-lg transition ${
              isDark 
                ? 'hover:bg-[#1a2438] text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <ArrowBackIcon />
          </button>
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {permName}
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              Permission Details
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/permissions/${id}/edit`)}
            className="btn-primary flex items-center space-x-2 px-4 py-2 rounded-lg text-white"
          >
            <EditIcon className="w-5 h-5" />
            <span>Edit Permission</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            <DeleteIcon className="w-5 h-5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`rounded-xl p-6 border ${
          isDark ? 'border-[#1e2d45] bg-[#141c2b]' : 'border-gray-200 bg-white'
        }`}>
          <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Permission Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CategoryIcon className={`w-5 h-5 mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Category</p>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {category}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FolderIcon className={`w-5 h-5 mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Module</p>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {module}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CodeIcon className={`w-5 h-5 mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Resource</p>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <code className="px-2 py-1 rounded bg-gray-100 dark:bg-[#1a2438] text-sm">
                    {resource}
                  </code>
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ShieldIcon className={`w-5 h-5 mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Action</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(action)}`}>
                  {action}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-6 border ${
          isDark ? 'border-[#1e2d45] bg-[#141c2b]' : 'border-gray-200 bg-white'
        }`}>
          <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <div className="flex items-center space-x-2">
              <DescriptionIcon className="w-4 h-4" />
              <span>Description</span>
            </div>
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {description}
          </p>
          
          {/* Additional info */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#1e2d45]">
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Permission ID: #{permission.permId || permission.permissionId || permission.id || id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionViewPage;