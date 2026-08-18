// src/pages/projects/TaskProgressBar.jsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Schedule as ScheduleIcon,
  PlayArrow as PlayArrowIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const TaskProgressBar = ({ tasks, showLabels = true, compact = false }) => {
  const { isDark } = useTheme();
  
  if (!tasks || tasks.length === 0) {
    return (
      <div className={`text-center py-2 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        No tasks available
      </div>
    );
  }

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const pending = tasks.filter(t => t.status === 'Pending').length;
  const onHold = tasks.filter(t => t.status === 'On Hold').length;
  
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Status counts for display
  const statusCounts = {
    completed,
    inProgress,
    pending,
    onHold
  };

  // Status colors and icons
  const statusConfig = {
    completed: {
      label: 'Completed',
      color: 'bg-green-500',
      textColor: 'text-green-500',
      icon: <CheckCircleIcon className="w-4 h-4" />,
      bgColor: isDark ? 'bg-green-900/20' : 'bg-green-100',
      textColorClass: isDark ? 'text-green-400' : 'text-green-700'
    },
    inProgress: {
      label: 'In Progress',
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
      icon: <PlayArrowIcon className="w-4 h-4" />,
      bgColor: isDark ? 'bg-blue-900/20' : 'bg-blue-100',
      textColorClass: isDark ? 'text-blue-400' : 'text-blue-700'
    },
    pending: {
      label: 'Pending',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-500',
      icon: <PendingIcon className="w-4 h-4" />,
      bgColor: isDark ? 'bg-yellow-900/20' : 'bg-yellow-100',
      textColorClass: isDark ? 'text-yellow-400' : 'text-yellow-700'
    },
    onHold: {
      label: 'On Hold',
      color: 'bg-orange-500',
      textColor: 'text-orange-500',
      icon: <ScheduleIcon className="w-4 h-4" />,
      bgColor: isDark ? 'bg-orange-900/20' : 'bg-orange-100',
      textColorClass: isDark ? 'text-orange-400' : 'text-orange-700'
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-gradient-to-r from-emerald-500 to-green-500';
    if (progress >= 50) return 'bg-gradient-to-r from-blue-500 to-indigo-500';
    if (progress >= 20) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return 'bg-gradient-to-r from-gray-500 to-gray-400';
  };

  // Compact version for small spaces
  if (compact) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Progress
            </span>
            <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {progress}%
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="flex items-center space-x-0.5">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{completed}</span>
            </span>
            <span className="flex items-center space-x-0.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{inProgress}</span>
            </span>
            <span className="flex items-center space-x-0.5">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{pending}</span>
            </span>
          </div>
        </div>
        <div className={`w-full rounded-full h-1.5 ${isDark ? 'bg-[#1e2d45]' : 'bg-gray-200'}`}>
          <div
            className={`h-1.5 rounded-full ${getProgressColor(progress)} transition-all duration-700`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Overall Progress
            </span>
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              ({total} tasks)
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {progress}%
            </span>
            {progress === 100 && (
              <span className="flex items-center text-green-500 text-sm font-medium">
                <CheckCircleIcon className="w-4 h-4 mr-1" />
                Complete
              </span>
            )}
            {progress < 20 && progress > 0 && (
              <span className="flex items-center text-yellow-500 text-sm font-medium">
                <WarningIcon className="w-4 h-4 mr-1" />
                Just Started
              </span>
            )}
          </div>
        </div>
        <div className={`w-full rounded-full h-3 ${isDark ? 'bg-[#1e2d45]' : 'bg-gray-200'} overflow-hidden`}>
          <div
            className={`h-3 rounded-full ${getProgressColor(progress)} transition-all duration-1000 ease-out`}
            style={{ width: `${progress}%` }}
          >
            {progress > 30 && (
              <div className="h-full flex items-center justify-end px-2">
                <span className="text-white text-[10px] font-medium">
                  {progress}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      {showLabels && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(statusCounts).map(([key, count]) => {
            const config = statusConfig[key];
            if (!config) return null;
            
            return (
              <div
                key={key}
                className={`rounded-lg p-3 transition-all ${config.bgColor} ${
                  isDark ? 'border border-[#1e2d45]' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={config.textColorClass}>
                      {config.icon}
                    </span>
                    <span className={`text-sm font-medium ${config.textColorClass}`}>
                      {count}
                    </span>
                  </div>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {config.label}
                  </span>
                </div>
                <div className="mt-1.5">
                  <div className={`w-full rounded-full h-1 ${isDark ? 'bg-[#1e2d45]' : 'bg-gray-200'}`}>
                    <div
                      className={`h-1 rounded-full ${config.color} transition-all duration-500`}
                      style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Stats */}
      {showLabels && (
        <div className={`flex flex-wrap gap-4 pt-3 text-xs ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span>Completed: {completed}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>In Progress: {inProgress}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <span>Pending: {pending}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>On Hold: {onHold}</span>
          </div>
          <div className="flex items-center space-x-1 ml-auto">
            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>
              {total}
            </span>
            <span>Total Tasks</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskProgressBar;