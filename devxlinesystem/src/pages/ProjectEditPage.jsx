// src/pages/projects/ProjectEditPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  ArrowBack as ArrowBackIcon, 
  Save as SaveIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import { projectsApi } from '../api/projectsApi';
import { clientsApi } from '../api/clientsApi';
import usersAPI from '../api/users';

const ProjectEditPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { isDark } = useTheme();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const getCurrentUserId = () => {
    try {
      const userId = sessionStorage.getItem('userId');
      if (userId) return parseInt(userId, 10);
      const localUserId = localStorage.getItem('userId');
      if (localUserId) return parseInt(localUserId, 10);
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user && user.userId) return parseInt(user.userId, 10);
          if (user && user.id) return parseInt(user.id, 10);
        } catch (e) {}
      }
      return 1;
    } catch { return 1; }
  };

  const getCurrentUserName = () => {
    try {
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user) {
            const firstName = user.firstName || user.first_name || '';
            const lastName = user.lastName || user.last_name || '';
            const fullName = user.fullName || user.FullName || 
                           `${firstName} ${lastName}`.trim() || 
                           user.username || user.email || '';
            if (fullName) return fullName;
          }
        } catch (e) {}
      }
      const localUserStr = localStorage.getItem('user');
      if (localUserStr) {
        try {
          const user = JSON.parse(localUserStr);
          if (user) {
            const firstName = user.firstName || user.first_name || '';
            const lastName = user.lastName || user.last_name || '';
            const fullName = user.fullName || user.FullName || 
                           `${firstName} ${lastName}`.trim() || 
                           user.username || user.email || '';
            if (fullName) return fullName;
          }
        } catch (e) {}
      }
      return 'Hassan Nassif';
    } catch { return 'Hassan Nassif'; }
  };

  const [formData, setFormData] = useState({
    projectName: '',
    clientId: '',
    developer: getCurrentUserName(),
    manager: '',
    progress: 0,
    budget: '',
    deadline: '',
    status: 'Active',
    description: '',
    assigneeIds: [],
  });

  const statuses = [
    { value: 'Active', label: 'Active', color: 'green' },
    { value: 'On Hold', label: 'On Hold', color: 'yellow' },
    { value: 'Pending', label: 'Pending', color: 'orange' },
    { value: 'Completed', label: 'Completed', color: 'blue' }
  ];

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.fullName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.roleName?.toLowerCase().includes(searchLower)
    );
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAssigneeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch project details using projectsApi.getProject
      try {
        console.log(`📥 Fetching project with ID: ${projectId}`);
        const projectResponse = await projectsApi.getProject(projectId);
        console.log('📦 Project data received:', projectResponse.data);
        
        const projectData = projectResponse.data;
        
        // Format the date for the input field (YYYY-MM-DD)
        let formattedDeadline = '';
        if (projectData.deadline) {
          const date = new Date(projectData.deadline);
          if (!isNaN(date.getTime())) {
            formattedDeadline = date.toISOString().split('T')[0];
          }
        }

        // Get assignee IDs from the project data
        let assigneeIds = [];
        if (projectData.assigneeIds && Array.isArray(projectData.assigneeIds)) {
          assigneeIds = projectData.assigneeIds.map(id => id.toString());
        } else if (projectData.assignees && Array.isArray(projectData.assignees)) {
          assigneeIds = projectData.assignees.map(a => a.userId?.toString()).filter(Boolean);
        }

        // Populate form with project data - CREATE NEW OBJECT
        const newFormData = {
          projectName: projectData.projectName || projectData.name || '',
          clientId: projectData.clientId || projectData.client?.clientId || '',
          developer: projectData.developer || projectData.developerName || getCurrentUserName(),
          manager: projectData.manager || projectData.managerName || '',
          progress: projectData.progress || 0,
          budget: projectData.budget || projectData.budgetAmount || '',
          deadline: formattedDeadline,
          status: projectData.status || 'Active',
          description: projectData.description || '',
          assigneeIds: assigneeIds,
        };

        console.log('📋 Setting form data with:', newFormData);
        
        // Set the form data
        setFormData(newFormData);

      } catch (error) {
        console.error('Error fetching project:', error);
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to load project details',
          icon: 'error',
          background: isDark ? '#141c2b' : '#ffffff',
          color: isDark ? '#e8edf5' : '#0f172a',
          confirmButtonColor: '#3b82f6',
        });
        navigate('/projects');
        return;
      }

      // 2. Fetch clients
      try {
        const clientsResponse = await clientsApi.getClients();
        let clientsData = [];
        
        if (clientsResponse.data) {
          if (Array.isArray(clientsResponse.data)) {
            clientsData = clientsResponse.data;
          } else if (clientsResponse.data.data && Array.isArray(clientsResponse.data.data)) {
            clientsData = clientsResponse.data.data;
          } else if (clientsResponse.data.$values && Array.isArray(clientsResponse.data.$values)) {
            clientsData = clientsResponse.data.$values;
          } else {
            clientsData = clientsResponse.data;
          }
        } else if (Array.isArray(clientsResponse)) {
          clientsData = clientsResponse;
        }
        
        if (!Array.isArray(clientsData)) clientsData = [];
        
        const formattedClients = clientsData
          .filter(client => client)
          .map(client => ({
            clientId: client.clientId || client.id || client.ClientId || client.ID,
            businessName: client.businessName || client.BusinessName || client.companyName || 'Unknown Client',
          }))
          .filter(client => client.clientId);
        
        setClients(formattedClients);
        console.log('📋 Clients loaded:', formattedClients.length);
      } catch (clientError) {
        console.error('Error fetching clients:', clientError);
        setClients([]);
      }

      // 3. Fetch users
      try {
        const usersResponse = await usersAPI.getAll();
        let usersData = [];
        
        if (usersResponse.data) {
          if (Array.isArray(usersResponse.data)) {
            usersData = usersResponse.data;
          } else if (usersResponse.data.data && Array.isArray(usersResponse.data.data)) {
            usersData = usersResponse.data.data;
          } else if (usersResponse.data.items && Array.isArray(usersResponse.data.items)) {
            usersData = usersResponse.data.items;
          } else if (usersResponse.data.$values && Array.isArray(usersResponse.data.$values)) {
            usersData = usersResponse.data.$values;
          } else {
            usersData = usersResponse.data;
          }
        } else if (Array.isArray(usersResponse)) {
          usersData = usersResponse;
        } else if (usersResponse.$values && Array.isArray(usersResponse.$values)) {
          usersData = usersResponse.$values;
        }
        
        if (!Array.isArray(usersData)) usersData = [];
        
        const formattedUsers = usersData
          .filter(user => user)
          .map(user => {
            const userId = user.userId || user.id || user.user_id || user.UserId || user.ID;
            const firstName = user.firstName || user.first_name || user.FirstName || user.firstname || '';
            const lastName = user.lastName || user.last_name || user.LastName || user.lastname || '';
            const email = user.email || user.Email || user.emailAddress || '';
            const roleName = user.roleName || user.RoleName || user.role || user.Role || user.role_name || '';
            
            return {
              userId: userId,
              firstName: firstName,
              lastName: lastName,
              email: email,
              fullName: user.fullName || user.FullName || 
                        `${firstName} ${lastName}`.trim() || 
                        user.displayName || 
                        user.username ||
                        'Unknown User',
              isActive: user.isActive !== undefined ? user.isActive : 
                       (user.IsActive !== undefined ? user.IsActive : true),
              roleName: roleName,
              initials: `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || '?',
            };
          })
          .filter(user => user.userId && user.isActive !== false);
        
        setUsers(formattedUsers);
        console.log('📋 Users loaded:', formattedUsers.length);
      } catch (userError) {
        console.error('Error fetching users:', userError);
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load required data',
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name, value) => {
    const errors = {};
    
    switch(name) {
      case 'projectName':
        if (!value?.trim()) {
          errors.projectName = 'Project name is required';
        } else if (value.trim().length < 3) {
          errors.projectName = 'Project name must be at least 3 characters';
        }
        break;
      case 'clientId':
        if (!value) {
          errors.clientId = 'Please select a client';
        }
        break;
      case 'manager':
        if (!value?.trim()) {
          errors.manager = 'Manager name is required';
        }
        break;
      case 'budget':
        if (!value || parseFloat(value) <= 0) {
          errors.budget = 'Budget must be greater than 0';
        }
        break;
      case 'deadline':
        if (!value) {
          errors.deadline = 'Deadline is required';
        } else {
          const deadlineDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (deadlineDate <= today) {
            errors.deadline = 'Deadline must be in the future';
          }
        }
        break;
      default:
        break;
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'developer') return;
    
    setFormData({ ...formData, [name]: value });
    
    const errors = validateField(name, value);
    setFormErrors(prev => ({ ...prev, ...errors }));
  };

  const toggleAssignee = (userId) => {
    const userIdStr = userId.toString();
    setFormData(prev => {
      const currentIds = prev.assigneeIds || [];
      if (currentIds.includes(userIdStr)) {
        return { ...prev, assigneeIds: currentIds.filter(id => id !== userIdStr) };
      } else {
        return { ...prev, assigneeIds: [...currentIds, userIdStr] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['projectName', 'clientId', 'manager', 'budget', 'deadline'];
    let hasError = false;
    
    requiredFields.forEach(field => {
      const errors = validateField(field, formData[field]);
      if (Object.keys(errors).length > 0) {
        setFormErrors(prev => ({ ...prev, ...errors }));
        hasError = true;
      }
    });
    
    if (hasError) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fill in all required fields correctly',
        icon: 'warning',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    // Check if assignees are selected - show warning but allow continue
    if (!formData.assigneeIds || formData.assigneeIds.length === 0) {
      const result = await Swal.fire({
        title: 'No Team Members Assigned',
        text: 'You haven\'t assigned any team members. Would you like to continue?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, continue',
        cancelButtonText: 'Go back and add',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280',
      });
      
      if (!result.isConfirmed) {
        setShowAssigneeDropdown(true);
        return;
      }
    }

    await updateProject();
  };

  const updateProject = async () => {
    try {
      setIsSubmitting(true);
      
      Swal.fire({
        title: 'Updating Project...',
        text: 'Please wait',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
      });
      
      const currentUserId = getCurrentUserId();
      const currentUserName = getCurrentUserName();
      
      const assigneeIds = (formData.assigneeIds || [])
        .map(id => parseInt(id, 10))
        .filter(id => !isNaN(id) && id > 0);
      
      const projectData = {
        projectName: formData.projectName.trim(),
        clientId: parseInt(formData.clientId, 10),
        developer: formData.developer || currentUserName || 'Hassan Nassif',
        manager: formData.manager.trim(),
        progress: parseInt(formData.progress, 10) || 0,
        budget: parseFloat(formData.budget) || 0,
        deadline: new Date(formData.deadline).toISOString(),
        status: formData.status || 'Active',
        description: formData.description?.trim() || '',
        assigneeIds: assigneeIds,
      };

      console.log('📤 Updating project with data:', JSON.stringify(projectData, null, 2));

      const response = await projectsApi.updateProject(projectId, projectData);
      console.log('✅ Project updated:', response.data);
      
      Swal.close();
      
      await Swal.fire({
        title: '✅ Project Updated!',
        text: `"${projectData.projectName}" has been updated successfully.`,
        icon: 'success',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
        timer: 3000,
        timerProgressBar: true,
      });
      
      navigate('/projects');
    } catch (error) {
      Swal.close();
      console.error('❌ Error updating project:', error);
      
      let errorMessage = 'Failed to update project';
      if (error.response) {
        console.error('Error response:', error.response.data);
        errorMessage = error.response.data?.message || 
                       error.response.data?.title || 
                       error.response.statusText || 
                       errorMessage;
        
        if (error.response.data?.errors) {
          const errors = Object.values(error.response.data.errors).flat();
          errorMessage = errors.join('\n');
        }
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
      setIsSubmitting(false);
    }
  };

  const inputClass = `w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
    isDark 
      ? 'bg-[#1a2438] border-[#1e2d45] text-white placeholder-gray-500' 
      : 'bg-white border-gray-300 text-gray-900'
  }`;

  const labelClass = `block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`;
  const errorClass = `text-sm text-red-500 mt-1`;

  if (loading) {
    return (
      <div className={`rounded-xl p-6 border ${isDark ? 'bg-[#141c2b] border-[#1e2d45]' : 'bg-white border-gray-200'}`}>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Loading project details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-6 border transition-theme ${
      isDark ? 'bg-[#141c2b] border-[#1e2d45]' : 'bg-white border-gray-200 shadow-card'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/projects')}
            className={`p-2 rounded-lg transition ${
              isDark ? 'hover:bg-[#1a2438] text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <ArrowBackIcon />
          </button>
          <div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Edit Project
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Update project details and team members
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-sm px-3 py-1 rounded-full ${
            isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
          }`}>
            ID: #{projectId}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Project Name */}
            <div>
              <label className={labelClass}>
                <span className="flex items-center space-x-2">
                  <span>Project Name</span>
                  <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                className={`${inputClass} ${formErrors.projectName ? 'border-red-500' : ''}`}
                placeholder="Enter a descriptive project name"
              />
              {formErrors.projectName && (
                <p className={errorClass}>{formErrors.projectName}</p>
              )}
            </div>

            {/* Client & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  <span className="flex items-center space-x-2">
                    <BusinessIcon className="w-4 h-4" />
                    <span>Client</span>
                  </span>
                  <span className="text-red-500">*</span>
                </label>
                <select
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  className={`${inputClass} ${formErrors.clientId ? 'border-red-500' : ''}`}
                >
                  <option value="">Select Client</option>
                  {clients.map((client) => (
                    <option key={client.clientId} value={client.clientId}>
                      {client.businessName}
                    </option>
                  ))}
                </select>
                {formErrors.clientId && (
                  <p className={errorClass}>{formErrors.clientId}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Manager & Developer */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  <span className="flex items-center space-x-2">
                    <PersonIcon className="w-4 h-4" />
                    <span>Project Manager</span>
                  </span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="manager"
                  value={formData.manager}
                  onChange={handleChange}
                  className={`${inputClass} ${formErrors.manager ? 'border-red-500' : ''}`}
                  placeholder="Enter manager name"
                />
                {formErrors.manager && (
                  <p className={errorClass}>{formErrors.manager}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>
                  <span className="flex items-center space-x-2">
                    <PersonIcon className="w-4 h-4" />
                    <span>Developer</span>
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.developer || getCurrentUserName()}
                  className={`${inputClass} ${isDark ? 'bg-[#1a2438]/50' : 'bg-gray-100'} cursor-not-allowed`}
                  disabled
                  readOnly
                />
              </div>
            </div>

            {/* Budget & Deadline */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  <span className="flex items-center space-x-2">
                    <MoneyIcon className="w-4 h-4" />
                    <span>Budget</span>
                  </span>
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>$</span>
                  <input
                    type="number"
                    name="budget"
                    min="0"
                    step="0.01"
                    value={formData.budget}
                    onChange={handleChange}
                    className={`${inputClass} pl-8 ${formErrors.budget ? 'border-red-500' : ''}`}
                    placeholder="0.00"
                  />
                </div>
                {formErrors.budget && (
                  <p className={errorClass}>{formErrors.budget}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>
                  <span className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Deadline</span>
                  </span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className={`${inputClass} ${formErrors.deadline ? 'border-red-500' : ''}`}
                />
                {formErrors.deadline && (
                  <p className={errorClass}>{formErrors.deadline}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Assign Team Members */}
            <div>
              <label className={labelClass}>
                <span className="flex items-center space-x-2">
                  <PeopleIcon className="w-4 h-4" />
                  <span>Assign Team Members</span>
                </span>
                <span className="text-sm font-normal text-gray-400"> (Optional)</span>
              </label>
              
              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                  className={`w-full px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                    isDark 
                      ? 'bg-[#1a2438] border-[#1e2d45] text-white hover:border-blue-500' 
                      : 'bg-white border-gray-300 text-gray-900 hover:border-blue-400'
                  } ${showAssigneeDropdown ? 'ring-2 ring-blue-500 border-transparent' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      {formData.assigneeIds && formData.assigneeIds.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {formData.assigneeIds.slice(0, 3).map((userId) => {
                            const user = users.find(u => u.userId == userId);
                            if (!user) return null;
                            return (
                              <span
                                key={userId}
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                  isDark ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {user.initials} {user.firstName}
                              </span>
                            );
                          })}
                          {formData.assigneeIds.length > 3 && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              isDark ? 'bg-[#1e2d45] text-gray-400' : 'bg-gray-100 text-gray-600'
                            }`}>
                              +{formData.assigneeIds.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                          Click to select team members...
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      {formData.assigneeIds && formData.assigneeIds.length > 0 && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {formData.assigneeIds.length}
                        </span>
                      )}
                      <svg 
                        className={`w-5 h-5 transition-transform duration-200 ${
                          showAssigneeDropdown ? 'rotate-180' : ''
                        } ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Dropdown */}
                {showAssigneeDropdown && (
                  <div className={`absolute z-20 w-full mt-1 rounded-xl shadow-2xl border overflow-hidden ${
                    isDark ? 'bg-[#1a2438] border-[#1e2d45]' : 'bg-white border-gray-200'
                  }`}>
                    <div className="p-3 border-b border-gray-200 dark:border-[#1e2d45]">
                      <div className="relative">
                        <svg className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                          isDark ? 'text-gray-500' : 'text-gray-400'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="text"
                          placeholder="Search team members..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className={`w-full pl-9 pr-4 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 ${
                            isDark 
                              ? 'bg-[#141c2b] border-[#1e2d45] text-white placeholder-gray-500' 
                              : 'bg-gray-50 border-gray-200 text-gray-900'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="max-h-64 overflow-y-auto">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => {
                          const isSelected = formData.assigneeIds?.includes(user.userId.toString()) || false;
                          return (
                            <div
                              key={user.userId}
                              onClick={() => toggleAssignee(user.userId)}
                              className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all ${
                                isSelected 
                                  ? isDark ? 'bg-blue-900/20' : 'bg-blue-50'
                                  : isDark ? 'hover:bg-[#1e2d45]' : 'hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center space-x-3 min-w-0">
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                                  isSelected
                                    ? 'bg-blue-500 text-white'
                                    : isDark ? 'bg-[#1e2d45] text-white' : 'bg-gray-200 text-gray-700'
                                }`}>
                                  {user.initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2">
                                    <span className={`font-medium truncate ${
                                      isDark ? 'text-white' : 'text-gray-900'
                                    }`}>
                                      {user.fullName}
                                    </span>
                                    {user.roleName && (
                                      <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full ${
                                        isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
                                      }`}>
                                        {user.roleName}
                                      </span>
                                    )}
                                  </div>
                                  <div className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {user.email}
                                  </div>
                                </div>
                              </div>
                              <div className="flex-shrink-0 ml-2">
                                {isSelected ? (
                                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                                    <CheckCircleIcon className="w-3 h-3 text-white" />
                                  </div>
                                ) : (
                                  <div className={`w-5 h-5 rounded-full border-2 ${
                                    isDark ? 'border-[#1e2d45]' : 'border-gray-300'
                                  }`} />
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className={`px-4 py-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          <div className="text-4xl mb-2">👤</div>
                          <p className="text-sm">No users found</p>
                        </div>
                      )}
                    </div>

                    <div className={`flex items-center justify-between px-4 py-2 border-t ${
                      isDark ? 'border-[#1e2d45]' : 'border-gray-200'
                    }`}>
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formData.assigneeIds?.length || 0} selected
                      </span>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, assigneeIds: [] });
                            setShowAssigneeDropdown(false);
                          }}
                          className={`text-xs px-3 py-1 rounded-lg transition ${
                            isDark ? 'text-gray-400 hover:bg-[#1e2d45]' : 'text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          Clear All
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const allUserIds = users.map(u => u.userId.toString());
                            setFormData({ ...formData, assigneeIds: allUserIds });
                          }}
                          className={`text-xs px-3 py-1 rounded-lg transition ${
                            isDark ? 'text-blue-400 hover:bg-blue-900/20' : 'text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          Select All
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Users Display */}
              {formData.assigneeIds && formData.assigneeIds.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {formData.assigneeIds.map((userId) => {
                      const user = users.find(u => u.userId == userId);
                      if (!user) return null;
                      return (
                        <div
                          key={userId}
                          className={`group inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg border ${
                            isDark 
                              ? 'bg-[#1a2438] border-[#1e2d45]' 
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            isDark ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {user.initials}
                          </div>
                          <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {user.fullName}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                assigneeIds: formData.assigneeIds.filter(id => id !== userId)
                              });
                            }}
                            className={`opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 ${
                              isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-500'
                            }`}
                          >
                            <CloseIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>
                <span className="flex items-center space-x-2">
                  <DescriptionIcon className="w-4 h-4" />
                  <span>Description</span>
                </span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className={`${inputClass} resize-none`}
                placeholder="Enter project description, goals, and key deliverables..."
              />
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className={`p-4 rounded-xl ${isDark ? 'bg-[#1a2438]' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Project Progress
            </span>
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {formData.progress}%
            </span>
          </div>
          <input
            type="range"
            name="progress"
            min="0"
            max="100"
            value={formData.progress}
            onChange={handleChange}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-blue-500"
          />
          <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Progress will update automatically as tasks are completed
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-[#1e2d45]">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className={`px-6 py-2.5 rounded-xl transition ${
              isDark 
                ? 'border border-[#1e2d45] text-gray-400 hover:bg-[#1a2438] hover:text-white' 
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg shadow-blue-500/25"
          >
            <SaveIcon className="w-5 h-5" />
            <span>{isSubmitting ? 'Updating...' : 'Update Project'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectEditPage;