import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import TicketsAPI from '../api/tickets';
import UsersAPI from '../api/users';

const TicketEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    subject: '',
    status: 'Open',
    priority: 'Medium',
    reporterId: '',
    assigneeId: '',
    description: ''
  });

  const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
  const priorities = ['Critical', 'High', 'Medium', 'Low'];

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [ticketResponse, usersResponse] = await Promise.all([
        TicketsAPI.getById(id),
        UsersAPI.getAll()
      ]);
      
      // Extract ticket data
      let ticketData = ticketResponse.data || {};
      if (ticketData.$values && Array.isArray(ticketData.$values)) {
        ticketData = ticketData.$values[0] || {};
      } else if (ticketData.data) {
        ticketData = ticketData.data;
      }
      
      // Extract users data
      let usersData = usersResponse.data || [];
      if (!Array.isArray(usersData)) {
        if (usersData.$values && Array.isArray(usersData.$values)) {
          usersData = usersData.$values;
        } else if (usersData.data && Array.isArray(usersData.data)) {
          usersData = usersData.data;
        } else {
          usersData = [];
        }
      }
      setUsers(Array.isArray(usersData) ? usersData : []);
      
      setFormData({
        subject: ticketData.subject || '',
        status: ticketData.status || 'Open',
        priority: ticketData.priority || 'Medium',
        reporterId: ticketData.reporterId || '',
        assigneeId: ticketData.assigneeId || '',
        description: ticketData.description || ''
      });
      
    } catch (error) {
      console.error('Error fetching ticket:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to load ticket',
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
      navigate('/tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      const ticketData = {
        subject: formData.subject,
        status: formData.status,
        priority: formData.priority,
        reporterId: parseInt(formData.reporterId) || null,
        assigneeId: parseInt(formData.assigneeId) || null,
        description: formData.description || ''
      };
      
      await TicketsAPI.update(id, ticketData);
      
      Swal.fire({
        title: 'Success!',
        text: 'Ticket updated successfully',
        icon: 'success',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
      navigate(`/tickets/${id}`);
    } catch (error) {
      console.error('Error updating ticket:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update ticket',
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(`/tickets/${id}`)}
          className="icon-btn"
          disabled={submitting}
        >
          <ArrowBackIcon />
        </button>
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Edit Ticket
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            Update ticket information
          </p>
        </div>
      </div>

      <div className={`rounded-xl p-6 border ${
        isDark ? 'border-[#1e2d45] bg-[#141c2b]' : 'border-gray-200 bg-white'
      }`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Subject *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDark ? 'bg-[#1a2438] border-[#1e2d45] text-white' : 'bg-white border-gray-300'
              }`}
              required
              disabled={submitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark ? 'bg-[#1a2438] border-[#1e2d45] text-white' : 'bg-white border-gray-300'
                }`}
                disabled={submitting}
              >
                {statuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark ? 'bg-[#1a2438] border-[#1e2d45] text-white' : 'bg-white border-gray-300'
                }`}
                disabled={submitting}
              >
                {priorities.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Reporter
              </label>
              <select
                value={formData.reporterId}
                onChange={(e) => setFormData({ ...formData, reporterId: parseInt(e.target.value) })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark ? 'bg-[#1a2438] border-[#1e2d45] text-white' : 'bg-white border-gray-300'
                }`}
                disabled={submitting}
              >
                <option value="">Select Reporter</option>
                {Array.isArray(users) && users.map(u => {
                  const userId = u.userId || u.id;
                  const userName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email || 'Unknown';
                  return (
                    <option key={userId} value={userId}>{userName}</option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Assignee
              </label>
              <select
                value={formData.assigneeId}
                onChange={(e) => setFormData({ ...formData, assigneeId: parseInt(e.target.value) })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark ? 'bg-[#1a2438] border-[#1e2d45] text-white' : 'bg-white border-gray-300'
                }`}
                disabled={submitting}
              >
                <option value="">Select Assignee</option>
                {Array.isArray(users) && users.map(u => {
                  const userId = u.userId || u.id;
                  const userName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email || 'Unknown';
                  return (
                    <option key={userId} value={userId}>{userName}</option>
                  );
                })}
              </select>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDark ? 'bg-[#1a2438] border-[#1e2d45] text-white' : 'bg-white border-gray-300'
              }`}
              disabled={submitting}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-[#1e2d45]">
            <button
              type="button"
              onClick={() => navigate(`/tickets/${id}`)}
              className="px-6 py-2 rounded-lg border border-gray-300 dark:border-[#1e2d45] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a2438] transition"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2 px-6 py-2 rounded-lg text-white"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <SaveIcon className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketEditPage;