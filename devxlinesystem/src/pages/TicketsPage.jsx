import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Visibility as ViewIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  ListAlt as ListAltIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import TicketsAPI from '../api/tickets';
import UsersAPI from '../api/users';

const TicketsPage = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('all');
  const [users, setUsers] = useState([]);

  // Determine which view we're on
  useEffect(() => {
    const path = location.pathname;
    if (path === '/tickets/my') {
      setCurrentView('my');
    } else if (path === '/tickets/reported') {
      setCurrentView('reported');
    } else {
      setCurrentView('all');
    }
  }, [location.pathname]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get current user from localStorage
      const storedUser = localStorage.getItem('user');
      let currentUser = null;
      if (storedUser) {
        try {
          currentUser = JSON.parse(storedUser);
        } catch (e) {
          console.error('Error parsing user from localStorage:', e);
        }
      }
      
      // If user is not in localStorage but is in context, use that
      if (!currentUser && user) {
        currentUser = user;
      }
      
      console.log('Current user from storage:', currentUser);
      
      // Fetch tickets based on the view
      let ticketsResponse;
      
      if (currentView === 'my') {
        // Fetch tickets assigned to the current user
        const userId = currentUser?.userId || currentUser?.id || 1;
        ticketsResponse = await TicketsAPI.getAssignedToUser(userId);
        console.log('Fetching assigned tickets for user:', userId);
      } else if (currentView === 'reported') {
        // Fetch tickets reported by the current user
        const userId = currentUser?.userId || currentUser?.id || 1;
        ticketsResponse = await TicketsAPI.getReportedByUser(userId);
        console.log('Fetching reported tickets for user:', userId);
      } else {
        // Fetch all tickets
        ticketsResponse = await TicketsAPI.getAll();
        console.log('Fetching all tickets');
      }
      
      // Extract tickets data
      let ticketsData = ticketsResponse.data || [];
      if (!Array.isArray(ticketsData)) {
        if (ticketsData.$values && Array.isArray(ticketsData.$values)) {
          ticketsData = ticketsData.$values;
        } else if (ticketsData.data && Array.isArray(ticketsData.data)) {
          ticketsData = ticketsData.data;
        } else if (ticketsData.items && Array.isArray(ticketsData.items)) {
          ticketsData = ticketsData.items;
        } else if (ticketsData.tickets && Array.isArray(ticketsData.tickets)) {
          ticketsData = ticketsData.tickets;
        } else {
          ticketsData = [];
        }
      }
      
      console.log('Tickets data:', ticketsData);
      
      // Fetch users for display names
      const usersResponse = await UsersAPI.getAll();
      let usersData = usersResponse.data || [];
      if (!Array.isArray(usersData)) {
        if (usersData.$values && Array.isArray(usersData.$values)) {
          usersData = usersData.$values;
        } else if (usersData.data && Array.isArray(usersData.data)) {
          usersData = usersData.data;
        } else if (usersData.items && Array.isArray(usersData.items)) {
          usersData = usersData.items;
        } else {
          usersData = [];
        }
      }
      
      setUsers(Array.isArray(usersData) ? usersData : []);
      setTickets(Array.isArray(ticketsData) ? ticketsData : []);
      setFilteredTickets(Array.isArray(ticketsData) ? ticketsData : []);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setTickets([]);
      setFilteredTickets([]);
      setUsers([]);
      
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to load tickets',
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch data when view changes
  useEffect(() => {
    if (!loading) {
      fetchData();
    }
  }, [currentView]);

  const getUserName = (userId) => {
    if (!Array.isArray(users)) return 'Unknown';
    const foundUser = users.find(u => (u.userId || u.id) === userId);
    return foundUser ? `${foundUser.firstName || ''} ${foundUser.lastName || ''}`.trim() || foundUser.email || 'Unknown' : 'Unknown';
  };

  const handleDelete = (id, subject) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete ticket "${subject}"?`,
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
          setTickets(prev => prev.filter(t => (t.ticketId || t.id) !== id));
          setFilteredTickets(prev => prev.filter(t => (t.ticketId || t.id) !== id));
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

  const handleAssign = (ticket) => {
    const ticketId = ticket.ticketId || ticket.id;
    const assigneeOptions = {};
    users.forEach(u => {
      const name = `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email || 'Unknown';
      assigneeOptions[u.userId || u.id] = name;
    });

    Swal.fire({
      title: 'Assign Ticket',
      text: `Assign "${ticket.subject}" to:`,
      input: 'select',
      inputOptions: assigneeOptions,
      inputPlaceholder: 'Select assignee',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Assign',
      background: isDark ? '#141c2b' : '#ffffff',
      color: isDark ? '#e8edf5' : '#0f172a',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await TicketsAPI.assign(ticketId, { assigneeId: parseInt(result.value) });
          
          // Update local state
          const updated = tickets.map(t => 
            (t.ticketId || t.id) === ticketId ? { ...t, assigneeId: parseInt(result.value), status: 'In Progress' } : t
          );
          setTickets(updated);
          setFilteredTickets(updated);
          
          Swal.fire({
            title: 'Assigned!',
            text: `Ticket assigned successfully`,
            icon: 'success',
            background: isDark ? '#141c2b' : '#ffffff',
            color: isDark ? '#e8edf5' : '#0f172a',
            confirmButtonColor: '#3b82f6',
          });
        } catch (error) {
          console.error('Error assigning ticket:', error);
          Swal.fire({
            title: 'Error!',
            text: error.response?.data?.message || 'Failed to assign ticket',
            icon: 'error',
            background: isDark ? '#141c2b' : '#ffffff',
            color: isDark ? '#e8edf5' : '#0f172a',
            confirmButtonColor: '#3b82f6',
          });
        }
      }
    });
  };

  const handleResolve = (ticket) => {
    const ticketId = ticket.ticketId || ticket.id;
    
    Swal.fire({
      title: 'Resolve Ticket',
      text: `Resolve "${ticket.subject}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, resolve it!',
      background: isDark ? '#141c2b' : '#ffffff',
      color: isDark ? '#e8edf5' : '#0f172a',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await TicketsAPI.updateStatus(ticketId, { status: 'Resolved' });
          
          const updated = tickets.map(t => 
            (t.ticketId || t.id) === ticketId ? { ...t, status: 'Resolved' } : t
          );
          setTickets(updated);
          setFilteredTickets(updated);
          
          Swal.fire({
            title: 'Resolved!',
            text: 'Ticket has been resolved.',
            icon: 'success',
            background: isDark ? '#141c2b' : '#ffffff',
            color: isDark ? '#e8edf5' : '#0f172a',
            confirmButtonColor: '#3b82f6',
          });
        } catch (error) {
          console.error('Error resolving ticket:', error);
          Swal.fire({
            title: 'Error!',
            text: error.response?.data?.message || 'Failed to resolve ticket',
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

  const getPageTitle = () => {
    switch (currentView) {
      case 'my':
        return 'My Tickets';
      case 'reported':
        return 'Reported Tickets';
      default:
        return 'Ticket Management';
    }
  };

  const getPageDescription = () => {
    switch (currentView) {
      case 'my':
        return 'Tickets assigned to you';
      case 'reported':
        return 'Tickets you have reported';
      default:
        return 'Manage support tickets and assignments';
    }
  };

  const getTicketCount = () => {
    const count = filteredTickets.length;
    switch (currentView) {
      case 'my':
        return `${count} ticket${count !== 1 ? 's' : ''} assigned to you`;
      case 'reported':
        return `${count} ticket${count !== 1 ? 's' : ''} reported by you`;
      default:
        return `${count} total ticket${count !== 1 ? 's' : ''}`;
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {getPageTitle()}
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            {getPageDescription()}
          </p>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {getTicketCount()}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-lg transition ${
              isDark 
                ? 'hover:bg-[#1a2438] text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
            title="Refresh"
          >
            <RefreshIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => navigate('/tickets/add')}
            className="btn-primary flex items-center space-x-2 px-4 py-2 rounded-lg text-white"
          >
            <AddIcon className="w-5 h-5" />
            <span>Create Ticket</span>
          </button>
        </div>
      </div>

      {/* View Info Banner */}
      {currentView !== 'all' && (
        <div className={`p-4 rounded-lg border ${
          currentView === 'my' 
            ? isDark ? 'border-blue-500/30 bg-blue-500/10' : 'border-blue-200 bg-blue-50'
            : isDark ? 'border-purple-500/30 bg-purple-500/10' : 'border-purple-200 bg-purple-50'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentView === 'my' 
                ? 'bg-blue-500 text-white' 
                : 'bg-purple-500 text-white'
            }`}>
              {currentView === 'my' ? <AssignmentIcon /> : <ListAltIcon />}
            </div>
            <div>
              <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {currentView === 'my' ? 'Your Assigned Tickets' : 'Your Reported Tickets'}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {currentView === 'my' 
                  ? 'Showing tickets that are assigned to you' 
                  : 'Showing tickets that you have reported'}
              </p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className={`rounded-xl overflow-hidden border ${
          isDark ? 'border-[#1e2d45]' : 'border-gray-200'
        }`}>
          {filteredTickets.length === 0 ? (
            <div className={`py-16 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="text-6xl mb-4">🎫</div>
              <p className="text-lg font-medium">No tickets found</p>
              <p className="text-sm mt-2">
                {currentView === 'my' 
                  ? 'You don\'t have any tickets assigned to you.' 
                  : currentView === 'reported'
                  ? 'You haven\'t reported any tickets yet.'
                  : 'There are no tickets in the system.'}
              </p>
              {currentView !== 'all' && (
                <button
                  onClick={() => navigate('/tickets')}
                  className="mt-4 text-blue-500 hover:text-blue-600 font-medium"
                >
                  View all tickets →
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDark ? 'bg-[#0f1623]' : 'bg-gray-50'}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Reporter</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Assignee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-[#1e2d45]' : 'divide-gray-200'}`}>
                  {filteredTickets.map((ticket) => {
                    const ticketId = ticket.ticketId || ticket.id;
                    const reporterName = ticket.reporter || getUserName(ticket.reporterId);
                    const assigneeName = ticket.assignee || getUserName(ticket.assigneeId);
                    
                    return (
                      <tr key={ticketId} className={isDark ? 'hover:bg-[#1a2438]' : 'hover:bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">#{ticketId}</td>
                        <td className="px-6 py-4 text-sm">{ticket.subject}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{reporterName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{assigneeName || 'Unassigned'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button 
                            onClick={() => navigate(`/tickets/${ticketId}`)}
                            className="icon-btn text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-1"
                            title="View"
                          >
                            <ViewIcon className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => navigate(`/tickets/${ticketId}/edit`)}
                            className="icon-btn text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 mr-1"
                            title="Edit"
                          >
                            <EditIcon className="w-5 h-5" />
                          </button>
                          {currentView !== 'reported' && ticket.status !== 'Closed' && (
                            <button 
                              onClick={() => handleAssign(ticket)}
                              className="icon-btn text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 mr-1"
                              title="Assign"
                            >
                              <AssignmentIcon className="w-5 h-5" />
                            </button>
                          )}
                          {ticket.status !== 'Resolved' && ticket.status !== 'Closed' && currentView !== 'reported' && (
                            <button 
                              onClick={() => handleResolve(ticket)}
                              className="icon-btn text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 mr-1"
                              title="Resolve"
                            >
                              <CheckCircleIcon className="w-5 h-5" />
                            </button>
                          )}
                          {(currentView === 'reported' || currentView === 'all') && (
                            <button 
                              onClick={() => handleDelete(ticketId, ticket.subject)}
                              className="icon-btn text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                              title="Delete"
                            >
                              <DeleteIcon className="w-5 h-5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketsPage;