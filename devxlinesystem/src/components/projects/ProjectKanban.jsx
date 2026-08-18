// src/pages/projects/ProjectKanban.jsx - Enhanced with Glow Colors
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  Task as TaskIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  DragIndicator as DragIcon
} from '@mui/icons-material';
import { projectsApi } from '../../api/projectsApi';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectKanban = ({ projects, onProjectUpdate, onViewTasks }) => {
  const { isDark } = useTheme();
  const [draggedProject, setDraggedProject] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const statuses = ['Active', 'Pending', 'On Hold', 'Completed'];
  
  // Status configuration with glow colors (matching ProjectCard)
  const statusConfig = {
    'Active': {
      color: '#00e5ff',
      glow: 'rgba(0, 229, 255, 0.3)',
      border: 'border-cyan-400/30',
      bg: 'bg-gradient-to-br from-cyan-500/10 to-emerald-500/10',
      gradient: 'from-cyan-400 to-emerald-400',
      icon: <TrendingUpIcon className="w-5 h-5" />,
      textColor: 'text-cyan-400',
    },
    'Pending': {
      color: '#ff9900',
      glow: 'rgba(255, 153, 0, 0.3)',
      border: 'border-orange-400/30',
      bg: 'bg-gradient-to-br from-orange-500/10 to-amber-500/10',
      gradient: 'from-orange-400 to-amber-400',
      icon: <PendingIcon className="w-5 h-5" />,
      textColor: 'text-orange-400',
    },
    'On Hold': {
      color: '#ff4da6',
      glow: 'rgba(255, 77, 166, 0.3)',
      border: 'border-pink-400/30',
      bg: 'bg-gradient-to-br from-pink-500/10 to-amber-500/10',
      gradient: 'from-pink-400 to-amber-400',
      icon: <ScheduleIcon className="w-5 h-5" />,
      textColor: 'text-pink-400',
    },
    'Completed': {
      color: '#00ff88',
      glow: 'rgba(0, 255, 136, 0.3)',
      border: 'border-emerald-400/30',
      bg: 'bg-gradient-to-br from-emerald-500/10 to-blue-500/10',
      gradient: 'from-emerald-400 to-blue-400',
      icon: <CheckCircleIcon className="w-5 h-5" />,
      textColor: 'text-emerald-400',
    },
  };

  // Status colors for the column backgrounds
  const statusColors = {
    'Active': 'border-cyan-400/30 bg-cyan-50/30 dark:bg-cyan-900/10',
    'Pending': 'border-orange-400/30 bg-orange-50/30 dark:bg-orange-900/10',
    'On Hold': 'border-pink-400/30 bg-pink-50/30 dark:bg-pink-900/10',
    'Completed': 'border-emerald-400/30 bg-emerald-50/30 dark:bg-emerald-900/10',
  };

  const statusIcons = {
    'Active': <TrendingUpIcon className="w-5 h-5 text-cyan-400" />,
    'Pending': <PendingIcon className="w-5 h-5 text-orange-400" />,
    'On Hold': <ScheduleIcon className="w-5 h-5 text-pink-400" />,
    'Completed': <CheckCircleIcon className="w-5 h-5 text-emerald-400" />,
  };

  const groupedProjects = statuses.reduce((acc, status) => {
    acc[status] = projects.filter(p => p.status === status);
    return acc;
  }, {});

  const handleDragStart = (e, project) => {
    setDraggedProject(project);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    // Add a ghost image effect
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedProject(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (draggedProject && draggedProject.status !== targetStatus) {
      try {
        // API call to update project status
        const projectId = draggedProject.projectId || draggedProject.id;
        await projectsApi.updateProjectStatus(projectId, targetStatus);
        if (onProjectUpdate) onProjectUpdate();
      } catch (error) {
        console.error('Error updating project status:', error);
      }
    }
    setDraggedProject(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statuses.map((status) => {
        const config = statusConfig[status];
        const projectsInColumn = groupedProjects[status] || [];
        const isDragOver = draggedProject && draggedProject.status !== status;
        
        return (
          <div
            key={status}
            className={`rounded-2xl p-4 min-h-[400px] border-2 transition-all duration-300 backdrop-blur-sm ${
              statusColors[status]
            } ${isDark ? 'border-opacity-20' : ''} ${
              isDragOver ? 'scale-[1.02] shadow-2xl' : ''
            }`}
            style={{
              boxShadow: isDragOver ? `0 0 40px ${config.glow}` : 'none',
              borderColor: isDragOver ? config.color : undefined,
            }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            {/* Column Header with Glow */}
            <div 
              className="flex items-center justify-between mb-4 p-2 rounded-xl"
              style={{
                background: isDark ? `rgba(26, 36, 56, 0.6)` : `rgba(255, 255, 255, 0.5)`,
                boxShadow: `0 0 20px ${config.glow}`,
              }}
            >
              <div className="flex items-center space-x-2">
                <span className={config.textColor}>
                  {statusIcons[status]}
                </span>
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {status}
                </h3>
              </div>
              <span 
                className={`px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                  isDark ? 'bg-[#1a2438] text-gray-300' : 'bg-white/80 text-gray-600'
                }`}
                style={{
                  boxShadow: `0 0 15px ${config.glow}`,
                }}
              >
                {projectsInColumn.length}
              </span>
            </div>

            {/* Projects List */}
            <div className="space-y-3">
              <AnimatePresence>
                {projectsInColumn.map((project, index) => {
                  const projectId = project.projectId || project.id;
                  const isDragging = draggedProject?.projectId === projectId || draggedProject?.id === projectId;
                  
                  return (
                    <motion.div
                      key={projectId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        scale: isDragging ? 0.95 : 1,
                      }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      whileHover={{ 
                        y: -2,
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, project)}
                      onDragEnd={handleDragEnd}
                      className={`rounded-xl p-4 cursor-grab active:cursor-grabbing transition-all ${
                        isDragging 
                          ? 'shadow-2xl opacity-50' 
                          : isDark 
                            ? 'bg-[#1a2438] border border-[#1e2d45] hover:border-blue-500/30' 
                            : 'bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl'
                      }`}
                      style={{
                        boxShadow: isDragging ? `0 10px 40px ${config.glow}` : undefined,
                        borderColor: isDragging ? config.color : undefined,
                      }}
                      onClick={() => onViewTasks(project)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <DragIcon className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                            <h4 className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {project.projectName || project.name}
                            </h4>
                          </div>
                          <p className={`text-sm truncate mt-0.5 ml-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {project.clientName || project.client}
                          </p>
                        </div>
                        <div 
                          className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${config.gradient} text-white shadow-lg`}
                          style={{
                            boxShadow: `0 0 20px ${config.glow}`,
                          }}
                        >
                          {project.progress || 0}%
                        </div>
                      </div>
                      
                      <div className="mt-3 ml-6">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1">
                            <TaskIcon className={`w-3 h-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                              {project.taskCount || 0} tasks
                            </span>
                          </div>
                          {project.deadline && (
                            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                              {new Date(project.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <div className={`mt-1.5 w-full rounded-full h-1.5 ${isDark ? 'bg-[#1e2d45]' : 'bg-gray-200'}`}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress || 0}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-1.5 rounded-full bg-gradient-to-r ${config.gradient}`}
                            style={{
                              boxShadow: `0 0 15px ${config.glow}`,
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {projectsInColumn.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-center py-8 text-sm ${
                    isDragOver ? 'text-blue-500' : isDark ? 'text-gray-500' : 'text-gray-400'
                  }`}
                >
                  {isDragOver ? 'Drop here' : 'No projects'}
                </motion.div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectKanban;