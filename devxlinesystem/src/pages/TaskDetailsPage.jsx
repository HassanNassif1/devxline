import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { tasksApi } from '../api/tasksApi';
import Loader from '../components/common/Loader';

const TaskDetailsPage = () => {
  const { taskId, projectId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const response = await tasksApi.getTask(taskId);
      setTask(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching task details:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load task details',
        icon: 'error',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setLoading(false);
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
    });

    if (result.isConfirmed) {
      try {
        await tasksApi.deleteTask(taskId);
        Swal.fire('Deleted!', 'Task has been deleted.', 'success');
        navigate(projectId ? `/projects/${projectId}/tasks` : '/tasks');
      } catch (error) {
        Swal.fire('Error!', error.response?.data?.message || 'Failed to delete task', 'error');
      }
    }
  };

  if (loading) return <Loader />;
  if (!task) return <div>Task not found</div>;

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
            Task Details
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/tasks/edit/${taskId}`)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition flex items-center space-x-2"
          >
            <EditIcon className="w-5 h-5" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition flex items-center space-x-2"
          >
            <DeleteIcon className="w-5 h-5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Task Name</label>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{task.taskName}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Project</label>
            <p className="text-gray-900 dark:text-white">{task.projectName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
            <p className="text-gray-900 dark:text-white">{task.status}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned To</label>
            <p className="text-gray-900 dark:text-white">{task.assignedToName || task.assignedTo}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned By</label>
            <p className="text-gray-900 dark:text-white">{task.assignedByName || task.assignedBy}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</label>
            <p className="text-gray-900 dark:text-white">
              {new Date(task.startDateTime).toLocaleString()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">End Date</label>
            <p className="text-gray-900 dark:text-white">
              {new Date(task.endDateTime).toLocaleString()}
            </p>
          </div>
        </div>

        {task.description && (
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
            <p className="text-gray-900 dark:text-white">{task.description}</p>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</label>
          <p className="text-gray-900 dark:text-white">
            {new Date(task.createdDate).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPage;