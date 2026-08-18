import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import RolesAPI from '../api/roles';
import PermissionsAPI from '../api/permissions';
import RolePermissionsAPI from '../api/rolePermissions';

const RolePermissionEditPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { isDark } = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Permission "View Mode" vs "Edit Mode"
  const [isViewMode, setIsViewMode] = useState(true);

  const [roles, setRoles] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  
  // State to hold the flat array of permissions for the selected role
  const [rolePermissionsList, setRolePermissionsList] = useState([]);
  
  // Form Selection State
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [selectedPermissionId, setSelectedPermissionId] = useState('');
  
  // Simple toggle state for the specific permission
  const [isAllowed, setIsAllowed] = useState(false);

  // 1. Load initial data (Roles and All Permissions)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        let initialRoleId = parseInt(id);
        if (isNaN(initialRoleId)) initialRoleId = null;

        const [rolesRes, permsRes] = await Promise.all([
          RolesAPI.getAll(),
          PermissionsAPI.getAll()
        ]);

        let rData = rolesRes?.data?.data || rolesRes?.data || [];
        if (rData.$values) rData = rData.$values;
        setRoles(rData);

        let pData = permsRes?.data?.data || permsRes?.data || [];
        if (pData.$values) pData = pData.$values;
        setAllPermissions(pData);

        if (initialRoleId && rData.some(r => r.roleId === initialRoleId)) {
          setSelectedRoleId(initialRoleId);
        } else if (rData.length > 0) {
          setSelectedRoleId(rData[0].roleId);
        }

      } catch (error) {
        console.error("Failed to load initial data:", error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load roles or permissions.',
          icon: 'error',
          background: isDark ? '#141c2b' : '#ffffff',
          confirmButtonColor: '#3b82f6',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id, isDark]);

  // 2. Fetch permissions when a Role is selected
  useEffect(() => {
    const fetchRolePermissions = async () => {
      if (!selectedRoleId) return;

      try {
        const response = await RolePermissionsAPI.getByRole(selectedRoleId);
        
        let dataToProcess = response?.data || {};
        if (dataToProcess.success && dataToProcess.data) {
          dataToProcess = dataToProcess.data;
        }

        // Fix: Read from dataToProcess.permissions
        if (dataToProcess.permissions && Array.isArray(dataToProcess.permissions)) {
          setRolePermissionsList(dataToProcess.permissions);
        } else if (Array.isArray(dataToProcess)) {
          setRolePermissionsList(dataToProcess);
        } else {
          setRolePermissionsList([]);
        }

        setSelectedPermissionId('');
        setIsAllowed(false);

      } catch (error) {
        console.error(`Error fetching permissions:`, error);
        setRolePermissionsList([]);
      }
    };
    fetchRolePermissions();
  }, [selectedRoleId]);

  // 3. When Permission is selected, check its current state
  useEffect(() => {
    if (!selectedPermissionId || rolePermissionsList.length === 0) {
      setIsAllowed(false);
      return;
    }

    const targetId = parseInt(selectedPermissionId);
    const isAssigned = rolePermissionsList.some(p => {
      const pId = p.permId || p.permissionId || p.id;
      return pId === targetId;
    });

    setIsAllowed(isAssigned);
  }, [selectedPermissionId, rolePermissionsList]);

  // 4. Handle Form Submission (Update) - EXACT SWAGGER LOGIC
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoleId || !selectedPermissionId) return;

    try {
      setSaving(true);

      // 1. Get current assigned IDs
      let currentAssignedIds = rolePermissionsList.map(p => p.permId || p.permissionId || p.id);
      const targetId = parseInt(selectedPermissionId);
      
      let finalAssignedIds;
      if (isAllowed) {
        if (!currentAssignedIds.includes(targetId)) {
          finalAssignedIds = [...currentAssignedIds, targetId];
        } else {
          finalAssignedIds = currentAssignedIds;
        }
      } else {
        finalAssignedIds = currentAssignedIds.filter(id => id !== targetId);
      }

      // =========================================================================
      // THE FIX: Convert the simple array into the EXACT object Swagger accepted
      // =========================================================================
      const payload = {
        permissions: finalAssignedIds.map(id => ({
          permissionId: id,
          isAllowed: true
        }))
      };
      // =========================================================================

      console.log('📤 SENDING EXACT SWAGGER PAYLOAD:', payload);
      
      await RolePermissionsAPI.assignPermissions(selectedRoleId, payload);

      // Wait 600ms for DB commit
      await new Promise(resolve => setTimeout(resolve, 600));

      // Re-fetch data to refresh the view
      const refreshResponse = await RolePermissionsAPI.getByRole(selectedRoleId);
      let freshData = refreshResponse?.data || {};
      if (freshData.success && freshData.data) freshData = freshData.data;
      
      if (freshData.permissions && Array.isArray(freshData.permissions)) {
        setRolePermissionsList(freshData.permissions);
      } else if (Array.isArray(freshData)) {
        setRolePermissionsList(freshData);
      } else {
        setRolePermissionsList([]);
      }

      const roleName = roles.find(r => r.roleId === selectedRoleId)?.roleName || 'Role';
      await Swal.fire({
        title: 'Success!',
        text: `Permission updated successfully for ${roleName}`,
        icon: 'success',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
        timer: 3000,
      });

      setIsViewMode(true); // Switch back to view mode

    } catch (error) {
      console.error('Error saving permission:', error);
      console.log('🛑 Server Error Details:', error.response?.data);

      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || error.response?.data?.title || 'Failed to update permission.',
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/role-permissions')} className="icon-btn">
            <ArrowBackIcon />
          </button>
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {isViewMode ? 'Permission Details' : 'Edit Individual Permission'}
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              {isViewMode 
                ? 'Review the current access level.' 
                : 'Select a permission and toggle access rights.'}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          {isViewMode ? (
            <button 
              onClick={() => setIsViewMode(false)} 
              className="btn-primary flex items-center space-x-2 px-4 py-2 rounded-lg text-white"
            >
              <EditIcon className="w-5 h-5" />
              <span>Edit Mapping</span>
            </button>
          ) : (
            <button 
              onClick={() => setIsViewMode(true)} 
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-[#1e2d45] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a2438] transition"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      <div className={`rounded-xl p-6 border ${isDark ? 'border-[#1e2d45] bg-[#141c2b]' : 'border-gray-200 bg-white'}`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Role *</label>
              <select
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDark ? 'bg-[#1a2438] border-[#1e2d45] text-white' : 'bg-white border-gray-300'}`}
                required
                disabled={isViewMode}
              >
                <option value="">-- Select a Role --</option>
                {roles.map(role => (
                  <option key={role.roleId} value={role.roleId}>{role.roleName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Permission *</label>
              <select
                value={selectedPermissionId}
                onChange={(e) => setSelectedPermissionId(parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDark ? 'bg-[#1a2438] border-[#1e2d45] text-white' : 'bg-white border-gray-300'}`}
                required
                disabled={!selectedRoleId || isViewMode}
              >
                <option value="">-- Select a Permission --</option>
                {allPermissions.map(perm => {
                  const pId = perm.permId || perm.permissionId || perm.id;
                  return (
                    <option key={pId} value={pId}>
                      {perm.permName || perm.name} {perm.module ? `(${perm.module})` : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Current Access Level
              </label>
              <select
                value={isAllowed ? 'allowed' : 'denied'}
                onChange={(e) => setIsAllowed(e.target.value === 'allowed')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDark ? 'bg-[#1a2438] border-[#1e2d45] text-white' : 'bg-white border-gray-300'}`}
                disabled={!selectedPermissionId || isViewMode}
              >
                <option value="allowed">✅ Allowed (Has Access)</option>
                <option value="denied">❌ Denied (No Access)</option>
              </select>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-[#1e2d45]">
            <button
              type="button"
              onClick={() => navigate('/role-permissions')}
              className="px-6 py-2 rounded-lg border border-gray-300 dark:border-[#1e2d45] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a2438] transition"
            >
              Back to Dashboard
            </button>
            
            {!isViewMode && (
              <button
                type="submit"
                className="btn-primary flex items-center space-x-2 px-6 py-2 rounded-lg text-white"
                disabled={saving || !selectedRoleId || !selectedPermissionId}
              >
                {saving ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <SaveIcon className="w-5 h-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RolePermissionEditPage;