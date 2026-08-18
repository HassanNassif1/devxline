import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  Add as AddIcon, 
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
} from '@mui/icons-material';
import TaskCard from './TaskCard';
import TaskListView from './TasksListView';
import Loader from '../common/Loader';
import { tasksApi } from '../../api/tasksApi';
import { projectsApi } from '../../api/projectsApi';
import { useTheme } from '../../context/ThemeContext';

const Tasks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();
  const { isDark } = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filters, setFilters] = useState({
    search: '',
    status: '',
  });

  // Determine which tasks to fetch based on route
  const getTaskType = () => {
    if (location.pathname.includes('/tasks/my')) return 'my';
    if (location.pathname.includes('/tasks/today')) return 'today';
    if (location.pathname.includes('/tasks/upcoming')) return 'upcoming';
    if (location.pathname.includes('/tasks/pending')) return 'pending';
    if (location.pathname.includes('/tasks/completed')) return 'completed';
    if (location.pathname.includes('/tasks/overdue')) return 'overdue';
    return 'all';
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
    fetchTasks();
  }, [projectId, filters, location.pathname]);

  const fetchProjectDetails = async () => {
    try {
      const response = await projectsApi.getProject(projectId);
      setProject(response.data.data || response.data || null);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      let response;
      const taskType = getTaskType();
      const currentUserId = parseInt(localStorage.getItem('userId')) || 1;

      if (projectId) {
        // Fetch tasks for specific project
        response = await tasksApi.getTasksByProject(projectId, filters);
      } else {
        // Fetch tasks based on route
        switch (taskType) {
          case 'my':
            response = await tasksApi.getTasksByAssignee(currentUserId, filters);
            break;
          case 'today':
            response = await tasksApi.getTasksByAssignee(currentUserId, { 
              ...filters, 
              date: 'today' 
            });
            break;
          case 'upcoming':
            response = await tasksApi.getTasksByAssignee(currentUserId, { 
              ...filters, 
              date: 'upcoming' 
            });
            break;
          case 'pending':
            response = await tasksApi.getTasksByAssignee(currentUserId, { 
              ...filters, 
              status: 'Pending' 
            });
            break;
          case 'completed':
            response = await tasksApi.getTasksByAssignee(currentUserId, { 
              ...filters, 
              status: 'Completed' 
            });
            break;
          case 'overdue':
            response = await tasksApi.getTasksByAssignee(currentUserId, { 
              ...filters, 
              date: 'overdue' 
            });
            break;
          default:
            // All tasks - you might need a separate endpoint or fetch from projects
            response = await tasksApi.getTasksByAssignee(currentUserId, filters);
            break;
        }
      }
      
      const data = response.data.data || response.data || [];
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleStatusFilter = (e) => {
    setFilters({ ...filters, status: e.target.value });
  };

  const handleRefresh = () => {
    fetchTasks();
  };

  const handleTaskUpdate = () => {
    fetchTasks();
  };

  const getPageTitle = () => {
    const taskType = getTaskType();
    const titles = {
      'my': 'My Tasks',
      'today': "Today's Tasks",
      'upcoming': 'Upcoming Tasks',
      'pending': 'Pending Tasks',
      'completed': 'Completed Tasks',
      'overdue': 'Overdue Tasks',
      'all': 'All Tasks'
    };
    return project ? `${project.projectName || project.name} - Tasks` : titles[taskType] || 'Tasks';
  };

  const getPageDescription = () => {
    if (project) {
      return `Client: ${project.clientName || project.client}`;
    }
    const descriptions = {
      'my': 'Tasks assigned to you',
      'today': 'Tasks due today',
      'upcoming': 'Tasks due this week',
      'pending': 'Tasks awaiting action',
      'completed': 'Tasks you have completed',
      'overdue': 'Tasks past their deadline',
      'all': 'Manage all your tasks'
    };
    return descriptions[getTaskType()] || 'Manage your tasks';
  };

  const statusOptions = ['', 'Pending', 'In Progress', 'Completed', 'On Hold'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {getPageTitle()}
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            {getPageDescription()}
          </p>
          <div className="mt-1 flex items-center space-x-4">
            <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex rounded-lg border border-gray-300 dark:border-[#1e2d45] overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition ${
                viewMode === 'grid'
                  ? 'bg-blue-500 text-white'
                  : isDark ? 'text-gray-400 hover:bg-[#1a2438]' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ViewModuleIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition ${
                viewMode === 'list'
                  ? 'bg-blue-500 text-white'
                  : isDark ? 'text-gray-400 hover:bg-[#1a2438]' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ViewListIcon className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleRefresh}
            className={`p-2 rounded-lg transition ${
              isDark 
                ? 'hover:bg-[#1a2438] text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
            title="Refresh tasks"
          >
            <RefreshIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate(projectId ? `/projects/${projectId}/tasks/add` : '/tasks/add')}
            className="btn-primary flex items-center space-x-2 text-white px-4 py-2 rounded-lg font-medium"
          >
            <AddIcon className="w-5 h-5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search tasks by name or project..."
            value={filters.search}
            onChange={handleSearch}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isDark 
                ? 'bg-[#1a2438] border-[#1e2d45] text-white placeholder-gray-500' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>
        <select
          value={filters.status}
          onChange={handleStatusFilter}
          className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            isDark 
              ? 'bg-[#1a2438] border-[#1e2d45] text-white' 
              : 'bg-white border-gray-300 text-gray-700'
          }`}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status || 'All Status'}
            </option>
          ))}
        </select>
      </div>

      {/* Tasks Display */}
      {loading ? (
        <Loader />
      ) : (
        <>
          {tasks.length === 0 ? (
            <div className={`col-span-full py-12 text-center ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <p className="text-lg">No tasks found</p>
              <p className="text-sm mt-2">
                {projectId 
                  ? 'Create a new task for this project' 
                  : getTaskType() === 'my' 
                    ? 'You have no assigned tasks' 
                    : 'Create a new task to get started'}
              </p>
              {!projectId && (
                <button
                  onClick={() => navigate('/tasks/add')}
                  className="mt-4 btn-primary text-white px-4 py-2 rounded-lg font-medium"
                >
                  Create Your First Task
                </button>
              )}
            </div>
          ) : (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map((task) => (
                  <TaskCard 
                    key={task.taskId || task.id} 
                    task={task} 
                    onUpdate={handleTaskUpdate}
                    projectId={projectId}
                  />
                ))}
              </div>
            ) : (
              <TaskListView 
                tasks={tasks} 
                onUpdate={handleTaskUpdate}
                projectId={projectId}
              />
            )
          )}
        </>
      )}
    </div>
  );
};

export default Tasks;