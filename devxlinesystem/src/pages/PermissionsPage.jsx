import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Visibility as ViewIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import PermissionsAPI from '../api/permissions';

const PermissionsPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const response = await PermissionsAPI.getAll();
      
      // Debug: Log the full response
      console.log('Full Response:', response);
      console.log('Response data:', response.data);
      console.log('Type of response.data:', typeof response.data);
      console.log('Is response.data an array?', Array.isArray(response.data));
      
      // Try to extract the permissions array
      let permissionsData = [];
      
      // Case 1: response.data is directly an array
      if (Array.isArray(response.data)) {
        permissionsData = response.data;
      } 
      // Case 2: response.data is an object with a 'data' property that's an array
      else if (response.data && Array.isArray(response.data.data)) {
        permissionsData = response.data.data;
      }
      // Case 3: response.data is an object with a '$values' property (common with .NET APIs)
      else if (response.data && Array.isArray(response.data.$values)) {
        permissionsData = response.data.$values;
      }
      // Case 4: response.data is an object with a 'items' property that's an array
      else if (response.data && Array.isArray(response.data.items)) {
        permissionsData = response.data.items;
      }
      // Case 5: response.data is an object with a 'permissions' property that's an array
      else if (response.data && Array.isArray(response.data.permissions)) {
        permissionsData = response.data.permissions;
      }
      // Case 6: response.data is an object with a 'result' property that's an array
      else if (response.data && Array.isArray(response.data.result)) {
        permissionsData = response.data.result;
      }
      // Case 7: If response itself is an array (unlikely but possible)
      else if (Array.isArray(response)) {
        permissionsData = response;
      }
      // Case 8: If nothing works, try to find any array property in the response
      else if (response.data && typeof response.data === 'object') {
        // Look for any property that is an array
        for (const key in response.data) {
          if (Array.isArray(response.data[key])) {
            console.log(`Found array in property: ${key}`);
            permissionsData = response.data[key];
            break;
          }
        }
      }
      
      console.log('Extracted permissions data:', permissionsData);
      console.log('Is it an array?', Array.isArray(permissionsData));
      
      setPermissions(Array.isArray(permissionsData) ? permissionsData : []);
      
    } catch (error) {
      console.error('Error fetching permissions:', error);
      setPermissions([]);
      
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to load permissions',
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setLoading(false);
    }
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

  const handleDelete = (permId, permName) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete permission "${permName}"?`,
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
          await PermissionsAPI.delete(permId);
          setPermissions(prevPermissions => prevPermissions.filter(p => p.permId !== permId));
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

  // Safely render the permissions list
  const renderPermissions = () => {
    // Ensure permissions is an array before trying to map
    if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
      return (
        <tr>
          <td colSpan="7" className="px-6 py-8 text-center">
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              {!permissions ? 'No data available' : 'No permissions found'}
            </p>
          </td>
        </tr>
      );
    }

    return permissions.map((perm) => (
      <tr key={perm.permId || Math.random()} className={isDark ? 'hover:bg-[#1a2438]' : 'hover:bg-gray-50'}>
        <td className="px-6 py-4 whitespace-nowrap text-sm">{perm.permId}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{perm.permName}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
            {perm.category || 'N/A'}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">{perm.module || 'N/A'}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <span className={`px-2 py-1 rounded-full text-xs ${getActionColor(perm.action)}`}>
            {perm.action || 'N/A'}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <code className="text-xs bg-gray-100 dark:bg-[#1a2438] px-2 py-1 rounded">
            {perm.resource || 'N/A'}
          </code>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <button 
            onClick={() => navigate(`/permissions/${perm.permId}`)}
            className="icon-btn text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-1"
            title="View"
          >
            <ViewIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => navigate(`/permissions/${perm.permId}/edit`)}
            className="icon-btn text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 mr-1"
            title="Edit"
          >
            <EditIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleDelete(perm.permId, perm.permName)}
            className="icon-btn text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
            title="Delete"
          >
            <DeleteIcon className="w-5 h-5" />
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Permissions Management
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            Manage system permissions and access control
          </p>
        </div>
        <button 
          onClick={() => navigate('/permissions/add')}
          className="btn-primary flex items-center space-x-2 px-4 py-2 rounded-lg text-white"
        >
          <AddIcon className="w-5 h-5" />
          <span>Add Permission</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className={`rounded-xl overflow-hidden border ${
          isDark ? 'border-[#1e2d45]' : 'border-gray-200'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDark ? 'bg-[#0f1623]' : 'bg-gray-50'}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Permission Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Module</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Resource</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-[#1e2d45]' : 'divide-gray-200'}`}>
                {renderPermissions()}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionsPage;