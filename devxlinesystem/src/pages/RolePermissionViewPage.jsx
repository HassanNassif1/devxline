import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Extension as ExtensionIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import RolePermissionsAPI from '../api/rolePermissions';
import RolesAPI from '../api/roles';
import PermissionsAPI from '../api/permissions';

const RolePermissionViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [mapping, setMapping] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all roles and permissions for reference
      const [rolesResponse, permissionsResponse] = await Promise.all([
        RolesAPI.getAll(),
        PermissionsAPI.getAll()
      ]);
      
      // Extract roles data
      let rolesData = [];
      const rolesResponseData = rolesResponse?.data || {};
      if (rolesResponseData.success && Array.isArray(rolesResponseData.data)) {
        rolesData = rolesResponseData.data;
      } else if (rolesResponseData.data && Array.isArray(rolesResponseData.data)) {
        rolesData = rolesResponseData.data;
      } else if (rolesResponseData.$values && Array.isArray(rolesResponseData.$values)) {
        rolesData = rolesResponseData.$values;
      } else if (Array.isArray(rolesResponseData)) {
        rolesData = rolesResponseData;
      }
      setRoles(rolesData);
      
      // Extract permissions data
      let permissionsData = [];
      const permissionsResponseData = permissionsResponse?.data || {};
      if (permissionsResponseData.success && Array.isArray(permissionsResponseData.data)) {
        permissionsData = permissionsResponseData.data;
      } else if (permissionsResponseData.data && Array.isArray(permissionsResponseData.data)) {
        permissionsData = permissionsResponseData.data;
      } else if (permissionsResponseData.$values && Array.isArray(permissionsResponseData.$values)) {
        permissionsData = permissionsResponseData.$values;
      } else if (Array.isArray(permissionsResponseData)) {
        permissionsData = permissionsResponseData;
      }
      setPermissions(permissionsData);
      
      // Fetch the specific role-permission mapping
      await fetchMapping(id);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to load data',
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
      navigate('/role-permissions');
    } finally {
      setLoading(false);
    }
  };

  const fetchMapping = async (mappingId) => {
    try {
      // Try to get the mapping by ID
      const response = await RolePermissionsAPI.getById(mappingId);
      console.log('📦 Mapping Response:', response);
      
      let mappingData = {};
      const responseData = response?.data || {};
      
      if (responseData.success && responseData.data) {
        mappingData = responseData.data;
      } else if (responseData.data) {
        mappingData = responseData.data;
      } else if (responseData.roleId) {
        mappingData = responseData;
      } else if (responseData.$values && Array.isArray(responseData.$values)) {
        mappingData = responseData.$values[0] || {};
      }
      
      console.log('📋 Extracted Mapping Data:', mappingData);
      setMapping(mappingData);
      
    } catch (error) {
      console.error('Error fetching mapping:', error);
      
      // Try to construct mapping from roles and permissions
      try {
        const roleId = parseInt(id);
        const response = await RolePermissionsAPI.getCategorizedByRole(roleId);
        console.log('📦 Categorized Response:', response);
        
        // Find the first permission from the categorized data
        let foundMapping = null;
        const responseData = response?.data || {};
        let dataToProcess = responseData;
        
        if (responseData.success && responseData.data) {
          dataToProcess = responseData.data;
        }
        
        if (dataToProcess.categories && Array.isArray(dataToProcess.categories)) {
          for (const category of dataToProcess.categories) {
            if (category.permissions && Array.isArray(category.permissions)) {
              for (const perm of category.permissions) {
                if (perm.isAssigned) {
                  foundMapping = {
                    roleId: dataToProcess.roleId || roleId,
                    roleName: dataToProcess.roleName || 'Unknown Role',
                    permissionId: perm.permId || perm.permissionId || perm.id,
                    permName: perm.permName || perm.name || 'Unknown Permission',
                    isAllowed: perm.isAssigned !== undefined ? perm.isAssigned : true,
                    category: category.categoryName,
                    module: perm.module,
                    action: perm.action,
                    resource: perm.resource
                  };
                  break;
                }
              }
            }
            if (foundMapping) break;
          }
        }
        
        if (foundMapping) {
          setMapping(foundMapping);
        } else {
          throw new Error('No mapping found');
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        setMapping({
          roleId: parseInt(id),
          roleName: 'Unknown Role',
          permissionId: 0,
          permName: 'Unknown Permission',
          isAllowed: true
        });
      }
    }
  };

  const handleDelete = async () => {
    if (!mapping) return;
    
    Swal.fire({
      title: 'Are you sure?',
      text: `Remove "${mapping.permName || 'this permission'}" from "${mapping.roleName || 'this role'}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, remove!',
      background: isDark ? '#141c2b' : '#ffffff',
      color: isDark ? '#e8edf5' : '#0f172a',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Remove the permission from the role
          await RolePermissionsAPI.removePermissions(mapping.roleId);
          
          navigate('/role-permissions');
          Swal.fire({
            title: 'Removed!',
            text: 'Permission has been removed from role.',
            icon: 'success',
            background: isDark ? '#141c2b' : '#ffffff',
            color: isDark ? '#e8edf5' : '#0f172a',
            confirmButtonColor: '#3b82f6',
          });
        } catch (error) {
          console.error('Error removing permission:', error);
          Swal.fire({
            title: 'Error!',
            text: error.response?.data?.message || 'Failed to remove permission',
            icon: 'error',
            background: isDark ? '#141c2b' : '#ffffff',
            color: isDark ? '#e8edf5' : '#0f172a',
            confirmButtonColor: '#3b82f6',
          });
        }
      }
    });
  };

  const getRoleName = (roleId) => {
    if (!roleId) return 'Unknown Role';
    const role = roles.find(r => (r.roleId || r.id) === parseInt(roleId));
    return role ? (role.roleName || role.name || 'Unknown Role') : `Role #${roleId}`;
  };

  const getPermissionName = (permId) => {
    if (!permId) return 'Unknown Permission';
    const perm = permissions.find(p => (p.permissionId || p.id || p.permId) === parseInt(permId));
    return perm ? (perm.permissionName || perm.name || perm.permName || 'Unknown Permission') : `Permission #${permId}`;
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
          Loading mapping data...
        </p>
      </div>
    );
  }

  if (!mapping) {
    return (
      <div className="text-center py-12">
        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Mapping not found</p>
        <button
          onClick={() => navigate('/role-permissions')}
          className="mt-4 btn-primary px-4 py-2 rounded-lg text-white"
        >
          Back to Permissions
        </button>
      </div>
    );
  }

  const roleName = mapping.roleName || getRoleName(mapping.roleId) || 'Unknown Role';
  const permName = mapping.permName || getPermissionName(mapping.permissionId) || 'Unknown Permission';
  const isAllowed = mapping.isAllowed !== undefined ? mapping.isAllowed : true;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/role-permissions')}
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
              Permission Mapping Details
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              Role: {roleName}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/role-permissions/${id}/edit`)}
            className="btn-primary flex items-center space-x-2 px-4 py-2 rounded-lg text-white"
          >
            <EditIcon className="w-5 h-5" />
            <span>Edit Mapping</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            <DeleteIcon className="w-5 h-5" />
            <span>Remove</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`rounded-xl p-6 border ${
          isDark ? 'border-[#1e2d45] bg-[#141c2b]' : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center text-2xl font-bold">
              <PersonIcon className="w-8 h-8" />
            </div>
            <div>
              <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {roleName}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Role ID: #{mapping.roleId}
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-6 border ${
          isDark ? 'border-[#1e2d45] bg-[#141c2b]' : 'border-gray-200 bg-white'
        }`}>
          <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Permission Information
          </h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <SecurityIcon className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {permName}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <ExtensionIcon className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Permission ID: #{mapping.permissionId}
              </span>
            </div>
            {mapping.category && (
              <div className="flex items-center space-x-2 mt-2">
                <span className={`text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400`}>
                  {mapping.category}
                </span>
              </div>
            )}
            {mapping.action && (
              <div className="flex items-center space-x-2 mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getActionColor(mapping.action)}`}>
                  {mapping.action}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className={`rounded-xl p-6 border ${
          isDark ? 'border-[#1e2d45] bg-[#141c2b]' : 'border-gray-200 bg-white'
        }`}>
          <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Access Status
          </h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              {isAllowed ? (
                <>
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span className={`text-sm font-medium text-green-600 dark:text-green-400`}>
                    Allowed
                  </span>
                </>
              ) : (
                <>
                  <CancelIcon className="w-5 h-5 text-red-500" />
                  <span className={`text-sm font-medium text-red-600 dark:text-red-400`}>
                    Denied
                  </span>
                </>
              )}
            </div>
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {isAllowed 
                ? 'This permission is granted to the role' 
                : 'This permission is denied for the role'}
            </span>
          </div>
        </div>
      </div>

      {/* Additional details if available */}
      {(mapping.module || mapping.resource) && (
        <div className={`rounded-xl p-6 border ${
          isDark ? 'border-[#1e2d45] bg-[#141c2b]' : 'border-gray-200 bg-white'
        }`}>
          <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Additional Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mapping.module && (
              <div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Module</p>
                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {mapping.module}
                </p>
              </div>
            )}
            {mapping.resource && (
              <div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Resource</p>
                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <code className="px-2 py-1 rounded bg-gray-100 dark:bg-[#1a2438]">
                    {mapping.resource}
                  </code>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RolePermissionViewPage;