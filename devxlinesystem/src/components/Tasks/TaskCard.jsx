import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MoreVert as MoreVertIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  HourglassEmpty as HourglassIcon,
  Pause as PauseIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Assignment as ProjectIcon,
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';
import { tasksApi } from '../../api/tasksApi';
import Swal from 'sweetalert2';

const TaskCard = ({ task, onUpdate, projectId }) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const menuRef = React.useRef(null);

  const statusColors = {
    Pending: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    Completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'On Hold': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  };

  const statusIcons = {
    Pending: PendingIcon,
    'In Progress': HourglassIcon,
    Completed: CheckCircleIcon,
    'On Hold': PauseIcon,
  };

  const displayData = {
    id: task.taskId || task.id,
    name: task.taskName || task.name,
    projectName: task.projectName || task.project,
    projectId: task.projectId,
    status: task.status || 'Pending',
    startDateTime: task.startDateTime || task.startDate,
    endDateTime: task.endDateTime || task.endDate,
    assignedTo: task.assignedToName || task.assignedTo,
    assignedById: task.assignedBy,
    assignedByName: task.assignedByName || task.assignedBy,
    createdDate: task.createdDate || task.createdAt,
    description: task.description || task.taskDescription,
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
        setIsUpdating(true);
        await tasksApi.deleteTask(displayData.id);
        
        await Swal.fire({
          title: 'Deleted!',
          text: 'Task has been deleted',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: isDark ? '#141c2b' : '#ffffff',
          color: isDark ? '#e8edf5' : '#0f172a',
        });
        
        if (onUpdate) onUpdate();
      } catch (error) {
        await Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to delete task',
          icon: 'error',
          background: isDark ? '#141c2b' : '#ffffff',
          color: isDark ? '#e8edf5' : '#0f172a',
          confirmButtonColor: '#3b82f6',
        });
      } finally {
        setIsUpdating(false);
      }
    }
    setShowMenu(false);
  };

  const handleEdit = () => {
    const basePath = projectId ? `/projects/${projectId}/tasks` : '/tasks';
    navigate(`${basePath}/edit/${displayData.id}`);
    setShowMenu(false);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setIsUpdating(true);
      await tasksApi.updateTaskStatus(displayData.id, newStatus);
      
      await Swal.fire({
        title: 'Updated!',
        text: `Task status changed to ${newStatus}`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
      });
      
      if (onUpdate) onUpdate();
    } catch (error) {
      await Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update task status',
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setIsUpdating(false);
    }
    setShowMenu(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const StatusIcon = statusIcons[displayData.status] || PendingIcon;
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const isOverdue = () => {
    if (!displayData.endDateTime || displayData.status === 'Completed') return false;
    return new Date(displayData.endDateTime) < new Date();
  };

  const isToday = () => {
    if (!displayData.endDateTime) return false;
    const today = new Date();
    const dueDate = new Date(displayData.endDateTime);
    return today.toDateString() === dueDate.toDateString();
  };

  return (
    <div className={`rounded-xl shadow-card p-6 card-hover transition-theme ${
      isDark ? 'bg-[#1a2438] border border-[#1e2d45]' : 'bg-white'
    } ${isOverdue() && displayData.status !== 'Completed' ? 'border-red-500/50' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {displayData.name}
          </h3>
          {displayData.projectName && (
            <p className={`text-sm mt-1 flex items-center space-x-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <ProjectIcon className="w-4 h-4" />
              <span>{displayData.projectName}</span>
            </p>
          )}
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={`p-1 rounded-lg transition ${
              isDark ? 'hover:bg-[#1e2d45]' : 'hover:bg-gray-100'
            }`}
            disabled={isUpdating}
          >
            <MoreVertIcon className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
          </button>
          
          {showMenu && (
            <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg py-1 z-10 ${
              isDark ? 'bg-[#1a2438] border border-[#1e2d45]' : 'bg-white border border-gray-200'
            }`}>
              <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b dark:border-[#1e2d45]">
                Change Status
              </div>
              {['Pending', 'In Progress', 'Completed', 'On Hold'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={isUpdating}
                  className={`w-full px-4 py-2 text-left text-sm transition ${
                    displayData.status === status 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : isDark ? 'text-gray-300 hover:bg-[#1e2d45]' : 'text-gray-700 hover:bg-gray-100'
                  } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {status}
                </button>
              ))}
              <div className="border-t dark:border-[#1e2d45] my-1"></div>
              <button
                onClick={handleEdit}
                disabled={isUpdating}
                className={`w-full px-4 py-2 text-left text-sm transition flex items-center space-x-2 ${
                  isDark ? 'text-gray-300 hover:bg-[#1e2d45]' : 'text-gray-700 hover:bg-gray-100'
                } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <EditIcon className="w-4 h-4" />
                <span>Edit Task</span>
              </button>
              <button
                onClick={handleDelete}
                disabled={isUpdating}
                className={`w-full px-4 py-2 text-left text-sm transition text-red-600 flex items-center space-x-2 ${
                  isDark ? 'hover:bg-[#1e2d45]' : 'hover:bg-gray-100'
                } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <DeleteIcon className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Status</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
            statusColors[displayData.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            <StatusIcon className="w-3 h-3" />
            <span>{displayData.status}</span>
          </span>
        </div>

        {/* Assigned To */}
        <div className="flex items-center justify-between">
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Assigned To</span>
          <span className={`text-sm font-medium flex items-center space-x-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <PersonIcon className="w-4 h-4" />
            <span>{displayData.assignedTo || 'Unassigned'}</span>
          </span>
        </div>

        {/* Date Range */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-[#1e2d45]">
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <CalendarIcon className="w-4 h-4 inline mr-1" />
            {formatDate(displayData.startDateTime)}
            {displayData.startDateTime && ' - '}
            {formatDate(displayData.endDateTime)}
          </span>
          {isOverdue() && displayData.status !== 'Completed' && (
            <span className="text-xs text-red-500 font-medium">Overdue</span>
          )}
          {isToday() && displayData.status !== 'Completed' && (
            <span className="text-xs text-orange-500 font-medium">Due Today</span>
          )}
        </div>

        {displayData.assignedByName && (
          <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Assigned by: {displayData.assignedByName}
          </div>
        )}

        {displayData.description && (
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
            {displayData.description}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;