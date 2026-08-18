import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import UsersAPI from '../api/users';
import RolesAPI from '../api/roles';

const UsersEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    roleId: '',
    phone: '',
    department: '',
    status: 'Active'
  });

  useEffect(() => {
    if (!id) {
      setError('No user ID provided');
      setLoading(false);
      return;
    }
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching user with ID:', id);
      
      // Fetch user and roles in parallel
      const [userResponse, rolesResponse] = await Promise.all([
        UsersAPI.getById(id),
        RolesAPI.getAll()
      ]);
      
      console.log('📦 User Response:', userResponse);
      console.log('📦 Roles Response:', rolesResponse);
      
      // Extract user data from different possible formats
      let userData = {};
      if (userResponse?.data) {
        userData = userResponse.data;
        if (userData.data) {
          userData = userData.data;
        }
        if (userData.$values && Array.isArray(userData.$values)) {
          userData = userData.$values[0] || {};
        }
      }
      
      console.log('📋 Extracted User Data:', userData);
      
      // Extract roles data
      let rolesData = [];
      const rolesResponseData = rolesResponse?.data || {};
      
      if (rolesResponseData.data && Array.isArray(rolesResponseData.data)) {
        rolesData = rolesResponseData.data;
      } else if (rolesResponseData.$values && Array.isArray(rolesResponseData.$values)) {
        rolesData = rolesResponseData.$values;
      } else if (Array.isArray(rolesResponseData)) {
        rolesData = rolesResponseData;
      } else if (rolesResponseData.items && Array.isArray(rolesResponseData.items)) {
        rolesData = rolesResponseData.items;
      }
      
      console.log('📋 Extracted Roles Data:', rolesData);
      
      setRoles(rolesData);
      
      // Get role ID from user data
      const roleId = userData.roleId || userData.role?.roleId || userData.roleId || '';
      
      // Get status from user data
      let status = userData.status || 'Active';
      if (userData.isActive !== undefined) {
        status = userData.isActive ? 'Active' : 'Inactive';
      }
      
      // Ensure phone is properly formatted as string
      let phoneValue = '';
      if (userData.phone !== undefined && userData.phone !== null) {
        phoneValue = String(userData.phone);
      }
      
      // Populate form data with user data
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        roleId: roleId ? String(roleId) : '',
        phone: phoneValue,
        department: userData.department || '',
        status: status
      });
      
      console.log('📝 Form Data Set:', {
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        roleId: roleId ? String(roleId) : '',
        phone: phoneValue,
        department: userData.department || '',
        status: status
      });
      
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setError(error.response?.data?.message || 'Failed to load user data');
      
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to load user data',
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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

    // Validate email format
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

    // Validate phone number - must be within int32 range or empty
    let phoneNumber = 0;
    if (formData.phone && formData.phone.trim() !== '') {
      const cleanedPhone = formData.phone.replace(/\D/g, '');
      if (cleanedPhone) {
        phoneNumber = parseInt(cleanedPhone, 10);
        // Check if phone number exceeds int32 max value
        if (phoneNumber > 2147483647) {
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
    }

    try {
      setSubmitting(true);
      
      // Prepare user data for API - phone must be a number
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        roleId: parseInt(formData.roleId, 10),
        phone: phoneNumber, // Send as number (0 if empty)
        department: formData.department ? String(formData.department).trim() : '',
        isActive: formData.status === 'Active'
      };
      
      console.log('📤 Updating user with data:', JSON.stringify(userData, null, 2));
      console.log('📤 Phone value:', userData.phone, 'Type:', typeof userData.phone);
      
      await UsersAPI.update(id, userData);
      
      Swal.fire({
        title: 'Success!',
        text: 'User updated successfully',
        icon: 'success',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
        timer: 2000,
        timerProgressBar: true,
      });
      
      navigate(`/users/${id}`);
    } catch (error) {
      console.error('❌ Error updating user:', error);
      
      let errorMessage = 'Failed to update user';
      
      if (error.response?.data) {
        console.error('Error response data:', error.response.data);
        
        // Handle validation errors
        if (error.response.data.errors) {
          const errors = error.response.data.errors;
          const errorMessages = [];
          
          // Loop through each field and get error messages
          Object.keys(errors).forEach((field) => {
            const fieldErrors = errors[field];
            if (Array.isArray(fieldErrors)) {
              fieldErrors.forEach((msg) => {
                errorMessages.push(`${field}: ${msg}`);
              });
            } else if (typeof fieldErrors === 'string') {
              errorMessages.push(`${field}: ${fieldErrors}`);
            } else if (typeof fieldErrors === 'object') {
              // Handle nested errors
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
      } else if (error.message) {
        errorMessage = error.message;
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
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderRoleOptions = () => {
    if (!Array.isArray(roles) || roles.length === 0) {
      return <option value="">No roles available</option>;
    }
    
    return roles.map((role) => {
      const roleId = role.roleId || role.id;
      const roleName = role.roleName || role.name || 'Unnamed Role';
      return (
        <option key={roleId} value={String(roleId)}>
          {roleName}
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

  // Show error state
  if (error) {
    return (
      <div className={`rounded-xl p-6 border ${isDark ? 'border-red-500/20 bg-red-500/10' : 'border-red-200 bg-red-50'}`}>
        <div className="text-center py-8">
          <h2 className={`text-xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
            Error Loading User
          </h2>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {error}
          </p>
          <button
            onClick={() => navigate('/users')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Loading user data...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(`/users/${id}`)}
          className={`p-2 rounded-lg transition ${
            isDark 
              ? 'hover:bg-[#1a2438] text-gray-400 hover:text-white' 
              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
          }`}
          disabled={submitting}
        >
          <ArrowBackIcon />
        </button>
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Edit User
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            Update user information
          </p>
          {formData.firstName && (
            <p className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              Editing: {formData.firstName} {formData.lastName}
            </p>
          )}
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
                disabled={submitting}
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
                disabled={submitting}
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
                disabled={submitting}
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
                disabled={submitting}
              >
                <option value="">Select Role</option>
                {renderRoleOptions()}
              </select>
            </div>
            
            <div>
              <label className={labelClass}>
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className={inputClass}
                placeholder="961707754 (max: 2147483647)"
                disabled={submitting}
              />
              {/* <p className={`text-xs mt-1 text-yellow-500`}>
                ⚠️ Phone number must be less than 2,147,483,647 (int32 limit)
              </p> */}
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
                disabled={submitting}
              />
            </div>
            
            <div>
              <label className={labelClass}>
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputClass}
                disabled={submitting}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-[#1e2d45]">
            <button
              type="button"
              onClick={() => navigate(`/users/${id}`)}
              className={`px-6 py-2 rounded-lg transition ${
                isDark 
                  ? 'border border-[#1e2d45] text-gray-400 hover:bg-[#1a2438] hover:text-white' 
                  : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <SaveIcon className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsersEditPage;