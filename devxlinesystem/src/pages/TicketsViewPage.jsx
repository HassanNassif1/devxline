import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Flag as FlagIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import TicketsAPI from '../api/tickets';
import UsersAPI from '../api/users';

const TicketViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

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
      setTicket(ticketData);
      
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

  const getUserName = (userId) => {
    if (!Array.isArray(users)) return 'Unknown';
    const foundUser = users.find(u => (u.userId || u.id) === userId);
    return foundUser ? `${foundUser.firstName || ''} ${foundUser.lastName || ''}`.trim() || foundUser.email || 'Unknown' : 'Unknown';
  };

  const handleDelete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete ticket "${ticket?.subject}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete!',
      background: isDark ? '#141c2b' : '#ffffff',
      color: isDark ? '#e8edf5' : '#0f172a',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await TicketsAPI.delete(id);
          navigate('/tickets');
          Swal.fire({
            title: 'Deleted!',
            text: 'Ticket has been deleted.',
            icon: 'success',
            background: isDark ? '#141c2b' : '#ffffff',
            color: isDark ? '#e8edf5' : '#0f172a',
            confirmButtonColor: '#3b82f6',
          });
        } catch (error) {
          console.error('Error deleting ticket:', error);
          Swal.fire({
            title: 'Error!',
            text: error.response?.data?.message || 'Failed to delete ticket',
            icon: 'error',
            background: isDark ? '#141c2b' : '#ffffff',
            color: isDark ? '#e8edf5' : '#0f172a',
            confirmButtonColor: '#3b82f6',
          });
        }
      }
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Open': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'Resolved': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'Closed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-400';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Critical': 'text-red-600 dark:text-red-400 font-bold',
      'High': 'text-orange-600 dark:text-orange-400',
      'Medium': 'text-yellow-600 dark:text-yellow-400',
      'Low': 'text-green-600 dark:text-green-400',
    };
    return colors[priority] || 'text-gray-600 dark:text-gray-400';
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Ticket not found</p>
      </div>
    );
  }

  const ticketId = ticket.ticketId || ticket.id;
  const reporterName = ticket.reporter || getUserName(ticket.reporterId);
  const assigneeName = ticket.assignee || getUserName(ticket.assigneeId);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/tickets')}
            className="icon-btn"
          >
            <ArrowBackIcon />
          </button>
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              #{ticketId} - {ticket.subject}
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              Ticket Details
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/tickets/${ticketId}/edit`)}
            className="btn-primary flex items-center space-x-2 px-4 py-2 rounded-lg text-white"
          >
            <EditIcon className="w-5 h-5" />
            <span>Edit Ticket</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            <DeleteIcon className="w-5 h-5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`rounded-xl p-6 border ${
          isDark ? 'border-[#1e2d45] bg-[#141c2b]' : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center space-x-3">
            <FlagIcon className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-6 border ${
          isDark ? 'border-[#1e2d45] bg-[#141c2b]' : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center space-x-3">
            <FlagIcon className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Priority</p>
              <p className={`font-medium ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority}
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-6 border ${
          isDark ? 'border-[#1e2d45] bg-[#141c2b]' : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center space-x-3">
            <PersonIcon className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Reporter</p>
              <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{reporterName}</p>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-6 border ${
          isDark ? 'border-[#1e2d45] bg-[#141c2b]' : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center space-x-3">
            <AssignmentIcon className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Assignee</p>
              <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {assigneeName || 'Unassigned'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={`rounded-xl p-6 border ${
        isDark ? 'border-[#1e2d45] bg-[#141c2b]' : 'border-gray-200 bg-white'
      }`}>
        <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Description
        </h3>
        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {ticket.description || 'No description provided.'}
        </p>
        <div className="mt-4 flex items-center space-x-2">
          <CalendarIcon className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Created: {ticket.created || ticket.createdAt || ticket.createdDate || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TicketViewPage;