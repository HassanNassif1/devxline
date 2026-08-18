// src/pages/projects/TaskPage.jsx - Enhanced Tech Vibes Edition
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Schedule as ScheduleIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AccessTime as AccessTimeIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  DragIndicator as DragIcon,
  TrendingUp as TrendingUpIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  Speed as SpeedIcon,
  Analytics as AnalyticsIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  ErrorOutline as ErrorOutlineIcon
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import { tasksApi } from '../api/tasksApi';
import { projectsApi } from '../api/projectsApi';
import usersAPI from '../api/users';
import Swal from 'sweetalert2';
import TaskProgressBar from '../components/projects/TaskProgressBar';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TaskPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { isDark } = useTheme();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [selectedPriority, setSelectedPriority] = useState('All');
  
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

  const [formData, setFormData] = useState({
    taskName: '',
    projectId: parseInt(projectId),
    startDateTime: '',
    endDateTime: '',
    assignedTo: '',
    assignedBy: getCurrentUserId(),
    status: 'Pending',
    priority: 'Medium',
    description: '',
  });

  const statusOptions = ['Pending', 'In Progress', 'Completed', 'On Hold'];
  const priorityOptions = ['All', 'Low', 'Medium', 'High', 'Critical'];
  
  const statusColors = {
    'Pending': 'bg-gradient-to-r from-amber-400/20 to-yellow-400/20 text-amber-500 border-amber-400/30 shadow-amber-400/10',
    'In Progress': 'bg-gradient-to-r from-blue-400/20 to-indigo-400/20 text-blue-500 border-blue-400/30 shadow-blue-400/10',
    'Completed': 'bg-gradient-to-r from-emerald-400/20 to-green-400/20 text-emerald-500 border-emerald-400/30 shadow-emerald-400/10',
    'On Hold': 'bg-gradient-to-r from-orange-400/20 to-amber-400/20 text-orange-500 border-orange-400/30 shadow-orange-400/10',
  };

  const statusGlow = {
    'Pending': 'shadow-amber-400/20',
    'In Progress': 'shadow-blue-400/20',
    'Completed': 'shadow-emerald-400/20',
    'On Hold': 'shadow-orange-400/20',
  };

  const priorityColors = {
    'Low': 'border-blue-400/30 bg-blue-400/5 text-blue-400',
    'Medium': 'border-amber-400/30 bg-amber-400/5 text-amber-400',
    'High': 'border-orange-400/30 bg-orange-400/5 text-orange-400',
    'Critical': 'border-red-400/30 bg-red-400/5 text-red-400',
  };

  const statusIcons = {
    'Pending': <ScheduleIcon className="w-4 h-4" />,
    'In Progress': <PlayArrowIcon className="w-4 h-4" />,
    'Completed': <CheckCircleIcon className="w-4 h-4" />,
    'On Hold': <PauseIcon className="w-4 h-4" />,
  };

  useEffect(() => {
    fetchProject();
    fetchUsers();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await projectsApi.getProject(projectId);
      setProject(response.data);
      fetchTasks();
    } catch (error) {
      console.error('Error fetching project:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load project',
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
      navigate('/projects');
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await usersAPI.getAll();
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
      const response = await tasksApi.getTasksByProject(projectId);
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
    
    if (!formData.taskName?.trim()) {
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
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date format');
      }

      const taskData = {
        taskName: formData.taskName.trim(),
        projectId: parseInt(formData.projectId, 10),
        assignedTo: parseInt(formData.assignedTo, 10),
        assignedBy: parseInt(formData.assignedBy, 10),
        startDateTime: startDate.toISOString(),
        endDateTime: endDate.toISOString(),
        status: formData.status,
        priority: formData.priority || 'Medium',
        description: formData.description || '',
      };

      const response = await tasksApi.createTask(taskData);
      
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
        projectId: parseInt(projectId),
        startDateTime: '',
        endDateTime: '',
        assignedTo: '',
        assignedBy: getCurrentUserId(),
        status: 'Pending',
        priority: 'Medium',
        description: '',
      });
      setFormErrors({});
      await fetchTasks();
      
    } catch (error) {
      console.error('Error creating task:', error);
      
      let errorMessage = 'Failed to create task';
      if (error.response) {
        errorMessage = error.response.data?.message || 
                       error.response.data?.title || 
                       error.response.data?.error ||
                       error.response.statusText || 
                       errorMessage;
        
        if (error.response.data?.errors) {
          const errors = Object.values(error.response.data.errors).flat();
          errorMessage = errors.join('\n');
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
      setIsSubmitting(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await tasksApi.updateTaskStatus(taskId, newStatus);
      await fetchTasks();
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
        await fetchTasks();
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

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setTasks(items);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Time';
    }
  };

  const getTaskProgress = (task) => {
    if (task.status === 'Completed') return 100;
    if (task.status === 'In Progress') return 50;
    if (task.status === 'On Hold') return 25;
    return 0;
  };

  const isOverdue = (endDateTime) => {
    if (!endDateTime) return false;
    try {
      return new Date(endDateTime) < new Date();
    } catch {
      return false;
    }
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

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.taskName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.assignedToName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    const matchesPriority = selectedPriority === 'All' || task.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
  const overdueTasks = tasks.filter(t => isOverdue(t.endDateTime || t.endDate) && t.status !== 'Completed').length;

  if (loading && !project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
            </div>
          </div>
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-[#0a0f1f] dark:via-[#0f1629] dark:to-[#141c2b]">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/3 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Header */}
      <div className={`relative z-10 backdrop-blur-xl flex items-center justify-between p-6 border-b ${
        isDark ? 'border-[#1e2d45] bg-[#0a0f1f]/80' : 'border-gray-200/50 bg-white/60'
      }`}>
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/projects')}
            className={`p-2.5 rounded-xl transition-all ${
              isDark ? 'hover:bg-[#1a2438] text-gray-400 hover:text-white' : 'hover:bg-gray-100/80 text-gray-500 hover:text-gray-700'
            }`}
          >
            <ArrowBackIcon />
          </motion.button>
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent ${
                isDark ? '' : ''
              }`}
            >
              {project?.projectName || project?.name || 'Project Tasks'}
            </motion.h2>
            <div className="flex items-center space-x-3 mt-0.5">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {tasks.length} task{tasks.length !== 1 ? 's' : ''}
              </p>
              {project?.status && (
                <div className={`px-2 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm ${
                  statusColors[project.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {project.status}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            className={`p-2.5 rounded-xl transition backdrop-blur-sm ${
              isDark ? 'hover:bg-[#1a2438] text-gray-400 hover:text-white' : 'hover:bg-gray-100/80 text-gray-500 hover:text-gray-700'
            }`}
          >
            {viewMode === 'list' ? <GridViewIcon /> : <ViewListIcon />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddTask(!showAddTask)}
            className={`px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center space-x-2 shadow-lg backdrop-blur-sm ${
              showAddTask 
                ? isDark ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-red-600/20' : 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-red-500/20'
                : isDark ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-blue-600/20' : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-blue-500/20'
            }`}
          >
            {showAddTask ? (
              <CloseIcon className="w-5 h-5" />
            ) : (
              <AddIcon className="w-5 h-5" />
            )}
            <span className="hidden sm:inline font-medium">{showAddTask ? 'Cancel' : 'Add Task'}</span>
          </motion.button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: totalTasks, icon: <TaskIcon className="w-5 h-5" />, color: 'from-blue-500 to-cyan-500' },
            { label: 'Completed', value: completedTasks, icon: <CheckCircleOutlineIcon className="w-5 h-5" />, color: 'from-emerald-500 to-green-500' },
            { label: 'In Progress', value: inProgressTasks, icon: <SpeedIcon className="w-5 h-5" />, color: 'from-purple-500 to-pink-500' },
            { label: 'Overdue', value: overdueTasks, icon: <ErrorOutlineIcon className="w-5 h-5" />, color: 'from-red-500 to-orange-500' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-4 rounded-2xl backdrop-blur-sm border transition-all hover:scale-105 ${
                isDark ? 'bg-[#0f1629]/80 border-[#1e2d45]' : 'bg-white/60 border-gray-200/50'
              }`}
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-5`} />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <SearchIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition backdrop-blur-sm ${
                isDark 
                  ? 'bg-[#0f1629]/80 border-[#1e2d45] text-white placeholder-gray-500' 
                  : 'bg-white/60 backdrop-blur-sm border-gray-200/50 text-gray-900'
              }`}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-2.5 rounded-xl border transition flex items-center space-x-1.5 backdrop-blur-sm ${
                isDark 
                  ? 'border-[#1e2d45] text-gray-400 hover:bg-[#1a2438] hover:text-white' 
                  : 'border-gray-200/50 text-gray-500 hover:bg-gray-100/80 hover:text-gray-700'
              }`}
            >
              <FilterIcon className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Filters</span>
            </motion.button>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`text-sm px-3 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                isDark 
                  ? 'bg-[#0f1629]/80 border-[#1e2d45] text-white' 
                  : 'bg-white/60 backdrop-blur-sm border-gray-200/50 text-gray-700'
              }`}
            >
              <option value="All">All Status</option>
              {statusOptions.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className={`text-sm px-3 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                isDark 
                  ? 'bg-[#0f1629]/80 border-[#1e2d45] text-white' 
                  : 'bg-white/60 backdrop-blur-sm border-gray-200/50 text-gray-700'
              }`}
            >
              {priorityOptions.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Task Form */}
        <AnimatePresence>
          {showAddTask && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`rounded-2xl p-6 border shadow-2xl overflow-hidden backdrop-blur-xl ${
                isDark ? 'bg-[#0f1629]/90 border-[#1e2d45]' : 'bg-white/80 border-gray-200/50'
              }`}
            >
              <h3 className={`text-lg font-semibold mb-4 flex items-center space-x-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-1 h-8 rounded-full"></span>
                <span>Create New Task</span>
                <span className="text-xs text-gray-400 font-normal ml-2">✨ Advanced</span>
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
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition backdrop-blur-sm ${
                      isDark 
                        ? 'bg-[#0a0f1f]/80 border-[#1e2d45] text-white placeholder-gray-500' 
                        : 'bg-gray-50/80 border-gray-300 text-gray-900'
                    } ${formErrors.taskName ? 'border-red-500' : ''}`}
                    placeholder="Enter task name"
                    required
                  />
                  {formErrors.taskName && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.taskName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition backdrop-blur-sm ${
                        isDark 
                          ? 'bg-[#0a0f1f]/80 border-[#1e2d45] text-white' 
                          : 'bg-gray-50/80 border-gray-300 text-gray-900'
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
                      className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition backdrop-blur-sm ${
                        isDark 
                          ? 'bg-[#0a0f1f]/80 border-[#1e2d45] text-white' 
                          : 'bg-gray-50/80 border-gray-300 text-gray-900'
                      } ${formErrors.endDateTime ? 'border-red-500' : ''}`}
                      required
                    />
                    {formErrors.endDateTime && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.endDateTime}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition backdrop-blur-sm ${
                        isDark 
                          ? 'bg-[#0a0f1f]/80 border-[#1e2d45] text-white' 
                          : 'bg-gray-50/80 border-gray-300 text-gray-900'
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
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition backdrop-blur-sm ${
                        isDark 
                          ? 'bg-[#0a0f1f]/80 border-[#1e2d45] text-white' 
                          : 'bg-gray-50/80 border-gray-300 text-gray-900'
                      }`}
                    >
                      {priorityOptions.filter(p => p !== 'All').map((priority) => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </select>
                  </div>
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
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition backdrop-blur-sm ${
                      isDark 
                        ? 'bg-[#0a0f1f]/80 border-[#1e2d45] text-white' 
                        : 'bg-gray-50/80 border-gray-300 text-gray-900'
                    }`}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition backdrop-blur-sm ${
                      isDark 
                        ? 'bg-[#0a0f1f]/80 border-[#1e2d45] text-white placeholder-gray-500' 
                        : 'bg-gray-50/80 border-gray-300 text-gray-900'
                    }`}
                    placeholder="Enter task description (optional)"
                    rows="2"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddTask(false);
                      setFormErrors({});
                    }}
                    className={`px-4 py-2.5 rounded-xl transition backdrop-blur-sm ${
                      isDark 
                        ? 'border border-[#1e2d45] text-gray-400 hover:bg-[#1a2438]' 
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50/80'
                    }`}
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-xl transition font-medium shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Task'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Task Progress Bar */}
        {tasks.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-4 backdrop-blur-sm border ${
              isDark ? 'bg-[#0f1629]/80 border-[#1e2d45]' : 'bg-white/60 border-gray-200/50 shadow-xl'
            }`}
          >
            <TaskProgressBar 
              tasks={tasks} 
              showLabels={true}
              compact={false}
            />
          </motion.div>
        )}

        {/* Task List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-7xl mb-4">🚀</div>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {tasks.length === 0 ? 'No tasks yet. Create your first task!' : 'No matching tasks found'}
            </p>
            {tasks.length === 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddTask(true)}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25"
              >
                <AddIcon className="w-5 h-5 inline mr-2" />
                Create Task
              </motion.button>
            )}
          </motion.div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tasks" direction={viewMode === 'grid' ? 'horizontal' : 'vertical'}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' 
                      : 'space-y-3'
                  } ${snapshot.isDraggingOver ? 'bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl p-4 -m-4' : ''}`}
                >
                  {filteredTasks.map((task, index) => {
                    const taskId = task.taskId || task.id;
                    const isTaskOverdue = isOverdue(task.endDateTime || task.endDate) && task.status !== 'Completed';
                    
                    return (
                      <Draggable key={taskId} draggableId={String(taskId)} index={index}>
                        {(provided, snapshot) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ 
                              opacity: 1, 
                              y: 0,
                              scale: snapshot.isDragging ? 1.03 : 1,
                              rotateX: snapshot.isDragging ? 2 : 0,
                            }}
                            transition={{ 
                              duration: 0.2, 
                              delay: index * 0.05,
                              type: "spring",
                              stiffness: 300,
                              damping: 25
                            }}
                            whileHover={{ 
                              y: -4,
                              transition: { duration: 0.2 }
                            }}
                            className={`relative rounded-2xl p-5 border transition-all backdrop-blur-sm ${
                              snapshot.isDragging 
                                ? 'shadow-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 border-blue-400/30' 
                                : isDark 
                                  ? 'bg-[#0f1629]/80 border-[#1e2d45] hover:border-blue-500/30' 
                                  : 'bg-white/60 border-gray-200/50 hover:border-blue-300/50 hover:shadow-xl'
                            } ${isTaskOverdue ? 'border-red-500/50 dark:border-red-500/30' : ''}`}
                          >
                            {/* Glow Effect */}
                            <div className={`absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 ${
                              snapshot.isDragging ? 'opacity-100' : ''
                            }`}>
                              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl" />
                              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl" />
                            </div>

                            <div className="relative">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-2 flex-wrap gap-y-1">
                                    <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                                      <DragIcon className={`w-5 h-5 ${
                                        isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                                      } transition-colors`} />
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1.5 border backdrop-blur-sm shadow-lg ${statusGlow[task.status]} ${
                                      statusColors[task.status] || statusColors['Pending']
                                    }`}>
                                      {statusIcons[task.status]}
                                      <span>{task.status}</span>
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${priorityColors[task.priority || 'Medium']}`}>
                                      {task.priority || 'Medium'}
                                    </div>
                                    {isTaskOverdue && (
                                      <div className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-400/30 backdrop-blur-sm animate-pulse">
                                        ⚠️ Overdue
                                      </div>
                                    )}
                                  </div>
                                  
                                  <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {task.taskName || task.name}
                                  </h4>
                                  
                                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                                    <div className="flex items-center space-x-1.5">
                                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shadow-lg ${
                                        isDark ? 'bg-gradient-to-br from-blue-600/40 to-purple-600/40 text-blue-300' : 'bg-gradient-to-br from-blue-100 to-purple-100 text-blue-700'
                                      }`}>
                                        {getInitials(task.assignedToName)}
                                      </div>
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
                                    className={`text-xs px-3 py-1.5 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm ${
                                      isDark 
                                        ? 'bg-[#0a0f1f]/80 border-[#1e2d45] text-white' 
                                        : 'bg-gray-50/80 border-gray-300 text-gray-700'
                                    }`}
                                  >
                                    {statusOptions.map((status) => (
                                      <option key={status} value={status}>{status}</option>
                                    ))}
                                  </select>
                                  
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleDeleteTask(taskId)}
                                    className={`p-1.5 rounded-lg transition ${
                                      isDark ? 'hover:bg-[#1e2d45] text-gray-400 hover:text-red-400' : 'hover:bg-gray-100/80 text-gray-500 hover:text-red-500'
                                    }`}
                                    title="Delete task"
                                  >
                                    <DeleteIcon className="w-4 h-4" />
                                  </motion.button>
                                </div>
                              </div>

                              {/* Task progress bar */}
                              <div className="mt-4">
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Progress
                                  </span>
                                  <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {getTaskProgress(task)}%
                                  </span>
                                </div>
                                <div className={`w-full rounded-full h-2.5 ${isDark ? 'bg-[#1e2d45]/50' : 'bg-gray-200/50'} overflow-hidden backdrop-blur-sm`}>
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${getTaskProgress(task)}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className={`h-2.5 rounded-full transition-all duration-500 shadow-lg ${
                                      task.status === 'Completed' ? 'bg-gradient-to-r from-emerald-500 to-green-500 shadow-emerald-500/30' :
                                      task.status === 'In Progress' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-blue-500/30' :
                                      task.status === 'On Hold' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 shadow-amber-500/30' : 
                                      'bg-gradient-to-r from-gray-400 to-gray-500 shadow-gray-500/30'
                                    }`}
                                  />
                                </div>
                              </div>

                              {/* Task dates */}
                              <div className="mt-3 flex flex-wrap items-center justify-between text-xs">
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

                              {task.description && (
                                <div className={`mt-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                  📝 {task.description}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      {/* Footer Stats */}
      <div className={`relative z-10 backdrop-blur-xl p-4 border-t ${
        isDark ? 'border-[#1e2d45] bg-[#0a0f1f]/80' : 'border-gray-200/50 bg-white/60'
      }`}>
        <div className="flex flex-wrap items-center justify-between text-sm gap-2">
          <div className="flex items-center space-x-6 flex-wrap gap-2">
            {[
              { label: 'Total', value: tasks.length, color: 'text-gray-400' },
              { label: 'Completed', value: tasks.filter(t => t.status === 'Completed').length, color: 'text-emerald-500' },
              { label: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length, color: 'text-blue-500' },
              { label: 'Pending', value: tasks.filter(t => t.status === 'Pending').length, color: 'text-amber-500' },
              { label: 'On Hold', value: tasks.filter(t => t.status === 'On Hold').length, color: 'text-orange-500' },
            ].map((stat, index) => (
              <div key={index}>
                <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                  {stat.label}
                </span>
                <span className={`ml-2 font-semibold ${stat.color} ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
          {tasks.length > 0 && (
            <div className={`text-xs px-3 py-1.5 rounded-full backdrop-blur-sm ${
              isDark ? 'bg-[#1a2438] text-gray-300' : 'bg-gray-100/80 text-gray-700'
            }`}>
              <AnalyticsIcon className="w-3 h-3 inline mr-1" />
              Progress: {Math.round((tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskPage;