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
import UsersAPI from '../api/users';

const UsersPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const usersResponse = await UsersAPI.getAll();
      
      console.log('📦 Users Response:', usersResponse);
      
      // Extract users data from the new API response format
      let usersData = [];
      const responseData = usersResponse?.data || {};
      
      // Check if the response has the new format: { success: true, data: [...] }
      if (responseData.success && Array.isArray(responseData.data)) {
        usersData = responseData.data;
      }
      // Check if the response has a data property that contains the array
      else if (responseData.data && Array.isArray(responseData.data)) {
        usersData = responseData.data;
      }
      // Check if the response has a $values property (common in .NET APIs)
      else if (responseData.$values && Array.isArray(responseData.$values)) {
        usersData = responseData.$values;
      }
      // Check if the response itself is an array
      else if (Array.isArray(responseData)) {
        usersData = responseData;
      }
      // Check if the response has an items property
      else if (responseData.items && Array.isArray(responseData.items)) {
        usersData = responseData.items;
      }
      // Check if the response has a users property
      else if (responseData.users && Array.isArray(responseData.users)) {
        usersData = responseData.users;
      }
      
      console.log('👥 Extracted Users:', usersData);
      
      setUsers(usersData);
      
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setUsers([]);
      
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to load users',
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (userId, userName) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete user "${userName}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      background: isDark ? '#141c2b' : '#ffffff',
      color: isDark ? '#e8edf5' : '#0f172a',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await UsersAPI.delete(userId);
          setUsers(prevUsers => prevUsers.filter(u => u.userId !== userId));
          Swal.fire({
            title: 'Deleted!',
            text: 'User has been deleted.',
            icon: 'success',
            background: isDark ? '#141c2b' : '#ffffff',
            color: isDark ? '#e8edf5' : '#0f172a',
            confirmButtonColor: '#3b82f6',
          });
        } catch (error) {
          console.error('Error deleting user:', error);
          Swal.fire({
            title: 'Error!',
            text: error.response?.data?.message || 'Failed to delete user',
            icon: 'error',
            background: isDark ? '#141c2b' : '#ffffff',
            color: isDark ? '#e8edf5' : '#0f172a',
            confirmButtonColor: '#3b82f6',
          });
        }
      }
    });
  };

  const renderUsers = () => {
    if (!Array.isArray(users) || users.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="px-6 py-8 text-center">
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              No users found
            </p>
          </td>
        </tr>
      );
    }

    return users.map((user) => {
      const userId = user.userId;
      const firstName = user.firstName || '';
      const lastName = user.lastName || '';
      const fullName = user.fullName || `${firstName} ${lastName}`.trim() || 'N/A';
      const email = user.email || 'N/A';
      const department = user.department || 'N/A';
      const phone = user.phone || 'N/A';
      
      // Get role name directly from user object
      const roleName = user.roleName || 'No Role';
      
      // Get status
      const status = user.isActive ? 'Active' : 'Inactive';
      
      return (
        <tr key={userId} className={isDark ? 'hover:bg-[#1a2438]' : 'hover:bg-gray-50'}>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              {userId}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex flex-col">
              <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {fullName}
              </span>
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                {department}
              </span>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
              {email}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              roleName === 'SuperAdmin'
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                : roleName === 'Admin'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                : roleName === 'User'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400'
            }`}>
              {roleName}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              status === 'Active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-400'
            }`}>
              {status}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => navigate(`/users/${userId}`)}
                className={`p-1.5 rounded-lg transition ${
                  isDark 
                    ? 'hover:bg-[#1a2438] text-blue-400 hover:text-blue-300' 
                    : 'hover:bg-blue-50 text-blue-600 hover:text-blue-700'
                }`}
                title="View"
              >
                <ViewIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={() => navigate(`/users/${userId}/edit`)}
                className={`p-1.5 rounded-lg transition ${
                  isDark 
                    ? 'hover:bg-[#1a2438] text-yellow-400 hover:text-yellow-300' 
                    : 'hover:bg-yellow-50 text-yellow-600 hover:text-yellow-700'
                }`}
                title="Edit"
              >
                <EditIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleDelete(userId, fullName)}
                className={`p-1.5 rounded-lg transition ${
                  isDark 
                    ? 'hover:bg-[#1a2438] text-red-400 hover:text-red-300' 
                    : 'hover:bg-red-50 text-red-600 hover:text-red-700'
                }`}
                title="Delete"
              >
                <DeleteIcon className="w-5 h-5" />
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Users Management
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            Manage system users and their roles
          </p>
        </div>
        <button 
          onClick={() => navigate('/users/add')}
          className="btn-primary flex items-center space-x-2 px-4 py-2 rounded-lg text-white"
        >
          <AddIcon className="w-5 h-5" />
          <span>Add User</span>
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
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-[#1e2d45]' : 'divide-gray-200'}`}>
                {renderUsers()}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;