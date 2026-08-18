import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import UsersAPI from '../api/users';
import RolesAPI from '../api/roles';

const UsersAddPage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    roleId: '',
    phone: '',
    department: '',
    isActive: true
  });

  // Abort controller ref
  const abortControllerRef = useRef(null);

  useEffect(() => {
    fetchRoles();
    
    // Cleanup: abort any pending requests on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchRoles = async () => {
    try {
      setRolesLoading(true);
      
      // Create abort controller for this request
      abortControllerRef.current = new AbortController();
      
      const response = await RolesAPI.getAll(abortControllerRef.current.signal);
      let rolesData = [];
      const responseData = response?.data || {};
      
      if (responseData.data && Array.isArray(responseData.data)) {
        rolesData = responseData.data;
      } else if (responseData.$values && Array.isArray(responseData.$values)) {
        rolesData = responseData.$values;
      } else if (Array.isArray(responseData)) {
        rolesData = responseData;
      } else if (responseData.items && Array.isArray(responseData.items)) {
        rolesData = responseData.items;
      } else if (Array.isArray(response)) {
        rolesData = response;
      }
      
      const formattedRoles = rolesData
        .filter(role => role !== null && role !== undefined)
        .map(role => ({
          roleId: role.roleId || role.id || 0,
          roleName: role.roleName || role.name || 'Unnamed Role',
          level: role.level || 0,
          roleCode: role.roleCode || '',
          isActive: role.isActive !== undefined ? role.isActive : true,
          description: role.description || ''
        }));
      
      setRoles(formattedRoles);
    } catch (error) {
      // Don't show error if it was aborted
      if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
        console.log('⚠️ Fetch roles was cancelled');
        return;
      }
      console.error('❌ Error fetching roles:', error);
      setRoles([]);
      
      // Show error message for network/timeout issues
      if (error.isTimeout || error.isNetworkError) {
        Swal.fire({
          title: 'Connection Error',
          text: error.message || 'Could not load roles. Please check your connection.',
          icon: 'warning',
          background: isDark ? '#141c2b' : '#ffffff',
          color: isDark ? '#e8edf5' : '#0f172a',
          confirmButtonColor: '#3b82f6',
        });
      }
    } finally {
      setRolesLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (loading) return;
    
    // Validate required fields
    if (!formData.firstName.trim()) {
      Swal.fire({
        title: 'Validation Error',
        text: 'First name is required',
        icon: 'warning',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    if (!formData.lastName.trim()) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Last name is required',
        icon: 'warning',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    if (!formData.email.trim()) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Email is required',
        icon: 'warning',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please enter a valid email address',
        icon: 'warning',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    if (!formData.roleId) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please select a role',
        icon: 'warning',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    // Validate phone number
    let phoneValue = '0';
    if (formData.phone && formData.phone.trim() !== '') {
      const cleanedPhone = formData.phone.replace(/\D/g, '');
      phoneValue = cleanedPhone || '0';
      if (parseInt(cleanedPhone, 10) > 2147483647) {
        Swal.fire({
          title: 'Validation Error',
          text: 'Phone number is too large. Please enter a number less than 2,147,483,647.',
          icon: 'warning',
          background: isDark ? '#141c2b' : '#ffffff',
          color: isDark ? '#e8edf5' : '#0f172a',
          confirmButtonColor: '#3b82f6',
        });
        return;
      }
    }

    try {
      setLoading(true);
      
      // Create abort controller for this request
      abortControllerRef.current = new AbortController();
      
      const userData = {
        email: formData.email.trim().toLowerCase(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        department: formData.department ? String(formData.department).trim() : '',
        phone: phoneValue,
        isActive: formData.isActive,
        roleId: parseInt(formData.roleId, 10)
      };
      
      console.log('📤 Creating user with data:', JSON.stringify(userData, null, 2));
      
      // REMOVED: Promise.race() - Let axios handle the timeout
      // Just call the API directly
      const response = await UsersAPI.create(userData, abortControllerRef.current.signal);
      
      console.log('✅ User created successfully:', response);
      
      // Show success message
      await Swal.fire({
        title: 'Success!',
        text: 'User created successfully',
        icon: 'success',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
        timer: 2000,
        timerProgressBar: true,
      });
      
      // Navigate to users list
      navigate('/users', { replace: true });
      
    } catch (error) {
      // Don't show error if it was aborted
      if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
        console.log('⚠️ Request was cancelled');
        setLoading(false);
        return;
      }

      console.error('❌ Error creating user:', error);

      // Check if it's a timeout error from axios
      if (error.isTimeout || error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        Swal.fire({
          title: 'Timeout Error',
          text: 'The server is taking too long to respond. Please try again.',
          icon: 'warning',
          background: isDark ? '#141c2b' : '#ffffff',
          color: isDark ? '#e8edf5' : '#0f172a',
          confirmButtonColor: '#3b82f6',
        });
        setLoading(false);
        return;
      }

      // Check if it's a network error
      if (error.isNetworkError || error.message?.includes('Network')) {
        Swal.fire({
          title: 'Network Error',
          text: 'Could not connect to the server. Please check your internet connection.',
          icon: 'error',
          background: isDark ? '#141c2b' : '#ffffff',
          color: isDark ? '#e8edf5' : '#0f172a',
          confirmButtonColor: '#3b82f6',
        });
        setLoading(false);
        return;
      }

      // Check if backend actually succeeded (status 200/201/204)
      const responseStatus = error?.response?.status || error?.status;
      if (responseStatus === 200 || responseStatus === 201 || responseStatus === 204) {
        await Swal.fire({
          title: 'Success!',
          text: 'User created successfully',
          icon: 'success',
          background: isDark ? '#141c2b' : '#ffffff',
          color: isDark ? '#e8edf5' : '#0f172a',
          confirmButtonColor: '#3b82f6',
          timer: 2000,
          timerProgressBar: true,
        });
        navigate('/users', { replace: true });
        return;
      }

      let errorMessage = 'Failed to create user';
      
      if (error.response?.data) {
        console.error('Error response data:', error.response.data);
        
        // Handle validation errors
        if (error.response.data.errors) {
          const errors = error.response.data.errors;
          const errorMessages = [];
          
          Object.keys(errors).forEach((field) => {
            const fieldErrors = errors[field];
            if (Array.isArray(fieldErrors)) {
              fieldErrors.forEach((msg) => {
                errorMessages.push(`${field}: ${msg}`);
              });
            } else if (typeof fieldErrors === 'string') {
              errorMessages.push(`${field}: ${fieldErrors}`);
            } else if (typeof fieldErrors === 'object') {
              Object.values(fieldErrors).forEach((nestedError) => {
                if (Array.isArray(nestedError)) {
                  nestedError.forEach((msg) => {
                    errorMessages.push(`${field}: ${msg}`);
                  });
                }
              });
            }
          });
          
          if (errorMessages.length > 0) {
            errorMessage = errorMessages.join('\n');
          } else {
            errorMessage = JSON.stringify(errors, null, 2);
          }
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your network connection.';
      } else {
        errorMessage = error.message || 'An unexpected error occurred';
      }
      
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setLoading(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const renderRoleOptions = () => {
    if (rolesLoading) {
      return <option value="">Loading roles...</option>;
    }
    
    if (!Array.isArray(roles) || roles.length === 0) {
      return <option value="">No roles available</option>;
    }
    
    return roles.map((role) => {
      const roleId = role.roleId || role.id;
      const roleName = role.roleName || role.name || 'Unnamed Role';
      return (
        <option key={roleId} value={String(roleId)}>
          {roleName} {role.roleCode ? `(${role.roleCode})` : ''}
        </option>
      );
    });
  };

  const inputClass = `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
    isDark 
      ? 'bg-[#1a2438] border-[#1e2d45] text-white placeholder-gray-500' 
      : 'bg-white border-gray-300 text-gray-900'
  }`;

  const labelClass = `block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/users')}
          className={`p-2 rounded-lg transition ${
            isDark ? 'hover:bg-[#1a2438] text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
          }`}
          disabled={loading}
        >
          <ArrowBackIcon />
        </button>
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Add New User
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            Create a new user account
          </p>
        </div>
      </div>

      <div className={`rounded-xl p-6 border ${
        isDark ? 'border-[#1e2d45] bg-[#141c2b]' : 'border-gray-200 bg-white'
      }`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter first name"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className={labelClass}>
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter last name"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className={labelClass}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="email@example.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className={labelClass}>
                Role *
              </label>
              <select
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                className={inputClass}
                required
                disabled={loading || rolesLoading}
              >
                <option value="">Select Role</option>
                {renderRoleOptions()}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <PhoneIcon className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className={`${inputClass} pl-10`}
                  placeholder="961707754 (max: 2147483647)"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department || ''}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter department"
                disabled={loading}
              />
            </div>

            <div>
              <label className={labelClass}>
                Status
              </label>
              <select
                name="isActive"
                value={formData.isActive ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                className={inputClass}
                disabled={loading}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-[#1e2d45]">
            <button
              type="button"
              onClick={() => navigate('/users')}
              className={`px-6 py-2 rounded-lg transition ${
                isDark 
                  ? 'border border-[#1e2d45] text-gray-400 hover:bg-[#1a2438] hover:text-white' 
                  : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <span>Create User</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsersAddPage;