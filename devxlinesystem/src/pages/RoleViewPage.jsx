import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Badge as BadgeIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import RolesAPI from '../api/roles';
import UsersAPI from '../api/users';

const RoleViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchRole();
  }, [id]);

  const fetchRole = async () => {
    try {
      setLoading(true);
      
      // Fetch role details
      const response = await RolesAPI.getById(id);
      console.log('📦 Role Response:', response);
      
      // Extract role data from different response formats
      let roleData = {};
      const responseData = response?.data || {};
      
      if (responseData.success && responseData.data) {
        roleData = responseData.data;
      } else if (responseData.data) {
        roleData = responseData.data;
      } else if (responseData.roleId) {
        roleData = responseData;
      } else if (responseData.$values && Array.isArray(responseData.$values)) {
        roleData = responseData.$values[0] || {};
      }
      
      console.log('📋 Extracted Role Data:', roleData);
      setRole(roleData);
      
      // Fetch users to count role assignments
      await fetchUserCount(roleData);
      
    } catch (error) {
      console.error('❌ Error fetching role:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to load role',
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
      navigate('/roles');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCount = async (roleData) => {
    try {
      const roleId = roleData.roleId || roleData.id;
      const roleName = roleData.roleName || roleData.name;
      
      console.log(`🔍 Fetching users for role: ${roleId} (${roleName})`);
      
      // Fetch all users
      const usersResponse = await UsersAPI.getAll();
      console.log('📦 Users Response:', usersResponse);
      
      // Extract users data
      let usersData = [];
      const responseData = usersResponse?.data || {};
      
      if (responseData.success && Array.isArray(responseData.data)) {
        usersData = responseData.data;
      } else if (responseData.data && Array.isArray(responseData.data)) {
        usersData = responseData.data;
      } else if (responseData.$values && Array.isArray(responseData.$values)) {
        usersData = responseData.$values;
      } else if (Array.isArray(responseData)) {
        usersData = responseData;
      } else if (Array.isArray(usersResponse)) {
        usersData = usersResponse;
      }
      
      console.log('📋 Extracted users data:', usersData);
      
      // Count users with this role
      let count = 0;
      const roleUsers = [];
      
      usersData.forEach(user => {
        // Check multiple possible locations for role
        const userRoleId = user.roleId || user.role?.roleId || user.role?.id || null;
        const userRoleName = user.roleName || user.role?.roleName || user.role?.name || null;
        
        // Check if user has this role
        let hasRole = false;
        
        // Match by roleId
        if (userRoleId !== null && userRoleId !== undefined) {
          if (userRoleId === roleId || userRoleId === parseInt(roleId)) {
            hasRole = true;
          }
        }
        
        // If not matched by roleId, try by roleName
        if (!hasRole && userRoleName) {
          if (userRoleName.toLowerCase() === roleName?.toLowerCase()) {
            hasRole = true;
          }
        }
        
        // Check nested role object
        if (!hasRole && user.role && user.role.roleId) {
          if (user.role.roleId === roleId || user.role.roleId === parseInt(roleId)) {
            hasRole = true;
          }
        }
        
        if (hasRole) {
          count++;
          roleUsers.push(user);
        }
      });
      
      console.log(`✅ Found ${count} users with role: ${roleName}`);
      console.log('👥 Users:', roleUsers);
      
      setUserCount(count);
      setUsers(roleUsers);
      
    } catch (error) {
      console.error('❌ Error fetching user count:', error);
      setUserCount(0);
      setUsers([]);
    }
  };

  const handleDelete = () => {
    // Check if there are users with this role
    if (userCount > 0) {
      Swal.fire({
        title: 'Cannot Delete Role',
        text: `This role has ${userCount} user(s) assigned. Please reassign or remove users first.`,
        icon: 'warning',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }
    
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete role "${role?.roleName || role?.name || 'Unnamed Role'}"?`,
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
          await RolesAPI.delete(id);
          navigate('/roles');
          Swal.fire({
            title: 'Deleted!',
            text: 'Role has been deleted.',
            icon: 'success',
            background: isDark ? '#141c2b' : '#ffffff',
            color: isDark ? '#e8edf5' : '#0f172a',
            confirmButtonColor: '#3b82f6',
          });
        } catch (error) {
          console.error('Error deleting role:', error);
          Swal.fire({
            title: 'Error!',
            text: error.response?.data?.message || 'Failed to delete role',
            icon: 'error',
            background: isDark ? '#141c2b' : '#ffffff',
            color: isDark ? '#e8edf5' : '#0f172a',
            confirmButtonColor: '#3b82f6',
          });
        }
      }
    });
  };

  const handleRefresh = () => {
    fetchRole();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Loading role data...
        </p>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="text-center py-12">
        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Role not found</p>
        <button
          onClick={() => navigate('/roles')}
          className="mt-4 btn-primary px-4 py-2 rounded-lg text-white"
        >
          Back to Roles
        </button>
      </div>
    );
  }

  const roleName = role.roleName || role.name || 'Unnamed Role';
  const roleCode = role.roleCode || role.code || roleName.substring(0, 3).toUpperCase();
  const description = role.description || role.desc || 'No description available';
  const isActive = role.isActive !== undefined ? role.isActive : true;
  const level = role.level || role.priority || 1;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/roles')}
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
              {roleName}
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              Role Details
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-lg transition ${
              isDark 
                ? 'hover:bg-[#1a2438] text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
            title="Refresh"
          >
            <RefreshIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate(`/roles/${id}/edit`)}
            className="btn-primary flex items-center space-x-2 px-4 py-2 rounded-lg text-white"
          >
            <EditIcon className="w-5 h-5" />
            <span>Edit Role</span>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`rounded-xl p-6 border ${
          isDark ? 'border-[#1e2d45] bg-[#141c2b]' : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center text-2xl font-bold">
              {roleCode.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {roleName}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Code: {roleCode}
              </p>
              <span className={`px-2 py-1 rounded-full text-xs ${
                isActive 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-400'
              }`}>
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-6 border ${
          isDark ? 'border-[#1e2d45] bg-[#141c2b]' : 'border-gray-200 bg-white'
        }`}>
          <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Role Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <BadgeIcon className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Level: {level}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <PeopleIcon className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-sm font-medium ${userCount > 0 ? (isDark ? 'text-blue-400' : 'text-blue-600') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}>
                Users: {userCount}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {isActive ? (
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
              ) : (
                <CancelIcon className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Status: {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-6 border ${
          isDark ? 'border-[#1e2d45] bg-[#141c2b]' : 'border-gray-200 bg-white'
        }`}>
          <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <div className="flex items-center space-x-2">
              <DescriptionIcon className="w-4 h-4" />
              <span>Description</span>
            </div>
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {description}
          </p>
        </div>
      </div>

      {/* Users with this role section */}
      {userCount > 0 && (
        <div className={`rounded-xl p-6 border ${
          isDark ? 'border-[#1e2d45] bg-[#141c2b]' : 'border-gray-200 bg-white'
        }`}>
          <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <div className="flex items-center space-x-2">
              <PeopleIcon className="w-4 h-4" />
              <span>Users with this role ({userCount})</span>
            </div>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {users.map((user, index) => {
              const userFullName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User';
              return (
                <div 
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg border ${
                    isDark ? 'border-[#1e2d45] hover:bg-[#1a2438]' : 'border-gray-200 hover:bg-gray-50'
                  } transition cursor-pointer`}
                  onClick={() => navigate(`/users/${user.userId || user.id}`)}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center text-sm font-bold">
                    {userFullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {userFullName}
                    </p>
                    <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {user.email || 'No email'}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.isActive !== false 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-400'
                  }`}>
                    {user.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleViewPage;