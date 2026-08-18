// src/pages/projects/ProjectCard.jsx - Fixed with Portal for Menu
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { 
  MoreVert as MoreVertIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Task as TaskIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  DragIndicator as DragIcon,
  Percent as PercentIcon
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';
import { projectsApi } from '../../api/projectsApi';
import { tasksApi } from '../../api/tasksApi';
import Swal from 'sweetalert2';
import TaskProgressBar from './TaskProgressBar';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectCard = ({ project, onUpdate, onViewTasks, dragHandleProps, isDragging = false }) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [taskSummary, setTaskSummary] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    onHold: 0,
    progress: 0,
    tasks: []
  });
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Status configuration with glow colors
  const statusConfig = {
    Active: {
      color: '#00e5ff',
      glow: 'rgba(0, 229, 255, 0.3)',
      border: 'border-cyan-400/30',
      bg: 'bg-gradient-to-br from-cyan-500/10 to-emerald-500/10',
      gradient: 'from-cyan-400 to-emerald-400',
      icon: <TrendingUpIcon className="w-4 h-4" />,
    },
    'On Hold': {
      color: '#ff4da6',
      glow: 'rgba(255, 77, 166, 0.3)',
      border: 'border-pink-400/30',
      bg: 'bg-gradient-to-br from-pink-500/10 to-amber-500/10',
      gradient: 'from-pink-400 to-amber-400',
      icon: <ScheduleIcon className="w-4 h-4" />,
    },
    Pending: {
      color: '#ff9900',
      glow: 'rgba(255, 153, 0, 0.3)',
      border: 'border-orange-400/30',
      bg: 'bg-gradient-to-br from-orange-500/10 to-amber-500/10',
      gradient: 'from-orange-400 to-amber-400',
      icon: <PendingIcon className="w-4 h-4" />,
    },
    Completed: {
      color: '#00ff88',
      glow: 'rgba(0, 255, 136, 0.3)',
      border: 'border-emerald-400/30',
      bg: 'bg-gradient-to-br from-emerald-500/10 to-blue-500/10',
      gradient: 'from-emerald-400 to-blue-400',
      icon: <CheckCircleIcon className="w-4 h-4" />,
    },
  };

  const statusColors = {
    Active: 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-400 border-cyan-400/30',
    'On Hold': 'bg-gradient-to-r from-pink-500/20 to-amber-500/20 text-pink-400 border-pink-400/30',
    Pending: 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 border-orange-400/30',
    Completed: 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-400 border-emerald-400/30',
  };

  const projectId = project.projectId || project.id;
  
  const displayData = {
    id: projectId,
    name: project.projectName || project.name || 'Untitled Project',
    client: project.clientName || project.client || 'No Client',
    status: project.status || 'Pending',
    progress: project.progress || 0,
    deadline: project.deadline || project.endDate,
    manager: project.manager || project.managerName || project.Manager || 'Unassigned',
    developer: project.developer || project.developerName || project.Developer || 'Unassigned',
    assigneeCount: project.assigneeCount || project.teamSize || project.teamCount || project.assignees?.length || 0,
    budget: project.budget || 0,
    description: project.description || '',
    tasks: project.tasks || [],
    taskCount: project.taskCount || 0,
    completedTasks: project.completedTasks || 0,
    assignees: project.assignees || project.teamMembers || [],
  };

  const currentStatus = displayData.status || 'Pending';
  const statusGlow = statusConfig[currentStatus]?.glow || 'rgba(100, 100, 200, 0.2)';
  const statusColor = statusConfig[currentStatus]?.color || '#6666cc';

  useEffect(() => {
    if (project.tasks && project.tasks.length > 0) {
      calculateTaskSummary(project.tasks);
    } else if (projectId) {
      fetchTasks();
    }
  }, [project]);

  const fetchTasks = async () => {
    try {
      const response = await tasksApi.getTasksByProject(displayData.id);
      const tasks = response.data?.data || response.data || [];
      if (Array.isArray(tasks) && tasks.length > 0) {
        calculateTaskSummary(tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const calculateTaskSummary = (tasks) => {
    if (!Array.isArray(tasks)) tasks = [];
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const pending = tasks.filter(t => t.status === 'Pending').length;
    const onHold = tasks.filter(t => t.status === 'On Hold').length;
    const total = tasks.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    setTaskSummary({ total, completed, inProgress, pending, onHold, progress, tasks });
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Delete Project?',
      text: 'This action cannot be undone. All tasks will also be deleted.',
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
        await projectsApi.deleteProject(displayData.id);
        Swal.fire({
          title: 'Deleted!',
          text: 'Project has been deleted',
          icon: 'success',
          background: isDark ? '#141c2b' : '#ffffff',
          color: isDark ? '#e8edf5' : '#0f172a',
          confirmButtonColor: '#3b82f6',
          timer: 2000,
          timerProgressBar: true,
        });
        if (onUpdate) onUpdate();
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to delete project',
          icon: 'error',
          background: isDark ? '#141c2b' : '#ffffff',
          color: isDark ? '#e8edf5' : '#0f172a',
          confirmButtonColor: '#3b82f6',
        });
      }
    }
    setShowMenu(false);
  };

  const handleEdit = () => {
    setShowMenu(false);
    if (displayData.id) {
      navigate(`/projects/edit/${displayData.id}`);
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Cannot edit this project. Invalid project ID.',
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
    }
  };

  const handleViewTasks = () => {
    setShowMenu(false);
    if (displayData.id) {
      navigate(`/projects/${displayData.id}/tasks`);
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Cannot view tasks for this project. Invalid project ID.',
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
    }
  };

  const toggleExpand = () => setExpanded(!expanded);

  const toggleMenu = (e) => {
    e.stopPropagation();
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 8,
        right: window.innerWidth - rect.right - window.scrollX,
      });
    }
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const isOverdue = (deadline) => {
    if (!deadline) return false;
    try {
      return new Date(deadline) < new Date() && displayData.status !== 'Completed';
    } catch {
      return false;
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'from-emerald-500 via-emerald-400 to-green-500';
    if (progress >= 50) return 'from-blue-500 via-blue-400 to-indigo-500';
    if (progress >= 20) return 'from-amber-500 via-yellow-400 to-orange-500';
    return 'from-gray-500 via-gray-400 to-gray-500';
  };

  // Menu component rendered via portal
  const MenuDropdown = () => {
    if (!showMenu) return null;
    
    return ReactDOM.createPortal(
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        ref={menuRef}
        className="fixed rounded-2xl shadow-2xl py-1 w-56"
        style={{
          top: menuPosition.top,
          right: menuPosition.right,
          backgroundColor: isDark ? '#1a2438' : '#ffffff',
          border: isDark ? '1px solid #1e2d45' : '1px solid #e5e7eb',
          boxShadow: `0 10px 40px ${statusGlow}`,
          zIndex: 99999,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleViewTasks}
          className={`w-full px-4 py-3 text-left text-sm transition flex items-center space-x-3 ${
            isDark ? 'text-gray-300 hover:bg-[#1e2d45]' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <TaskIcon className="w-4 h-4" />
          <span>View Tasks</span>
          {taskSummary.total > 0 && (
            <span className="ml-auto text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
              {taskSummary.total}
            </span>
          )}
        </button>
        <button
          onClick={handleEdit}
          className={`w-full px-4 py-3 text-left text-sm transition flex items-center space-x-3 ${
            isDark ? 'text-gray-300 hover:bg-[#1e2d45]' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <EditIcon className="w-4 h-4" />
          <span>Edit Project</span>
        </button>
        <div className={`border-t ${isDark ? 'border-[#1e2d45]' : 'border-gray-100'}`} />
        <button
          onClick={handleDelete}
          className={`w-full px-4 py-3 text-left text-sm transition flex items-center space-x-3 text-red-600 ${
            isDark ? 'hover:bg-[#1e2d45]' : 'hover:bg-gray-50'
          }`}
        >
          <DeleteIcon className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </motion.div>,
      document.body
    );
  };

  return (
    <>
      <div
        className={`relative rounded-2xl shadow-xl p-6 ${
          isDark 
            ? 'bg-gradient-to-br from-[#1a2438] to-[#141c2b] border border-[#1e2d45]' 
            : 'bg-gradient-to-br from-white to-gray-50/80 border border-gray-100'
        } ${expanded ? 'lg:col-span-2' : ''} ${isDragging ? 'scale-105' : ''}`}
        style={{
          boxShadow: isDragging 
            ? `0 25px 60px ${statusGlow}` 
            : `0 4px 20px ${statusGlow}`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Glow Effect */}
        <div className={`absolute inset-0 pointer-events-none ${
          isHovered || isDragging ? 'opacity-100' : 'opacity-70'
        }`}>
          <div 
            className="absolute inset-0 rounded-2xl blur-2xl"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${statusGlow}, transparent 70%)`,
              opacity: isHovered || isDragging ? 0.8 : 0.5,
            }}
          />
          <div 
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl"
            style={{
              background: statusGlow,
              opacity: isHovered || isDragging ? 0.5 : 0.3,
            }}
          />
          <div 
            className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl"
            style={{
              background: statusGlow,
              opacity: isHovered || isDragging ? 0.5 : 0.3,
            }}
          />
          <div 
            className="absolute inset-0 rounded-2xl"
            style={{
              boxShadow: `inset 0 0 60px ${statusGlow}`,
              opacity: isHovered || isDragging ? 0.6 : 0.3,
            }}
          />
        </div>

        {/* Status Border Glow */}
        <div 
          className={`absolute inset-0 rounded-2xl pointer-events-none ${
            isHovered || isDragging ? 'opacity-100' : 'opacity-60'
          }`}
          style={{
            boxShadow: `inset 0 0 30px ${statusGlow}`,
          }}
        />

        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden pointer-events-none">
          <div 
            className="absolute -top-1 -left-1 w-8 h-8 rotate-45"
            style={{
              background: `linear-gradient(135deg, ${statusColor}44, transparent)`,
              boxShadow: `0 0 20px ${statusGlow}`,
            }}
          />
        </div>
        <div className="absolute bottom-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
          <div 
            className="absolute -bottom-1 -right-1 w-8 h-8 rotate-45"
            style={{
              background: `linear-gradient(225deg, ${statusColor}44, transparent)`,
              boxShadow: `0 0 20px ${statusGlow}`,
            }}
          />
        </div>

        {/* Drag Handle */}
        {dragHandleProps && (
          <div 
            {...dragHandleProps} 
            className="absolute top-3 left-3 cursor-grab active:cursor-grabbing z-20"
            style={{
              opacity: isHovered ? 1 : 0.6,
            }}
          >
            <DragIcon className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
        )}

        {/* Status Badge */}
        <div 
          className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1.5 border backdrop-blur-sm z-20 ${
            statusColors[displayData.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}
          style={{
            boxShadow: `0 0 25px ${statusGlow}`,
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75`}
              style={{
                backgroundColor: statusColor,
              }}
            />
            <span className={`relative inline-flex rounded-full h-2 w-2`}
              style={{
                backgroundColor: statusColor,
              }}
            />
          </span>
          <span>{displayData.status}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-4 mt-2 relative z-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              {/* Project Icon */}
              <div 
                className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${
                  displayData.status === 'Active' ? 'from-cyan-500 to-emerald-500' :
                  displayData.status === 'Completed' ? 'from-emerald-500 to-blue-500' :
                  displayData.status === 'On Hold' ? 'from-pink-500 to-amber-500' :
                  'from-orange-500 to-amber-500'
                }`}
                style={{
                  boxShadow: `0 0 30px ${statusGlow}`,
                }}
              >
                <span className="text-white font-bold text-sm">
                  {displayData.name.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <div className="flex-1">
                <h3 
                  className={`font-semibold text-lg truncate cursor-pointer ${
                    isDark ? 'text-white hover:text-blue-400' : 'text-gray-900 hover:text-blue-600'
                  }`}
                  onClick={handleViewTasks}
                  title="Click to view tasks"
                >
                  {displayData.name}
                </h3>
                <div className="flex items-center space-x-2 mt-0.5">
                  <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {displayData.client}
                  </p>
                  {taskSummary.total > 0 && (
                    <span className="flex items-center text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      <TaskIcon className="w-3 h-3 mr-1" />
                      {taskSummary.total}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Button */}
          <div className="relative ml-2 z-20">
            <button
              ref={buttonRef}
              onClick={toggleMenu}
              className={`p-1.5 rounded-lg ${
                isDark ? 'hover:bg-[#1e2d45]' : 'hover:bg-gray-100'
              }`}
            >
              <MoreVertIcon className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
            </button>
          </div>
        </div>

        {/* Project Details */}
        <div className="space-y-4 relative z-10">
          {/* Manager & Team */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-2.5 rounded-xl ${
              isDark ? 'bg-[#141c2b]/80' : 'bg-gray-50/80'
            }`}>
              <span className={`text-xs uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Manager
              </span>
              <p className={`font-medium truncate flex items-center space-x-1.5 mt-0.5 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <PeopleIcon className="w-3.5 h-3.5 text-blue-400" />
                {displayData.manager && displayData.manager !== 'Unassigned' ? displayData.manager : 'Unassigned'}
              </p>
            </div>
            <div className={`p-2.5 rounded-xl ${
              isDark ? 'bg-[#141c2b]/80' : 'bg-gray-50/80'
            }`}>
              <span className={`text-xs uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Team
              </span>
              <p className={`font-medium flex items-center truncate mt-0.5 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {displayData.assigneeCount > 0 ? (
                  <>
                    <PeopleIcon className="w-4 h-4 mr-1.5 text-blue-400" />
                    {displayData.assigneeCount} member{displayData.assigneeCount > 1 ? 's' : ''}
                  </>
                ) : (
                  'Unassigned'
                )}
              </p>
            </div>
          </div>

          {/* Task Progress Bar */}
          {taskSummary.tasks.length > 0 ? (
            <div className={`p-3 rounded-xl border ${
              isDark ? 'bg-[#141c2b]/80' : 'bg-gray-50/80'
            }`}
            style={{
              borderColor: `${statusColor}33`,
              boxShadow: `inset 0 0 20px ${statusGlow}`,
            }}>
              <TaskProgressBar 
                tasks={taskSummary.tasks} 
                compact={true}
                showLabels={true}
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-sm flex items-center space-x-1.5 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <PercentIcon className="w-4 h-4" />
                  <span>Overall Progress</span>
                </span>
                <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {displayData.progress}%
                </span>
              </div>
              <div className={`w-full rounded-full h-3 ${isDark ? 'bg-[#1e2d45]' : 'bg-gray-200'} overflow-hidden`}>
                <div
                  className={`h-3 rounded-full bg-gradient-to-r ${getProgressColor(displayData.progress)}`}
                  style={{
                    width: `${displayData.progress}%`,
                    boxShadow: `0 0 20px ${statusGlow}`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Task Summary Chips */}
          {taskSummary.total > 0 && (
            <div className="flex flex-wrap gap-2">
              <div className={`px-3 py-1.5 rounded-full text-xs flex items-center space-x-1.5 border ${
                isDark ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-100 text-green-700 border-green-200'
              }`}>
                <CheckCircleIcon className="w-3.5 h-3.5" />
                <span>{taskSummary.completed} Done</span>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-xs flex items-center space-x-1.5 border ${
                isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-100 text-blue-700 border-blue-200'
              }`}>
                <PendingIcon className="w-3.5 h-3.5" />
                <span>{taskSummary.inProgress} In Progress</span>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-xs flex items-center space-x-1.5 border ${
                isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-100 text-amber-700 border-amber-200'
              }`}>
                <ScheduleIcon className="w-3.5 h-3.5" />
                <span>{taskSummary.pending} Pending</span>
              </div>
            </div>
          )}

          {/* Bottom Info */}
          <div className={`flex flex-wrap items-center justify-between pt-3 border-t ${
            isDark ? 'border-[#1e2d45]' : 'border-gray-200'
          }`}>
            <div className="flex items-center space-x-4 flex-wrap gap-y-1">
              <div className={`flex items-center space-x-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <CalendarIcon className={`w-4 h-4 ${isOverdue(displayData.deadline) ? 'text-red-400' : ''}`} />
                <span className={`font-medium ${isOverdue(displayData.deadline) ? 'text-red-500' : isDark ? 'text-white' : 'text-gray-900'}`}>
                  {formatDate(displayData.deadline)}
                </span>
                {isOverdue(displayData.deadline) && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-red-500/10 text-red-600 border border-red-500/20">
                    Overdue
                  </span>
                )}
              </div>
              
              {displayData.budget > 0 && (
                <div className={`flex items-center space-x-1.5 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <MoneyIcon className="w-4 h-4 text-emerald-400" />
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    ${Number(displayData.budget).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
            
            <button
              onClick={handleViewTasks}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium flex items-center space-x-2 shadow-lg ${
                isDark 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-600/20' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-blue-500/30'
              }`}
              style={{
                boxShadow: `0 5px 25px ${statusGlow}`,
              }}
            >
              <TaskIcon className="w-4 h-4" />
              <span>Tasks</span>
              {taskSummary.total > 0 && (
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {taskSummary.total}
                </span>
              )}
            </button>
          </div>

          {/* Expandable Description */}
          {displayData.description && (
            <div className="mt-1">
              <button
                onClick={toggleExpand}
                className={`text-xs font-medium flex items-center space-x-1 ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{expanded ? 'Show less' : 'Show description'}</span>
                <svg className={`w-3 h-3 ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expanded && (
                <p className={`mt-2 text-sm p-3 rounded-xl ${
                  isDark ? 'bg-[#141c2b] text-gray-300' : 'bg-gray-50 text-gray-600'
                }`}>
                  {displayData.description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Menu Dropdown rendered via Portal */}
      <MenuDropdown />
    </>
  );
};

export default ProjectCard;