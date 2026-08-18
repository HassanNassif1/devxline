import apiClient from './config';
export const projectsApi = {
  /**
   * Get all projects with optional filters
   * @param {Object} params - Filter parameters
   * @param {string} params.status - Active, On Hold, Pending, Completed
   * @param {number} params.clientId - Filter by client
   * @param {number} params.assigneeId - Filter by assignee
   * @param {string} params.search - Search term
   */
  getProjects: (params) => {
    return apiClient.get('/projects', { params });
  },

  /**
   * Get project by ID with full details
   * @param {number} projectId - Project ID
   */
  getProject: (projectId) => {
    return apiClient.get(`/projects/${projectId}`);
  },

  /**
   * Create a new project
   * @param {Object} projectData - Project creation data
   */
  createProject: (projectData) => {
    return apiClient.post('/projects', projectData);
  },

  /**
   * Update an existing project
   * @param {number} projectId - Project ID
   * @param {Object} projectData - Updated project data
   */
  updateProject: (projectId, projectData) => {
    return apiClient.put(`/projects/${projectId}`, projectData);
  },

  /**
   * Delete a project
   * @param {number} projectId - Project ID
   */
  deleteProject: (projectId) => {
    return apiClient.delete(`/projects/${projectId}`);
  },

  /**
   * Update project status
   * @param {number} projectId - Project ID
   * @param {string} status - Active, On Hold, Pending, Completed
   */
  updateProjectStatus: (projectId, status) => {
    return apiClient.patch(`/projects/${projectId}/status`, { status });
  },

  /**
   * Update project progress
   * @param {number} projectId - Project ID
   * @param {number} progress - Progress percentage (0-100)
   */
  updateProjectProgress: (projectId, progress) => {
    return apiClient.patch(`/projects/${projectId}/progress`, { progress });
  },

  /**
   * Add assignees to a project
   * @param {number} projectId - Project ID
   * @param {number[]} userIds - Array of user IDs to assign
   * @param {number} assignedBy - User ID who is assigning
   */
  addAssignees: (projectId, userIds, assignedBy) => {
    return apiClient.post(`/projects/${projectId}/assignees`, { userIds, assignedBy });
  },

  /**
   * Remove an assignee from a project
   * @param {number} projectId - Project ID
   * @param {number} userId - User ID to remove
   */
  removeAssignee: (projectId, userId) => {
    return apiClient.delete(`/projects/${projectId}/assignees/${userId}`);
  }
};