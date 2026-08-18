// src/api/tasksApi.js
import apiClient from './config';

export const tasksApi = {
  /**
   * Create a new task
   */
  createTask: (taskData) => {
    return apiClient.post('/Tasks', taskData);
  },

  /**
   * Get task by ID
   */
  getTask: (taskId) => {
    return apiClient.get(`/Tasks/${taskId}`);
  },

  /**
   * Get tasks by project
   */
  getTasksByProject: (projectId, params = {}) => {
    return apiClient.get(`/Tasks/project/${projectId}`, { params });
  },

  /**
   * Get tasks by assignee
   */
  getTasksByAssignee: (userId, params = {}) => {
    return apiClient.get(`/Tasks/assignee/${userId}`, { params });
  },

  /**
   * Update task
   */
  updateTask: (taskId, taskData) => {
    return apiClient.put(`/Tasks/${taskId}`, taskData);
  },

  /**
   * Delete task
   */
  deleteTask: (taskId) => {
    return apiClient.delete(`/Tasks/${taskId}`);
  },

  /**
   * Update task status
   */
  updateTaskStatus: (taskId, status) => {
    return apiClient.patch(`/Tasks/${taskId}/status`, { status });
  }
};