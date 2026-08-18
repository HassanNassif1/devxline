import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { tasksApi } from '../api/tasksApi';
import { projectsApi } from '../api/projectsApi';
import UsersAPI from '../api/users';

const TaskEditPage = () => {
  const navigate = useNavigate();
  const { taskId, projectId } = useParams();
  const { isDark } = useTheme();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    taskName: '',
    projectId: '',
    startDateTime: '',
    endDateTime: '',
    assignedTo: '',
    assignedBy: parseInt(localStorage.getItem('userId')) || 1,
    status: 'Pending',
    description: '',
  });

  const statuses = ['Pending', 'In Progress', 'Completed', 'On Hold'];

  useEffect(() => {
    fetchData();
  }, [taskId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch task details
      const taskResponse = await tasksApi.getTask(taskId);
      const taskData = taskResponse.data.data || taskResponse.data;
      console.log('Task Data:', taskData);
      
      // Fetch projects
      try {
        const projectsResponse = await projectsApi.getProjects();
        const projectsData = projectsResponse.data?.data || projectsResponse.data || [];
        setProjects(Array.isArray(projectsData) ? projectsData : []);
        console.log('Projects loaded:', projectsData.length);
      } catch (projectError) {
        console.error('Error fetching projects:', projectError);
        setProjects([]);
      }
      
      // Fetch users with robust parsing
      try {
        const usersResponse = await UsersAPI.getAll();
        console.log('Users API Response Status:', usersResponse.status);
        console.log('Users API Response Data:', usersResponse.data);
        
        // Parse the response - handle different formats
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
        
        // Ensure we have an array
        if (!Array.isArray(usersData)) {
          usersData = [];
        }
        
        console.log('Raw users data:', usersData);
        
        // Format users for display - try different property names
        const formattedUsers = usersData
          .filter(user => user) // Remove null/undefined
          .map(user => {
            // Try different property names
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
                        'Unknown User',
              isActive: user.isActive !== undefined ? user.isActive : 
                       (user.IsActive !== undefined ? user.IsActive : 
                       (user.status === 'Active' || user.status === 'active')),
              department: user.department || user.Department || '',
              roleName: roleName,
            };
          })
          .filter(user => user.userId); // Only keep users with an ID
        
        setUsers(formattedUsers);
        console.log('Formatted users:', formattedUsers.length, 'users loaded');
        
      } catch (userError) {
        console.error('Error fetching users:', userError);
        console.error('Error details:', {
          message: userError.message,
          response: userError.response,
          config: userError.config,
        });
        setUsers([]);
        
        // Show warning but don't block the page
        Swal.fire({
          title: 'Warning',
          text: 'Could not load users list. You can still edit the task.',
          icon: 'warning',
          background: isDark ? '#141c2b' : '#ffffff',
          color: isDark ? '#e8edf5' : '#0f172a',
          confirmButtonColor: '#3b82f6',
        });
      }
      
      // Populate form with task data
      setFormData({
        taskName: taskData.taskName || taskData.name || '',
        projectId: taskData.projectId || '',
        startDateTime: taskData.startDateTime || taskData.startDate ? 
          new Date(taskData.startDateTime || taskData.startDate).toISOString().slice(0, 16) : '',
        endDateTime: taskData.endDateTime || taskData.endDate ? 
          new Date(taskData.endDateTime || taskData.endDate).toISOString().slice(0, 16) : '',
        assignedTo: taskData.assignedTo || '',
        assignedBy: taskData.assignedBy || parseInt(localStorage.getItem('userId')) || 1,
        status: taskData.status || 'Pending',
        description: taskData.description || taskData.taskDescription || '',
      });
      
    } catch (error) {
      console.error('Error fetching task:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load task details',
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
      navigate(projectId ? `/projects/${projectId}/tasks` : '/tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.taskName.trim()) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Task name is required',
        icon: 'warning',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    if (!formData.projectId) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please select a project',
        icon: 'warning',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    if (!formData.startDateTime || !formData.endDateTime) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please set both start and end dates',
        icon: 'warning',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    const startDate = new Date(formData.startDateTime);
    const endDate = new Date(formData.endDateTime);
    
    if (startDate >= endDate) {
      Swal.fire({
        title: 'Invalid Dates!',
        text: 'End date must be after start date',
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    if (!formData.assignedTo) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please assign the task to someone',
        icon: 'warning',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const taskData = {
        taskName: formData.taskName.trim(),
        projectId: parseInt(formData.projectId),
        startDateTime: new Date(formData.startDateTime).toISOString(),
        endDateTime: new Date(formData.endDateTime).toISOString(),
        assignedTo: parseInt(formData.assignedTo),
        assignedBy: formData.assignedBy,
        status: formData.status,
        description: formData.description?.trim() || '',
      };

      await tasksApi.updateTask(taskId, taskData);
      
      await Swal.fire({
        title: 'Success!',
        text: 'Task updated successfully',
        icon: 'success',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
        timer: 2000,
        timerProgressBar: true,
      });
      
      if (projectId) {
        navigate(`/projects/${projectId}/tasks`);
      } else {
        navigate('/tasks');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update task';
      const errors = error.response?.data?.errors;
      
      let errorText = errorMessage;
      if (errors && Array.isArray(errors)) {
        errorText = errors.join('\n');
      }
      
      Swal.fire({
        title: 'Error!',
        text: errorText,
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Delete Task?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it',
      background: isDark ? '#141c2b' : '#ffffff',
      color: isDark ? '#e8edf5' : '#0f172a',
    });

    if (result.isConfirmed) {
      try {
        setIsSubmitting(true);
        await tasksApi.deleteTask(taskId);
        
        await Swal.fire({
          title: 'Deleted!',
          text: 'Task has been deleted successfully',
          icon: 'success',
          background: isDark ? '#141c2b' : '#ffffff',
          color: isDark ? '#e8edf5' : '#0f172a',
          confirmButtonColor: '#3b82f6',
          timer: 1500,
          timerProgressBar: true,
        });
        
        if (projectId) {
          navigate(`/projects/${projectId}/tasks`);
        } else {
          navigate('/tasks');
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to delete task';
        await Swal.fire({
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
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const inputClass = `w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
    isDark 
      ? 'bg-[#1a2438] border-[#1e2d45] text-white placeholder-gray-500' 
      : 'bg-white border-gray-300 text-gray-900'
  }`;

  const labelClass = `block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-6 border transition-theme ${
      isDark ? 'bg-[#141c2b] border-[#1e2d45]' : 'bg-white border-gray-200 shadow-card'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(projectId ? `/projects/${projectId}/tasks` : '/tasks')}
            className={`p-2 rounded-lg transition ${
              isDark ? 'hover:bg-[#1a2438] text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <ArrowBackIcon />
          </button>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Edit Task
          </h2>
        </div>
        <button
          onClick={handleDelete}
          disabled={isSubmitting}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <DeleteIcon className="w-5 h-5" />
          <span>Delete</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className={labelClass}>Task Name *</label>
            <input
              type="text"
              name="taskName"
              value={formData.taskName}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter task name"
              required
            />
          </div>

          <div>
            <label className={labelClass}>Project *</label>
            <select
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className={inputClass}
              required
              disabled={!!projectId}
            >
              <option value="">Select Project</option>
              {projects.length > 0 ? (
                projects.map((project) => (
                  <option 
                    key={project.projectId || project.id} 
                    value={project.projectId || project.id}
                  >
                    {project.projectName || project.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>Loading projects...</option>
              )}
            </select>
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
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Start Date & Time *</label>
            <input
              type="datetime-local"
              name="startDateTime"
              value={formData.startDateTime}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>End Date & Time *</label>
            <input
              type="datetime-local"
              name="endDateTime"
              value={formData.endDateTime}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Assigned To *</label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select Assignee</option>
              {users.length > 0 ? (
                users.map((user) => (
                  <option key={user.userId} value={user.userId}>
                    {user.fullName || `${user.firstName} ${user.lastName}`}
                    {user.email ? ` (${user.email})` : ''}
                    {user.roleName ? ` - ${user.roleName}` : ''}
                  </option>
                ))
              ) : (
                <option value="" disabled>No users available</option>
              )}
            </select>
            {users.length === 0 && (
              <p className="text-xs text-yellow-500 mt-1">
                No users loaded. Please check the users API.
              </p>
            )}
            {users.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {users.length} user{users.length !== 1 ? 's' : ''} available
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className={inputClass}
              placeholder="Enter task description (optional)"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-[#1e2d45]">
          <button
            type="button"
            onClick={() => navigate(projectId ? `/projects/${projectId}/tasks` : '/tasks')}
            className={`px-6 py-2.5 rounded-lg transition ${
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
            className="btn-primary px-6 py-2.5 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <SaveIcon className="w-5 h-5" />
            <span>{isSubmitting ? 'Updating...' : 'Update Task'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskEditPage;