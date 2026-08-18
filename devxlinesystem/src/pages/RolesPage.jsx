import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Visibility as ViewIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import RolesAPI from '../api/roles';
import UsersAPI from '../api/users';

const RolesPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCounts, setUserCounts] = useState({});

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      
      // Fetch roles
      const response = await RolesAPI.getAll();
      
      console.log('📦 Roles API Response:', response);
      
      // Extract roles data from different possible response formats
      let rolesData = [];
      
      // Case 1: Direct array
      if (Array.isArray(response.data)) {
        rolesData = response.data;
      }
      // Case 2: .NET API with $values
      else if (response.data && response.data.$values && Array.isArray(response.data.$values)) {
        rolesData = response.data.$values;
      }
      // Case 3: Object with data property
      else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        rolesData = response.data.data;
      }
      // Case 4: Object with items property
      else if (response.data && response.data.items && Array.isArray(response.data.items)) {
        rolesData = response.data.items;
      }
      // Case 5: Object with roles property
      else if (response.data && response.data.roles && Array.isArray(response.data.roles)) {
        rolesData = response.data.roles;
      }
      // Case 6: If response itself is an array
      else if (Array.isArray(response)) {
        rolesData = response;
      }
      // Case 7: Try to find any array property in the response
      else if (response.data && typeof response.data === 'object') {
        for (const key in response.data) {
          if (Array.isArray(response.data[key])) {
            console.log(`Found array in property: ${key}`);
            rolesData = response.data[key];
            break;
          }
        }
      }
      
      console.log('📋 Extracted roles data:', rolesData);
      
      // Set roles
      setRoles(Array.isArray(rolesData) ? rolesData : []);
      
      // Fetch user counts for each role
      if (rolesData.length > 0) {
        await fetchUserCounts(rolesData);
      }
      
    } catch (error) {
      console.error('❌ Error fetching roles:', error);
      setRoles([]);
      
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to load roles',
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCounts = async (rolesData) => {
    try {
      // Fetch all users
      const usersResponse = await UsersAPI.getAll();
      console.log('📦 Users Response for counts:', usersResponse);
      
      // Extract users data
      let usersData = [];
      const responseData = usersResponse?.data || {};
      
      // Try different response formats
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
      console.log('👥 Total users:', usersData.length);
      
      // Count users by role
      const counts = {};
      const roleNames = {};
      
      // Initialize counts for all roles
      rolesData.forEach(role => {
        const roleId = role.roleId || role.id;
        counts[roleId] = 0;
        roleNames[roleId] = role.roleName || role.name;
      });
      
      // Count users for each role
      usersData.forEach(user => {
        // Get the role ID from user object (multiple possible locations)
        const userRoleId = user.roleId || user.role?.roleId || user.role?.id || null;
        const userRoleName = user.roleName || user.role?.roleName || user.role?.name || null;
        
        console.log(`👤 User: ${user.firstName} ${user.lastName}, RoleId: ${userRoleId}, RoleName: ${userRoleName}`);
        
        // Try to match by roleId first
        if (userRoleId !== null && userRoleId !== undefined) {
          // Check if this roleId exists in our roles
          const roleExists = rolesData.some(r => (r.roleId || r.id) === userRoleId);
          if (roleExists) {
            counts[userRoleId] = (counts[userRoleId] || 0) + 1;
            console.log(`✅ Matched user to roleId: ${userRoleId}`);
            return;
          }
        }
        
        // If no match by roleId, try by roleName
        if (userRoleName) {
          const matchingRole = rolesData.find(r => 
            (r.roleName || r.name)?.toLowerCase() === userRoleName?.toLowerCase()
          );
          if (matchingRole) {
            const roleId = matchingRole.roleId || matchingRole.id;
            counts[roleId] = (counts[roleId] || 0) + 1;
            console.log(`✅ Matched user to roleName: ${userRoleName} (RoleId: ${roleId})`);
            return;
          }
        }
        
        // Check if user has role object with roleId
        if (user.role && user.role.roleId) {
          const roleId = user.role.roleId;
          const roleExists = rolesData.some(r => (r.roleId || r.id) === roleId);
          if (roleExists) {
            counts[roleId] = (counts[roleId] || 0) + 1;
            console.log(`✅ Matched user to nested roleId: ${roleId}`);
            return;
          }
        }
        
        console.log(`⚠️ No matching role found for user: ${user.firstName} ${user.lastName}`);
      });
      
      console.log('📊 Final user counts by role:', counts);
      setUserCounts(counts);
      
    } catch (error) {
      console.error('❌ Error fetching user counts:', error);
      // Set default counts to 0
      const counts = {};
      rolesData.forEach(role => {
        const roleId = role.roleId || role.id;
        counts[roleId] = 0;
      });
      setUserCounts(counts);
    }
  };

  const handleDelete = (roleId, roleName) => {
    // Check if there are users with this role
    const userCount = userCounts[roleId] || 0;
    
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
      text: `Delete role "${roleName}"?`,
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
          await RolesAPI.delete(roleId);
          setRoles(prevRoles => prevRoles.filter(r => (r.roleId || r.id) !== roleId));
          // Remove from counts
          const newCounts = { ...userCounts };
          delete newCounts[roleId];
          setUserCounts(newCounts);
          
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

  const getLevelBadge = (level) => {
    const colors = {
      1: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      2: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      3: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      4: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    };
    return colors[level] || 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-400';
  };

  const handleRefresh = () => {
    fetchRoles();
  };

  // Safely render the roles list
  const renderRoles = () => {
    if (!Array.isArray(roles) || roles.length === 0) {
      return (
        <tr>
          <td colSpan="7" className="px-6 py-8 text-center">
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              No roles found
            </p>
          </td>
        </tr>
      );
    }

    return roles.map((role) => {
      const roleId = role.roleId || role.id;
      const roleName = role.roleName || role.name || 'Unnamed Role';
      const roleCode = role.roleCode || role.code || 'N/A';
      const level = role.level || role.priority || 1;
      const isActive = role.isActive !== undefined ? role.isActive : true;
      
      // Get user count from the fetched counts
      const userCount = userCounts[roleId] !== undefined ? userCounts[roleId] : (role.userCount || 0);
      
      return (
        <tr key={roleId} className={isDark ? 'hover:bg-[#1a2438]' : 'hover:bg-gray-50'}>
          <td className="px-6 py-4 whitespace-nowrap text-sm">{roleId}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{roleName}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            <span className="font-mono text-xs px-2 py-1 rounded bg-gray-100 dark:bg-[#1a2438]">
              {roleCode}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            <span className={`px-2 py-1 rounded-full text-xs ${getLevelBadge(level)}`}>
              Level {level}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            <span className={`font-medium ${
              userCount > 0 
                ? (isDark ? 'text-blue-400' : 'text-blue-600') 
                : (isDark ? 'text-gray-500' : 'text-gray-400')
            }`}>
              {userCount}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            <span className={`px-2 py-1 rounded-full text-xs ${
              isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-400'
            }`}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            <button 
              onClick={() => navigate(`/roles/${roleId}`)}
              className="icon-btn text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-1"
              title="View"
            >
              <ViewIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate(`/roles/${roleId}/edit`)}
              className="icon-btn text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 mr-1"
              title="Edit"
            >
              <EditIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => handleDelete(roleId, roleName)}
              className="icon-btn text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
              title="Delete"
            >
              <DeleteIcon className="w-5 h-5" />
            </button>
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
            Roles Management
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            Manage roles and role hierarchy
          </p>
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
            disabled={loading}
          >
            <RefreshIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => navigate('/roles/add')}
            className="btn-primary flex items-center space-x-2 px-4 py-2 rounded-lg text-white"
          >
            <AddIcon className="w-5 h-5" />
            <span>Add Role</span>
          </button>
        </div>
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
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Role Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Users</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-[#1e2d45]' : 'divide-gray-200'}`}>
                {renderRoles()}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPage;