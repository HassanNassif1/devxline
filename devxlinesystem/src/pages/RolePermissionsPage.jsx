import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import RolesAPI from '../api/roles';
import PermissionsAPI from '../api/permissions';
import RolePermissionsAPI from '../api/rolePermissions';

const RolePermissionsPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [roles, setRoles] = useState([]);
  
  // Flat lists for permissions
  const [allPermissionsList, setAllPermissionsList] = useState([]); 
  
  // The main state: { roleId: [assignedPermissionId1, assignedPermissionId2] }
  const [rolePermissions, setRolePermissions] = useState({});
  
  // Backup for editing
  const [originalPermissions, setOriginalPermissions] = useState({});
  
  const [selectedRole, setSelectedRole] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [summaryData, setSummaryData] = useState({});

  // Initial Load
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch detailed permissions when role selection changes
  useEffect(() => {
    if (selectedRole) {
      fetchDetailedPermissions(selectedRole);
    }
  }, [selectedRole]);

  /* =========================
     FETCH LOGIC
     ========================= */

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      console.log('🚀 Fetching initial data (Roles, Summary)...');
      
      const [summaryResponse, rolesResponse, permissionsResponse] = await Promise.all([
        RolePermissionsAPI.getSummary(),
        RolesAPI.getAll(),
        PermissionsAPI.getAll() 
      ]);
      
      // 1. Process Summary Data
      let summaryMap = {};
      const summaryDataRaw = summaryResponse?.data?.data || summaryResponse?.data || [];
      if (Array.isArray(summaryDataRaw)) {
        summaryDataRaw.forEach(item => {
          summaryMap[item.roleId] = {
            permissionCount: item.permissionCount || 0,
            totalPermissions: item.totalPermissions || 0,
            percentage: item.percentage || 0,
            roleName: item.roleName
          };
        });
      }
      setSummaryData(summaryMap);

      // 2. Process Roles
      let rolesData = [];
      const rolesRaw = rolesResponse?.data?.data || rolesResponse?.data || [];
      if (Array.isArray(rolesRaw)) rolesData = rolesRaw;
      else if (rolesRaw.$values) rolesData = rolesRaw.$values;
      setRoles(rolesData);

      // 3. Process All Permissions (Flat list for checkboxes)
      let allPerms = permissionsResponse?.data?.data || permissionsResponse?.data || [];
      if (allPerms.$values) allPerms = allPerms.$values;
      
      const normalizedPerms = allPerms.map(p => ({
        ...p,
        permissionId: p.permId || p.permissionId || p.id
      }));
      setAllPermissionsList(normalizedPerms);

      // Set initial role selection
      if (rolesData.length > 0) setSelectedRole(rolesData[0]);

    } catch (error) {
      console.error('❌ Error fetching initial data:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load data',
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setLoading(false);
    }
  };

  // ===================== UPDATED FETCH LOGIC =====================
  const fetchDetailedPermissions = async (role) => {
    if (!role) return;
    const roleId = role.roleId || role.id;
    
    try {
      console.log(`🔄 Fetching detailed permissions for role: ${roleId}`);
      
      const response = await RolePermissionsAPI.getByRole(roleId);
      
      let assignedIds = [];
      const respData = response?.data?.data || response?.data || response;

      // NEW STRUCTURE: It returns { roleId: 1, permissions: [ { permId: 1, isAssigned: true } ] }
      if (respData.permissions && Array.isArray(respData.permissions)) {
        assignedIds = respData.permissions
          .filter(perm => perm.isAssigned === true)
          .map(perm => perm.permId || perm.permissionId || perm.id)
          .filter(id => id);
      } 
      // OLD FALLBACK: If it returns a raw flat array
      else if (Array.isArray(respData)) {
        assignedIds = respData
          .filter(p => p.isAssigned === true)
          .map(p => p.permId || p.permissionId || p.id)
          .filter(id => id);
      }

      setRolePermissions(prev => ({ ...prev, [roleId]: assignedIds }));
      setOriginalPermissions(prev => ({ ...prev, [roleId]: [...assignedIds] }));
      
    } catch (error) {
      console.error(`❌ Error fetching detailed permissions:`, error);
      setRolePermissions(prev => ({ ...prev, [roleId]: [] }));
      setOriginalPermissions(prev => ({ ...prev, [roleId]: [] }));
    }
  };

  /* =========================
     INTERACTION LOGIC
     ========================= */

  // Toggle Single Permission
  const togglePermission = (roleId, permId) => {
    if (!isEditing) return;
    const current = rolePermissions[roleId] || [];
    const updated = current.includes(permId)
      ? current.filter(id => id !== permId)
      : [...current, permId];
    setRolePermissions({ ...rolePermissions, [roleId]: updated });
  };

  // Toggle ALL Permissions
  const toggleAllPermissions = (roleId) => {
    if (!isEditing) return;
    const allIds = allPermissionsList.map(p => p.permissionId);
    const current = rolePermissions[roleId] || [];
    const allAssigned = allIds.every(id => current.includes(id));
    setRolePermissions({ ...rolePermissions, [roleId]: allAssigned ? [] : allIds });
  };

  /* =========================
     SAVE LOGIC (UPDATED TO MATCH SWAGGER)
     ========================= */

    const handleSavePermissions = async () => {
    if (!selectedRole || saving) return;
    
    try {
      setSaving(true);
      const roleId = selectedRole.roleId || selectedRole.id;
      const finalPermissionIds = rolePermissions[roleId] || [];

      // =========================================================================
      // THE SWAGGER FIX: Convert [1, 2] into [{ permissionId: 1, isAllowed: true }, ...]
      // =========================================================================
      const payload = {
        permissions: finalPermissionIds.map(id => ({
          permissionId: id,
          isAllowed: true
        }))
      };
      // =========================================================================

      console.log('📤 SENDING EXACT SWAGGER PAYLOAD:', payload);
      
      // Your existing API call works perfectly with this payload
      await RolePermissionsAPI.assignPermissions(roleId, payload);

      setOriginalPermissions(JSON.parse(JSON.stringify(rolePermissions)));
      setIsEditing(false);

      setSummaryData(prev => ({
        ...prev,
        [roleId]: { 
          ...prev[roleId], 
          permissionCount: finalPermissionIds.length 
        }
      }));

      console.log('⏳ Waiting for database commit...');
      await new Promise(resolve => setTimeout(resolve, 600));

      console.log('🔄 Fetching fresh permissions data...');
      await fetchDetailedPermissions(selectedRole);

      Swal.fire({
        title: 'Success!',
        text: `Permissions updated for ${selectedRole.roleName}`,
        icon: 'success',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
        timer: 3000,
      });
      
    } catch (error) {
      console.error('❌ Save error:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to save permissions',
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setSaving(false);
    }
  };
  const handleCancel = () => {
    setRolePermissions(JSON.parse(JSON.stringify(originalPermissions)));
    setIsEditing(false);
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchInitialData();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Loading permissions data...</p>
      </div>
    );
  }

  /* =========================
     UI RENDER
     ========================= */

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Role Permissions Manager</h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Manage permissions for each role using checkboxes</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={handleRefresh} className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-[#1a2438] text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`} title="Refresh">
            <RefreshIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="btn-primary flex items-center space-x-2 px-4 py-2 rounded-lg text-white" disabled={saving}>
              <EditIcon className="w-5 h-5" />
              <span>Edit Permissions</span>
            </button>
          ) : (
            <>
              <button onClick={handleCancel} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-[#1e2d45] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a2438] transition" disabled={saving}>
                Cancel
              </button>
              <button onClick={handleSavePermissions} className="btn-primary flex items-center space-x-2 px-4 py-2 rounded-lg text-white" disabled={saving}>
                {saving ? 'Saving...' : <><SaveIcon className="w-5 h-5" /><span>Save Changes</span></>}
              </button>
            </>
          )}
        </div>
      </div>

      {/* ROLE SELECTOR */}
      <div className={`rounded-xl p-4 border ${isDark ? 'border-[#1e2d45] bg-[#141c2b]' : 'border-gray-200 bg-white'}`}>
        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Select Role</label>
        <div className="flex flex-wrap gap-2">
          {roles.map(role => {
            const roleId = role.roleId || role.id;
            const roleName = role.roleName || role.name;
            const assignedCount = rolePermissions[roleId]?.length || 0;
            const totalPerms = allPermissionsList.length;
            
            return (
              <button
                key={roleId}
                onClick={() => setSelectedRole(role)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedRole && (selectedRole.roleId === roleId)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                    : isDark ? 'bg-[#1a2438] text-gray-300 hover:bg-[#253450]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                disabled={saving}
              >
                <span>{roleName}</span>
                <span className={`ml-2 text-xs ${selectedRole && (selectedRole.roleId === roleId) ? 'text-white/80' : isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  ({assignedCount}/{totalPerms})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PERMISSIONS GRID - FLAT LIST */}
      {selectedRole && (
        <div className={`rounded-xl p-6 border ${isDark ? 'border-[#1e2d45] bg-[#141c2b]' : 'border-gray-200 bg-white'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Permissions for: <span className="text-blue-500">{selectedRole.roleName}</span>
            </h3>
            <div className="flex items-center space-x-4">
              {isEditing && (
                <button onClick={() => toggleAllPermissions(selectedRole.roleId)} className={`text-sm px-3 py-1 rounded-lg ${isDark ? 'bg-[#1a2438] text-gray-300 hover:bg-[#253450]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} disabled={saving}>
                  Select All
                </button>
              )}
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {rolePermissions[selectedRole.roleId]?.length || 0} assigned
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {allPermissionsList.length > 0 ? (
              allPermissionsList.map(perm => {
                const roleId = selectedRole.roleId;
                const currentAssigned = rolePermissions[roleId] || [];
                const isAssigned = currentAssigned.includes(perm.permissionId);

                return (
                  <label 
                    key={perm.permissionId} 
                    className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition ${isDark ? 'hover:bg-[#1a2438]' : 'hover:bg-gray-50'} ${!isEditing ? 'cursor-default' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isAssigned}
                      onChange={() => isEditing && togglePermission(roleId, perm.permissionId)}
                      className={`w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${!isEditing ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                      disabled={!isEditing || saving}
                    />
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{perm.name || perm.permName}</span>
                    <span className={`text-xs ml-auto ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{perm.module || ''}</span>
                  </label>
                );
              })
            ) : (
              <div className="col-span-full text-center py-8">
                <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No permissions available in the system.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RolePermissionsPage;