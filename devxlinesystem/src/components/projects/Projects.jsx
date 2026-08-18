// src/pages/projects/Projects.jsx - No Animations, Static Layout
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Add as AddIcon, 
  Search as SearchIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  ViewKanban as ViewKanbanIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon
} from '@mui/icons-material';
import ProjectCard from './ProjectCard';
import ProjectKanban from './ProjectKanban';
import TaskDrawer from './TaskDrawer';
import Loader from '../common/Loader';
import { projectsApi } from '../../api/projectsApi';
import { tasksApi } from '../../api/tasksApi';
import { useTheme } from '../../context/ThemeContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Projects = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [viewMode, setViewMode] = useState('cards');
  const [filters, setFilters] = useState({
    search: '',
    status: '',
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [showTaskDrawer, setShowTaskDrawer] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [isDragging, setIsDragging] = useState(false);

  const statusConfig = useMemo(() => ({
    Active: {
      color: '#00e5ff',
      glow: 'rgba(0, 229, 255, 0.3)',
      label: 'Active',
      count: 0
    },
    'On Hold': {
      color: '#ff4da6',
      glow: 'rgba(255, 77, 166, 0.3)',
      label: 'On Hold',
      count: 0
    },
    Pending: {
      color: '#ff9900',
      glow: 'rgba(255, 153, 0, 0.3)',
      label: 'Pending',
      count: 0
    },
    Completed: {
      color: '#00ff88',
      glow: 'rgba(0, 255, 136, 0.3)',
      label: 'Completed',
      count: 0
    },
  }), []);

  useEffect(() => {
    fetchProjects();
  }, [filters, sortBy]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsApi.getProjects(filters);
      const projectsData = response.data.data || [];
      
      const projectsWithTasks = await Promise.all(
        projectsData.map(async (project) => {
          try {
            const tasksResponse = await tasksApi.getTasksByProject(project.projectId || project.id);
            const tasks = tasksResponse.data.data || [];
            return {
              ...project,
              tasks: tasks,
              taskCount: tasks.length,
              completedTasks: tasks.filter(t => t.status === 'Completed').length,
            };
          } catch (error) {
            return { ...project, tasks: [], taskCount: 0, completedTasks: 0 };
          }
        })
      );
      
      const sorted = sortProjects(projectsWithTasks, sortBy);
      setProjects(sorted);
      
      Object.keys(statusConfig).forEach(status => {
        statusConfig[status].count = sorted.filter(p => p.status === status).length;
      });
      
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const sortProjects = (projects, sortBy) => {
    const sorted = [...projects];
    switch(sortBy) {
      case 'name':
        return sorted.sort((a, b) => (a.projectName || a.name || '').localeCompare(b.projectName || b.name || ''));
      case 'status':
        return sorted.sort((a, b) => (a.status || '').localeCompare(b.status || ''));
      case 'progress':
        return sorted.sort((a, b) => (b.progress || 0) - (a.progress || 0));
      case 'deadline':
        return sorted.sort((a, b) => new Date(a.deadline || a.endDate || 0) - new Date(b.deadline || b.endDate || 0));
      default:
        return sorted;
    }
  };

  const handleDragEnd = useCallback((result) => {
    setIsDragging(false);
    if (!result.destination) return;
    
    const items = Array.from(projects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setProjects(items);
  }, [projects]);

  const handleSearch = useCallback((e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ search: '', status: '' });
  }, []);

  const handleViewTasks = useCallback((project) => {
    setSelectedProject(project);
    setShowTaskDrawer(true);
  }, []);

  const handleCloseTaskDrawer = useCallback(() => {
    setShowTaskDrawer(false);
    setSelectedProject(null);
  }, []);

  const handleProjectUpdate = useCallback(() => {
    fetchProjects();
  }, []);

  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'Active').length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    const pendingProjects = projects.filter(p => p.status === 'Pending').length;
    return { totalProjects, activeProjects, completedProjects, pendingProjects };
  }, [projects]);

  const statCards = useMemo(() => [
    { label: 'Total', value: stats.totalProjects, icon: <DashboardIcon className="w-5 h-5" />, color: 'from-blue-500 to-cyan-500', glow: 'rgba(0, 229, 255, 0.2)' },
    { label: 'Active', value: stats.activeProjects, icon: <TrendingUpIcon className="w-5 h-5" />, color: 'from-cyan-500 to-emerald-500', glow: 'rgba(0, 229, 255, 0.2)' },
    { label: 'Completed', value: stats.completedProjects, icon: <CheckCircleIcon className="w-5 h-5" />, color: 'from-emerald-500 to-green-500', glow: 'rgba(0, 255, 136, 0.2)' },
    { label: 'Pending', value: stats.pendingProjects, icon: <PendingIcon className="w-5 h-5" />, color: 'from-orange-500 to-amber-500', glow: 'rgba(255, 153, 0, 0.2)' },
  ], [stats]);

  return (
    <div className={`space-y-6 ${isDark ? 'bg-[#0a0f1f]' : 'bg-gray-50/50'} min-h-screen p-6 rounded-2xl`}>
      {/* Header - Static */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Projects
            <span className={`ml-3 text-sm font-normal ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              ({stats.totalProjects} total)
            </span>
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            Manage your project portfolio and tasks
          </p>
        </div>
        <div className="flex items-center space-x-3 flex-wrap gap-2">
          <div className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setFilters(prev => ({...prev, status: ''}))}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                !filters.status
                  ? isDark 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : isDark 
                    ? 'bg-[#1a2438] text-gray-400 hover:text-white hover:bg-[#1e2d45]' 
                    : 'bg-gray-100 text-gray-600 hover:text-gray-800 hover:bg-gray-200'
              }`}
            >
              All ({stats.totalProjects})
            </button>
            {Object.entries(statusConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setFilters(prev => ({...prev, status: prev.status === key ? '' : key}))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                  filters.status === key
                    ? 'text-white shadow-lg'
                    : isDark 
                      ? 'bg-[#1a2438] text-gray-400 hover:text-white hover:bg-[#1e2d45]' 
                      : 'bg-gray-100 text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: filters.status === key ? config.color : undefined,
                  boxShadow: filters.status === key ? `0 0 20px ${config.glow}` : undefined,
                }}
              >
                {config.label} ({config.count})
              </button>
            ))}
          </div>

          <div className={`flex rounded-lg p-1 ${isDark ? 'bg-[#1a2438]' : 'bg-gray-100'}`}>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded ${
                viewMode === 'cards'
                  ? isDark ? 'bg-[#1e2d45] text-white shadow-lg' : 'bg-white text-gray-900 shadow-sm'
                  : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Card View"
            >
              <ViewModuleIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded ${
                viewMode === 'kanban'
                  ? isDark ? 'bg-[#1e2d45] text-white shadow-lg' : 'bg-white text-gray-900 shadow-sm'
                  : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Kanban View"
            >
              <ViewKanbanIcon className="w-5 h-5" />
            </button>
          </div>
          
          <button
            onClick={() => navigate('/projects/add')}
            className={`flex items-center space-x-2 text-white px-4 py-2 rounded-lg font-medium shadow-lg ${
              isDark 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-blue-600/20' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-blue-500/30'
            }`}
          >
            <AddIcon className="w-5 h-5" />
            <span className="hidden sm:inline">New Project</span>
          </button>
        </div>
      </div>

      {/* Stats Cards - Static */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`relative p-4 rounded-2xl backdrop-blur-sm border ${
              isDark ? 'bg-[#1a2438]/80 border-[#1e2d45]' : 'bg-white/80 border-gray-200/50'
            }`}
            style={{
              boxShadow: `0 4px 20px ${stat.glow}`,
            }}
          >
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-5`} />
            <div className="relative flex items-center justify-between">
              <div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <SearchIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="Search projects..."
            value={filters.search}
            onChange={handleSearch}
            className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm ${
              isDark 
                ? 'bg-[#1a2438]/80 border-[#1e2d45] text-white placeholder-gray-500' 
                : 'bg-white/80 backdrop-blur-sm border-gray-200/50 text-gray-900'
            }`}
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-3 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
              isDark 
                ? 'bg-[#1a2438]/80 border-[#1e2d45] text-white' 
                : 'bg-white/80 backdrop-blur-sm border-gray-200/50 text-gray-700'
            }`}
          >
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
            <option value="progress">Sort by Progress</option>
            <option value="deadline">Sort by Deadline</option>
          </select>
        </div>
      </div>

      {/* Filter Chips - Static */}
      {(filters.status || filters.search) && (
        <div className="flex flex-wrap gap-2">
          {filters.status && (
            <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs ${
              isDark ? 'bg-[#1a2438] text-gray-300' : 'bg-gray-100 text-gray-700'
            }`}>
              <span>Status: {filters.status}</span>
              <button onClick={() => setFilters(prev => ({...prev, status: ''}))}>
                <CloseIcon className="w-3 h-3" />
              </button>
            </div>
          )}
          {filters.search && (
            <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs ${
              isDark ? 'bg-[#1a2438] text-gray-300' : 'bg-gray-100 text-gray-700'
            }`}>
              <span>Search: {filters.search}</span>
              <button onClick={() => setFilters(prev => ({...prev, search: ''}))}>
                <CloseIcon className="w-3 h-3" />
              </button>
            </div>
          )}
          <button
            onClick={clearFilters}
            className={`px-3 py-1.5 rounded-full text-xs ${
              isDark ? 'hover:bg-[#1a2438] text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            Clear All
          </button>
        </div>
      )}

      {/* Projects Display - Static, no animations */}
      {loading ? (
        <Loader />
      ) : (
        <DragDropContext onDragStart={() => setIsDragging(true)} onDragEnd={handleDragEnd}>
          {viewMode === 'cards' ? (
            <Droppable droppableId="projects" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 ${
                    snapshot.isDraggingOver ? 'bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl p-4 -m-4' : ''
                  }`}
                >
                  {projects.map((project, index) => {
                    const projectId = project.projectId || project.id;
                    return (
                      <Draggable 
                        key={projectId} 
                        draggableId={String(projectId)} 
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="transform-gpu"
                          >
                            <ProjectCard 
                              project={project}
                              onUpdate={handleProjectUpdate}
                              onViewTasks={handleViewTasks}
                              isDragging={snapshot.isDragging}
                              dragHandleProps={provided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                  {projects.length === 0 && (
                    <div className="col-span-full py-16 text-center">
                      <div className="text-7xl mb-4">🚀</div>
                      <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                        No projects found
                      </p>
                      <button
                        onClick={() => navigate('/projects/add')}
                        className={`mt-4 px-6 py-3 text-white rounded-xl font-medium shadow-lg ${
                          isDark 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-blue-600/20' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-blue-500/25'
                        }`}
                      >
                        <AddIcon className="w-5 h-5 inline mr-2" />
                        Create Project
                      </button>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          ) : (
            <ProjectKanban 
              projects={projects} 
              onProjectUpdate={handleProjectUpdate}
              onViewTasks={handleViewTasks}
            />
          )}
        </DragDropContext>
      )}

      {/* Task Drawer - Static slide in/out */}
      {showTaskDrawer && selectedProject && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseTaskDrawer}
          />
          <div 
            className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-[#141c2b] shadow-2xl"
          >
            <TaskDrawer 
              project={selectedProject}
              onClose={handleCloseTaskDrawer}
              onUpdate={fetchProjects}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;