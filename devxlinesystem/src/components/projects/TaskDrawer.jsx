// src/pages/projects/TaskDrawer.jsx - Add TaskProgressBar at the top of the task list
import React, { useState, useEffect } from 'react';
import { 
  Close as CloseIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Schedule as ScheduleIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AccessTime as AccessTimeIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';
import { tasksApi } from '../../api/tasksApi';
import usersAPI from '../../api/users';
import Swal from 'sweetalert2';
import TaskProgressBar from './TaskProgressBar'; // Import the component

const TaskDrawer = ({ project, onClose, onUpdate }) => {
  const { isDark } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const getCurrentUserId = () => {
    try {
      const userId = sessionStorage.getItem('userId');
      if (userId) {
        return parseInt(userId, 10);
      }
      
      const localUserId = localStorage.getItem('userId');
      if (localUserId) {
        return parseInt(localUserId, 10);
      }
      
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user && user.userId) {
            return parseInt(user.userId, 10);
          }
          if (user && user.id) {
            return parseInt(user.id, 10);
          }
        } catch (e) {
          console.warn('Failed to parse user from sessionStorage:', e);
        }
      }
      
      const localUserStr = localStorage.getItem('user');
      if (localUserStr) {
        try {
          const user = JSON.parse(localUserStr);
          if (user && user.userId) {
            return parseInt(user.userId, 10);
          }
          if (user && user.id) {
            return parseInt(user.id, 10);
          }
        } catch (e) {
          console.warn('Failed to parse user from localStorage:', e);
        }
      }
      
      return 1;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return 1;
    }
  };
  
  const [formData, setFormData] = useState({
    taskName: '',
    projectId: project.projectId || project.id,
    startDateTime: '',
    endDateTime: '',
    assignedTo: '',
    assignedBy: getCurrentUserId(),
    status: 'Pending',
  });

  const statusOptions = ['Pending', 'In Progress', 'Completed', 'On Hold'];
  
  const statusColors = {
    'Pending': 'bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30',
    'In Progress': 'bg-blue-500/10 text-blue-600 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30',
    'Completed': 'bg-green-500/10 text-green-600 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30',
    'On Hold': 'bg-orange-500/10 text-orange-600 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30',
  };

  const statusIcons = {
    'Pending': <ScheduleIcon className="w-4 h-4" />,
    'In Progress': <PlayArrowIcon className="w-4 h-4" />,
    'Completed': <CheckCircleIcon className="w-4 h-4" />,
    'On Hold': <PauseIcon className="w-4 h-4" />,
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [project]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      console.log('Fetching users for task assignment...');
      const response = await usersAPI.getAll();
      console.log('Users API Response:', response);
      
      let usersData = [];
      
      if (response.data) {
        if (Array.isArray(response.data)) {
          usersData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          usersData = response.data.data;
        } else if (response.data.$values && Array.isArray(response.data.$values)) {
          usersData = response.data.$values;
        } else if (response.data.items && Array.isArray(response.data.items)) {
          usersData = response.data.items;
        } else {
          if (response.data.users && Array.isArray(response.data.users)) {
            usersData = response.data.users;
          } else {
            usersData = response.data;
          }
        }
      } else if (Array.isArray(response)) {
        usersData = response;
      } else if (response.$values && Array.isArray(response.$values)) {
        usersData = response.$values;
      }
      
      if (!Array.isArray(usersData)) {
        usersData = [];
      }
      
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
      console.log('Formatted users:', formattedUsers.length, 'users loaded');
      
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksApi.getTasksByProject(project.projectId || project.id);
      console.log('Tasks response:', response);
      const tasksData = response.data.data || response.data || [];
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.taskName.trim()) {
      errors.taskName = 'Task name is required';
    }
    
    if (!formData.assignedTo) {
      errors.assignedTo = 'Please assign the task to a user';
    }
    
    if (!formData.startDateTime) {
      errors.startDateTime = 'Start date is required';
    }
    
    if (!formData.endDateTime) {
      errors.endDateTime = 'End date is required';
    }
    
    if (formData.startDateTime && formData.endDateTime) {
      const start = new Date(formData.startDateTime);
      const end = new Date(formData.endDateTime);
      if (end <= start) {
        errors.endDateTime = 'End date must be after start date';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fix the errors in the form',
        icon: 'warning',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const startDate = new Date(formData.startDateTime);
      const endDate = new Date(formData.endDateTime);
      
      const taskData = {
        taskName: formData.taskName.trim(),
        projectId: parseInt(formData.projectId),
        assignedTo: parseInt(formData.assignedTo),
        assignedBy: parseInt(formData.assignedBy),
        startDateTime: startDate.toISOString(),
        endDateTime: endDate.toISOString(),
        status: formData.status,
      };

      console.log('Creating task with data:', taskData);

      await tasksApi.createTask(taskData);
      
      Swal.fire({
        title: 'Success!',
        text: 'Task created successfully',
        icon: 'success',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
        timer: 1500,
        timerProgressBar: true,
      });
      
      setShowAddTask(false);
      setFormData({
        taskName: '',
        projectId: project.projectId || project.id,
        startDateTime: '',
        endDateTime: '',
        assignedTo: '',
        assignedBy: getCurrentUserId(),
        status: 'Pending',
      });
      setFormErrors({});
      fetchTasks();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error creating task:', error);
      
      let errorMessage = 'Failed to create task';
      if (error.response) {
        console.error('Error response:', error.response.data);
        errorMessage = error.response.data?.message || error.response.data?.title || errorMessage;
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

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await tasksApi.updateTaskStatus(taskId, newStatus);
      fetchTasks();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating task status:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update task status',
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
    }
  };

  const handleDeleteTask = async (taskId) => {
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
        await tasksApi.deleteTask(taskId);
        Swal.fire({
          title: 'Deleted!',
          text: 'Task has been deleted',
          icon: 'success',
          background: isDark ? '#141c2b' : '#ffffff',
          color: isDark ? '#e8edf5' : '#0f172a',
          confirmButtonColor: '#3b82f6',
          timer: 1500,
          timerProgressBar: true,
        });
        fetchTasks();
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error('Error deleting task:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete task',
          icon: 'error',
          background: isDark ? '#141c2b' : '#ffffff',
          color: isDark ? '#e8edf5' : '#0f172a',
          confirmButtonColor: '#3b82f6',
        });
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTaskProgress = (task) => {
    if (task.status === 'Completed') return 100;
    if (task.status === 'In Progress') return 50;
    if (task.status === 'On Hold') return 25;
    return 0;
  };

  const isOverdue = (endDateTime) => {
    if (!endDateTime) return false;
    return new Date(endDateTime) < new Date();
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className={`flex items-center justify-between p-6 border-b ${
        isDark ? 'border-[#1e2d45]' : 'border-gray-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {project.projectName || project.name}
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddTask(!showAddTask)}
            className={`p-2.5 rounded-lg transition flex items-center space-x-2 ${
              showAddTask 
                ? isDark ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
                : isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {showAddTask ? (
              <CloseIcon className="w-5 h-5" />
            ) : (
              <AddIcon className="w-5 h-5" />
            )}
            <span className="hidden sm:inline">{showAddTask ? 'Cancel' : 'Add Task'}</span>
          </button>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition ${
              isDark ? 'hover:bg-[#1e2d45] text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Add Task Form */}
        {showAddTask && (
          <div className={`rounded-xl p-6 border ${
            isDark ? 'bg-[#1a2438] border-[#1e2d45]' : 'bg-gray-50 border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              New Task
            </h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Task Name *
                </label>
                <input
                  type="text"
                  value={formData.taskName}
                  onChange={(e) => {
                    setFormData({...formData, taskName: e.target.value});
                    if (formErrors.taskName) {
                      setFormErrors({...formErrors, taskName: null});
                    }
                  }}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    isDark 
                      ? 'bg-[#141c2b] border-[#1e2d45] text-white placeholder-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } ${formErrors.taskName ? 'border-red-500' : ''}`}
                  placeholder="Enter task name"
                  required
                />
                {formErrors.taskName && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.taskName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Start Date *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startDateTime}
                    onChange={(e) => {
                      setFormData({...formData, startDateTime: e.target.value});
                      if (formErrors.startDateTime) {
                        setFormErrors({...formErrors, startDateTime: null});
                      }
                    }}
                    min={getMinDateTime()}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      isDark 
                        ? 'bg-[#141c2b] border-[#1e2d45] text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } ${formErrors.startDateTime ? 'border-red-500' : ''}`}
                    required
                  />
                  {formErrors.startDateTime && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.startDateTime}</p>
                  )}
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    End Date *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endDateTime}
                    onChange={(e) => {
                      setFormData({...formData, endDateTime: e.target.value});
                      if (formErrors.endDateTime) {
                        setFormErrors({...formErrors, endDateTime: null});
                      }
                    }}
                    min={formData.startDateTime || getMinDateTime()}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      isDark 
                        ? 'bg-[#141c2b] border-[#1e2d45] text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } ${formErrors.endDateTime ? 'border-red-500' : ''}`}
                    required
                  />
                  {formErrors.endDateTime && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.endDateTime}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Assign To *
                  </label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => {
                      setFormData({...formData, assignedTo: e.target.value});
                      if (formErrors.assignedTo) {
                        setFormErrors({...formErrors, assignedTo: null});
                      }
                    }}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      isDark 
                        ? 'bg-[#141c2b] border-[#1e2d45] text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } ${formErrors.assignedTo ? 'border-red-500' : ''}`}
                    required
                    disabled={loadingUsers}
                  >
                    <option value="">{loadingUsers ? 'Loading users...' : 'Select user'}</option>
                    {users.map((user) => (
                      <option key={user.userId} value={user.userId}>
                        {user.fullName} {user.email ? `(${user.email})` : ''}
                      </option>
                    ))}
                  </select>
                  {formErrors.assignedTo && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.assignedTo}</p>
                  )}
                  {users.length === 0 && !loadingUsers && (
                    <p className={`text-xs mt-1 ${isDark ? 'text-yellow-500' : 'text-yellow-600'}`}>
                      No users available. Please check the users API.
                    </p>
                  )}
                  {loadingUsers && (
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Loading users...
                    </p>
                  )}
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      isDark 
                        ? 'bg-[#141c2b] border-[#1e2d45] text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddTask(false);
                    setFormErrors({});
                  }}
                  className={`px-4 py-2 rounded-lg transition ${
                    isDark 
                      ? 'border border-[#1e2d45] text-gray-400 hover:bg-[#1a2438]' 
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition font-medium shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Task List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              No tasks yet. Create your first task!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* TaskProgressBar - Full version with labels */}
            <div className={`rounded-xl p-4 ${
              isDark ? 'bg-[#1a2438] border border-[#1e2d45]' : 'bg-gray-50 border border-gray-200'
            }`}>
              <TaskProgressBar 
                tasks={tasks} 
                showLabels={true}
                compact={false}
              />
            </div>

            {/* Task list items */}
            {tasks.map((task) => {
              const taskId = task.taskId || task.id;
              const isTaskOverdue = isOverdue(task.endDateTime || task.endDate) && task.status !== 'Completed';
              
              return (
                <div
                  key={taskId}
                  className={`rounded-xl p-5 border transition-all hover:shadow-lg ${
                    isDark 
                      ? 'bg-[#1a2438] border-[#1e2d45] hover:border-blue-500/30' 
                      : 'bg-white border-gray-200 hover:border-blue-300'
                  } ${isTaskOverdue ? 'border-red-500/50 dark:border-red-500/30' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1.5 border ${
                          statusColors[task.status] || statusColors['Pending']
                        }`}>
                          {statusIcons[task.status]}
                          <span>{task.status}</span>
                        </div>
                        {isTaskOverdue && (
                          <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-600 border border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30">
                            ⚠️ Overdue
                          </div>
                        )}
                      </div>
                      
                      <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {task.taskName || task.name}
                      </h4>
                      
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center space-x-1.5">
                          <PersonIcon className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            {task.assignedToName || 'Unassigned'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <CalendarIcon className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            {formatDate(task.endDateTime || task.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <AccessTimeIcon className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            {formatTime(task.endDateTime || task.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <select
                        value={task.status}
                        onChange={(e) => handleUpdateTaskStatus(taskId, e.target.value)}
                        className={`text-xs px-3 py-1.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDark 
                            ? 'bg-[#141c2b] border-[#1e2d45] text-white' 
                            : 'bg-white border-gray-300 text-gray-700'
                        }`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      
                      <button
                        onClick={() => handleDeleteTask(taskId)}
                        className={`p-1.5 rounded-lg transition ${
                          isDark ? 'hover:bg-[#1e2d45] text-gray-400 hover:text-red-400' : 'hover:bg-gray-100 text-gray-500 hover:text-red-500'
                        }`}
                        title="Delete task"
                      >
                        <DeleteIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Task progress bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Progress
                      </span>
                      <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {getTaskProgress(task)}%
                      </span>
                    </div>
                    <div className={`w-full rounded-full h-2 ${isDark ? 'bg-[#1e2d45]' : 'bg-gray-200'}`}>
                      <div
                        className={`h-2 rounded-full transition-all duration-700 ${
                          task.status === 'Completed' ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                          task.status === 'In Progress' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                          task.status === 'On Hold' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 
                          'bg-gradient-to-r from-gray-400 to-gray-500'
                        }`}
                        style={{ width: `${getTaskProgress(task)}%` }}
                      />
                    </div>
                  </div>

                  {/* Task dates */}
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-4">
                      <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                        Start: {formatDate(task.startDateTime) || 'N/A'}
                      </span>
                      <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                        End: {formatDate(task.endDateTime) || 'N/A'}
                      </span>
                    </div>
                    {task.createdDate && (
                      <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                        Created: {formatDate(task.createdDate)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Stats - Can be removed or kept for additional info */}
      <div className={`p-4 border-t ${isDark ? 'border-[#1e2d45]' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div>
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Total</span>
              <span className={`ml-2 font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {tasks.length}
              </span>
            </div>
            <div>
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Completed</span>
              <span className={`ml-2 font-medium text-green-500`}>
                {tasks.filter(t => t.status === 'Completed').length}
              </span>
            </div>
            <div>
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>In Progress</span>
              <span className={`ml-2 font-medium text-blue-500`}>
                {tasks.filter(t => t.status === 'In Progress').length}
              </span>
            </div>
            <div>
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Pending</span>
              <span className={`ml-2 font-medium text-yellow-500`}>
                {tasks.filter(t => t.status === 'Pending').length}
              </span>
            </div>
          </div>
          {tasks.length > 0 && (
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Progress: {Math.round((tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDrawer;