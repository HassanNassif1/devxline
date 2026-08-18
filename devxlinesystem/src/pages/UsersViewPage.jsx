import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import UsersAPI from '../api/users';

const UsersViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      console.log('🔍 Fetching user with ID:', id);
      
      const userResponse = await UsersAPI.getById(id);
      console.log('📦 User API Response:', userResponse);
      
      // Extract user data from the API response
      let userData = {};
      const responseData = userResponse?.data || {};
      
      // Check for the new API response format: { success: true, data: {...} }
      if (responseData.success && responseData.data) {
        userData = responseData.data;
      }
      // Check if data is in responseData.data
      else if (responseData.data) {
        userData = responseData.data;
      }
      // Check if the response itself is the data
      else if (responseData.userId) {
        userData = responseData;
      }
      // Check if data is in $values (common for .NET APIs)
      else if (responseData.$values && Array.isArray(responseData.$values)) {
        userData = responseData.$values[0] || {};
      }
      
      console.log('📋 Extracted User Data:', userData);
      
      setUser(userData);
      
    } catch (error) {
      console.error('❌ Error fetching user:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to load user data',
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!user) return;
    
    const fullName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
    
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete user "${fullName}"? This action cannot be undone.`,
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
          const userId = user.userId || user.id;
          await UsersAPI.delete(userId);
          Swal.fire({
            title: 'Deleted!',
            text: 'User has been deleted.',
            icon: 'success',
            background: isDark ? '#141c2b' : '#ffffff',
            color: isDark ? '#e8edf5' : '#0f172a',
            confirmButtonColor: '#3b82f6',
          });
          navigate('/users');
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

  // Get role color based on role name
  const getRoleColor = (roleName) => {
    switch(roleName) {
      case 'SuperAdmin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Admin':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'User':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400';
    }
  };

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

  if (!user || Object.keys(user).length === 0) {
    return (
      <div className="text-center py-12">
        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
          User not found
        </p>
        <button
          onClick={() => navigate('/users')}
          className="mt-4 btn-primary px-4 py-2 rounded-lg text-white"
        >
          Back to Users
        </button>
      </div>
    );
  }

  // Get user data with fallbacks
  const fullName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A';
  const email = user.email || 'N/A';
  const phone = user.phone || 'N/A';
  const department = user.department || 'N/A';
  const roleName = user.roleName || 'No Role Assigned';
  const status = user.isActive ? 'Active' : 'Inactive';
  const isActive = user.isActive === true;
  const userId = user.userId || user.id || 'N/A';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/users')}
          className={`p-2 rounded-lg transition ${
            isDark 
              ? 'hover:bg-[#1a2438] text-gray-400 hover:text-white' 
              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
          }`}
        >
          <ArrowBackIcon />
        </button>
        <div className="flex-1">
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            User Details
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            View user information
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/users/${userId}/edit`)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
              isDark 
                ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-400/20' 
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            <EditIcon className="w-5 h-5" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDelete}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
              isDark 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-400/20' 
                : 'bg-red-50 text-red-600 hover:bg-red-100'
            }`}
          >
            <DeleteIcon className="w-5 h-5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className={`rounded-xl p-6 border ${
        isDark ? 'border-[#1e2d45] bg-[#141c2b]' : 'border-gray-200 bg-white'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div>
            <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Personal Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <PersonIcon className={`w-5 h-5 mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Full Name</p>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {fullName}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <EmailIcon className={`w-5 h-5 mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {email}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <PhoneIcon className={`w-5 h-5 mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Phone</p>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {phone}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <BusinessIcon className={`w-5 h-5 mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Department</p>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {department}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div>
            <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Account Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <BadgeIcon className={`w-5 h-5 mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>User ID</p>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {userId}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <BadgeIcon className={`w-5 h-5 mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Role</p>
                  <p className={`font-medium`}>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(roleName)}`}>
                      {roleName}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                {isActive ? (
                  <CheckCircleIcon className={`w-5 h-5 mt-0.5 text-green-500`} />
                ) : (
                  <CancelIcon className={`w-5 h-5 mt-0.5 text-red-500`} />
                )}
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                    isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-400'
                  }`}>
                    {status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersViewPage;