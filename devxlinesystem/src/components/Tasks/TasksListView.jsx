import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
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

const TaskListView = ({ tasks, onUpdate, projectId }) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

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

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await tasksApi.updateTaskStatus(taskId, newStatus);
      if (onUpdate) onUpdate();
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update task status',
        icon: 'error',
        confirmButtonColor: '#3b82f6',
      });
    }
  };

  const handleDelete = async (taskId) => {
    const result = await Swal.fire({
      title: 'Delete Task?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it',
    });

    if (result.isConfirmed) {
      try {
        await tasksApi.deleteTask(taskId);
        Swal.fire('Deleted!', 'Task has been deleted.', 'success');
        if (onUpdate) onUpdate();
      } catch (error) {
        Swal.fire('Error!', error.response?.data?.message || 'Failed to delete task', 'error');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`rounded-xl overflow-hidden border ${
      isDark ? 'border-[#1e2d45]' : 'border-gray-200'
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${isDark ? 'bg-[#1a2438]' : 'bg-gray-50'}`}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-[#1e2d45]">
            {tasks.map((task) => {
              const taskId = task.taskId || task.id;
              const StatusIcon = statusIcons[task.status] || PendingIcon;
              
              return (
                <tr key={taskId} className={`${
                  isDark ? 'bg-[#0a0e17] hover:bg-[#1a2438]' : 'bg-white hover:bg-gray-50'
                } transition`}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {task.taskName || task.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                      <ProjectIcon className="w-4 h-4" />
                      <span>{task.projectName || task.project}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${
                      statusColors[task.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      <StatusIcon className="w-3 h-3" />
                      <span>{task.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                      <PersonIcon className="w-4 h-4" />
                      <span>{task.assignedToName || task.assignedTo || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{formatDate(task.endDateTime || task.endDate)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        const basePath = projectId ? `/projects/${projectId}/tasks` : '/tasks';
                        navigate(`${basePath}/edit/${taskId}`);
                      }}
                      className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
                    >
                      <EditIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(taskId)}
                      className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition"
                    >
                      <DeleteIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskListView;