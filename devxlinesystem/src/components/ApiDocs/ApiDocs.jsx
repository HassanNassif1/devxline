// src/pages/ApiDocs/ApiDocs.jsx - Fixed initialization error
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CopyAll as CopyAllIcon,
  Check as CheckIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Api as ApiIcon,
  Lock as LockIcon,
  Send as SendIcon,
  Description as DescriptionIcon,
  Code as CodeIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  HourglassEmpty as HourglassEmptyIcon
} from '@mui/icons-material';

const ApiDocs = () => {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRequests, setExpandedRequests] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [copied, setCopied] = useState(null);
  const [showApiRequestForm, setShowApiRequestForm] = useState(false);
  const [apiRequests, setApiRequests] = useState([]);
  
  // API Request Form State
  const [apiRequest, setApiRequest] = useState({
    developerName: '',
    developerEmail: '',
    apiName: '',
    apiPath: '',
    method: 'GET',
    description: '',
    requestBody: '',
    responseBody: '',
    authRequired: false,
    category: '',
    priority: 'Medium',
    estimatedTime: '',
    additionalNotes: ''
  });

  // Define getDefaultCategories BEFORE using it
  const getDefaultCategories = () => {
    return [
      { id: 'auth', name: 'Authentication', icon: '🔐', isExpanded: true },
      { id: 'users', name: 'Users', icon: '👥', isExpanded: true },
      { id: 'projects', name: 'Projects', icon: '📁', isExpanded: false },
      { id: 'clients', name: 'Clients', icon: '🏢', isExpanded: false }
    ];
  };

  // Categories state - now getDefaultCategories is defined
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('apiCategories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return getDefaultCategories();
      }
    }
    return getDefaultCategories();
  });

  // Load API requests from localStorage
  useEffect(() => {
    const savedRequests = localStorage.getItem('apiRequests');
    if (savedRequests) {
      try {
        setApiRequests(JSON.parse(savedRequests));
      } catch {
        setApiRequests([]);
      }
    }
  }, []);

  // Save categories to localStorage
  useEffect(() => {
    localStorage.setItem('apiCategories', JSON.stringify(categories));
  }, [categories]);

  // Save requests to localStorage
  useEffect(() => {
    localStorage.setItem('apiRequests', JSON.stringify(apiRequests));
  }, [apiRequests]);

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Submit API Request
  const handleApiRequestSubmit = (e) => {
    e.preventDefault();
    
    if (!apiRequest.apiName.trim() || !apiRequest.apiPath.trim()) {
      alert('Please fill in required fields: API Name and Path');
      return;
    }

    const newRequest = {
      id: generateId(),
      ...apiRequest,
      submittedAt: new Date().toISOString(),
      status: 'Pending Review'
    };

    setApiRequests([...apiRequests, newRequest]);
    
    // Reset form
    setApiRequest({
      developerName: '',
      developerEmail: '',
      apiName: '',
      apiPath: '',
      method: 'GET',
      description: '',
      requestBody: '',
      responseBody: '',
      authRequired: false,
      category: '',
      priority: 'Medium',
      estimatedTime: '',
      additionalNotes: ''
    });
    
    setShowApiRequestForm(false);
    alert('API request submitted successfully!');
  };

  // Update request status
  const updateRequestStatus = (requestId, newStatus) => {
    setApiRequests(apiRequests.map(req => 
      req.id === requestId ? { ...req, status: newStatus } : req
    ));
  };

  // Delete request
  const deleteRequest = (requestId) => {
    if (window.confirm('Are you sure you want to delete this API request?')) {
      setApiRequests(apiRequests.filter(req => req.id !== requestId));
    }
  };

  // Toggle request expansion
  const toggleRequestExpand = (requestId) => {
    setExpandedRequests(prev => ({
      ...prev,
      [requestId]: !prev[requestId]
    }));
  };

  // Toggle category expansion
  const toggleCategoryExpand = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: 'bg-blue-500',
      POST: 'bg-green-500',
      PUT: 'bg-yellow-500',
      DELETE: 'bg-red-500',
      PATCH: 'bg-purple-500'
    };
    return colors[method] || 'bg-gray-500';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending Review': 'bg-yellow-500/20 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
      'In Progress': 'bg-blue-500/20 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      'Completed': 'bg-green-500/20 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      'Rejected': 'bg-red-500/20 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      'On Hold': 'bg-orange-500/20 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Pending Review': <HourglassEmptyIcon className="w-4 h-4" />,
      'In Progress': <ScheduleIcon className="w-4 h-4" />,
      'Completed': <CheckCircleIcon className="w-4 h-4" />,
      'Rejected': <WarningIcon className="w-4 h-4" />,
      'On Hold': <PendingIcon className="w-4 h-4" />
    };
    return icons[status] || <PendingIcon className="w-4 h-4" />;
  };

  // Get requests by category
  const getRequestsByCategory = (categoryName) => {
    return apiRequests.filter(req => req.category === categoryName);
  };

  // Calculate stats
  const totalRequests = apiRequests.length;
  const pendingRequests = apiRequests.filter(r => r.status === 'Pending Review').length;
  const getRequestsByMethod = (method) => {
    return apiRequests.filter(req => req.method === method).length;
  };

  // Filter requests based on search
  const filteredRequests = apiRequests.filter(req => 
    req.apiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.apiPath.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${isDark ? 'bg-[#0a0f1f]' : 'bg-gray-50'} min-h-screen p-6 rounded-2xl`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className={`text-3xl font-bold flex items-center space-x-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <ApiIcon className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <span>API Documentation</span>
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              Complete API reference for backend development
            </p>
          </div>
          <div className="flex items-center space-x-3 flex-wrap gap-2">
            <button
              onClick={() => setShowApiRequestForm(!showApiRequestForm)}
              className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 ${
                isDark 
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700' 
                  : 'bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600'
              }`}
            >
              {showApiRequestForm ? <CloseIcon className="w-4 h-4" /> : <SendIcon className="w-4 h-4" />}
              <span>{showApiRequestForm ? 'Cancel' : 'Request API'}</span>
            </button>
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              v1.0.0
            </span>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
            }`}>
              ● Live
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className={`flex flex-wrap items-center gap-4 p-4 rounded-xl border mb-6 ${
          isDark ? 'bg-[#1a2438]/80 border-[#1e2d45]' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center space-x-6 flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Requests</span>
              <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{totalRequests}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Categories</span>
              <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{categories.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Pending</span>
              <span className={`font-bold text-yellow-500`}>{pendingRequests}</span>
            </div>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                GET {getRequestsByMethod('GET')}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`}>
                POST {getRequestsByMethod('POST')}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700'}`}>
                PUT {getRequestsByMethod('PUT')}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'}`}>
                DELETE {getRequestsByMethod('DELETE')}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
                PATCH {getRequestsByMethod('PATCH')}
              </span>
            </div>
          </div>
          <div className="flex-1 relative min-w-[200px]">
            <SearchIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-4 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 ${
                isDark 
                  ? 'bg-[#141c2b] border-[#1e2d45] text-white placeholder-gray-500' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        </div>

        {/* API Request Form */}
        {showApiRequestForm && (
          <div className={`p-6 rounded-xl border mb-6 ${
            isDark ? 'border-emerald-500/30 bg-emerald-900/10' : 'border-emerald-300 bg-emerald-50/50'
          }`}>
            <div className="flex items-center space-x-2 mb-4">
              <SendIcon className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Request New API
              </h2>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
              }`}>
                For Backend Developers
              </span>
            </div>
            <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Fill out this form to request a new API endpoint. The backend team will review and implement it.
            </p>

            <form onSubmit={handleApiRequestSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <PersonIcon className="w-4 h-4 inline mr-1" />
                    Developer Name *
                  </label>
                  <input
                    value={apiRequest.developerName}
                    onChange={(e) => setApiRequest({...apiRequest, developerName: e.target.value})}
                    placeholder="John Doe"
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-[#141c2b] border-[#1e2d45] text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <EmailIcon className="w-4 h-4 inline mr-1" />
                    Email *
                  </label>
                  <input
                    value={apiRequest.developerEmail}
                    onChange={(e) => setApiRequest({...apiRequest, developerEmail: e.target.value})}
                    placeholder="john@example.com"
                    type="email"
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-[#141c2b] border-[#1e2d45] text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <CodeIcon className="w-4 h-4 inline mr-1" />
                    API Name *
                  </label>
                  <input
                    value={apiRequest.apiName}
                    onChange={(e) => setApiRequest({...apiRequest, apiName: e.target.value})}
                    placeholder="Get User Profile"
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-[#141c2b] border-[#1e2d45] text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <DescriptionIcon className="w-4 h-4 inline mr-1" />
                    API Path *
                  </label>
                  <input
                    value={apiRequest.apiPath}
                    onChange={(e) => setApiRequest({...apiRequest, apiPath: e.target.value})}
                    placeholder="/api/users/profile"
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-[#141c2b] border-[#1e2d45] text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Method *
                  </label>
                  <select
                    value={apiRequest.method}
                    onChange={(e) => setApiRequest({...apiRequest, method: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-[#141c2b] border-[#1e2d45] text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <CalendarIcon className="w-4 h-4 inline mr-1" />
                    Estimated Time
                  </label>
                  <input
                    value={apiRequest.estimatedTime}
                    onChange={(e) => setApiRequest({...apiRequest, estimatedTime: e.target.value})}
                    placeholder="2 days, 1 week, etc."
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-[#141c2b] border-[#1e2d45] text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <DescriptionIcon className="w-4 h-4 inline mr-1" />
                  Description *
                </label>
                <textarea
                  value={apiRequest.description}
                  onChange={(e) => setApiRequest({...apiRequest, description: e.target.value})}
                  placeholder="Describe what this API should do..."
                  rows="2"
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 ${
                    isDark ? 'bg-[#141c2b] border-[#1e2d45] text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <CodeIcon className="w-4 h-4 inline mr-1" />
                    Request Body (JSON)
                  </label>
                  <textarea
                    value={apiRequest.requestBody}
                    onChange={(e) => setApiRequest({...apiRequest, requestBody: e.target.value})}
                    placeholder='{"field": "type"}'
                    rows="3"
                    className={`w-full px-3 py-2 rounded-lg border font-mono text-sm focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-[#141c2b] border-[#1e2d45] text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <CodeIcon className="w-4 h-4 inline mr-1" />
                    Response Body (JSON)
                  </label>
                  <textarea
                    value={apiRequest.responseBody}
                    onChange={(e) => setApiRequest({...apiRequest, responseBody: e.target.value})}
                    placeholder='{"message": "success"}'
                    rows="3"
                    className={`w-full px-3 py-2 rounded-lg border font-mono text-sm focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-[#141c2b] border-[#1e2d45] text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Category
                  </label>
                  <select
                    value={apiRequest.category}
                    onChange={(e) => setApiRequest({...apiRequest, category: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-[#141c2b] border-[#1e2d45] text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Priority
                  </label>
                  <select
                    value={apiRequest.priority}
                    onChange={(e) => setApiRequest({...apiRequest, priority: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-[#141c2b] border-[#1e2d45] text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Additional Notes
                </label>
                <textarea
                  value={apiRequest.additionalNotes}
                  onChange={(e) => setApiRequest({...apiRequest, additionalNotes: e.target.value})}
                  placeholder="Any additional information..."
                  rows="2"
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 ${
                    isDark ? 'bg-[#141c2b] border-[#1e2d45] text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={apiRequest.authRequired}
                  onChange={(e) => setApiRequest({...apiRequest, authRequired: e.target.checked})}
                  className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                />
                <label className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <LockIcon className="w-4 h-4 inline mr-1" />
                  Requires Authentication
                </label>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-green-600 flex items-center space-x-2"
                >
                  <SendIcon className="w-4 h-4" />
                  <span>Submit API Request</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowApiRequestForm(false);
                    setApiRequest({
                      developerName: '',
                      developerEmail: '',
                      apiName: '',
                      apiPath: '',
                      method: 'GET',
                      description: '',
                      requestBody: '',
                      responseBody: '',
                      authRequired: false,
                      category: '',
                      priority: 'Medium',
                      estimatedTime: '',
                      additionalNotes: ''
                    });
                  }}
                  className={`px-4 py-2.5 rounded-lg ${
                    isDark ? 'hover:bg-[#1e2d45] text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories with Requests */}
        <div className="space-y-2">
          {categories.map((category) => {
            const categoryRequests = getRequestsByCategory(category.name);
            const hasRequests = categoryRequests.length > 0;
            const pendingCount = categoryRequests.filter(r => r.status === 'Pending Review').length;
            
            return (
              <div
                key={category.id}
                className={`rounded-xl border overflow-hidden ${
                  isDark ? 'border-[#1e2d45] bg-[#1a2438]/80' : 'border-gray-200 bg-white'
                }`}
              >
                {/* Category Header */}
                <div 
                  className={`px-4 py-3 flex items-center justify-between cursor-pointer ${
                    isDark ? 'hover:bg-[#141c2b]' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => toggleCategoryExpand(category.id)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{category.icon || '📁'}</span>
                    <div>
                      <h2 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {category.name}
                      </h2>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {categoryRequests.length} request{categoryRequests.length !== 1 ? 's' : ''}
                        {pendingCount > 0 && ` · ${pendingCount} pending`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isDark ? 'bg-[#1e2d45] text-gray-300' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {categoryRequests.length} requests
                    </span>
                    {pendingCount > 0 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400`}>
                        {pendingCount} pending
                      </span>
                    )}
                    {expandedCategories[category.id] ? (
                      <ExpandLessIcon className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    ) : (
                      <ExpandMoreIcon className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    )}
                  </div>
                </div>

                {/* Requests List */}
                {expandedCategories[category.id] && (
                  <div className="divide-y divide-gray-200 dark:divide-[#1e2d45]">
                    {categoryRequests.length > 0 ? (
                      <div className="px-4 py-3">
                        {categoryRequests.map((request) => (
                          <div
                            key={request.id}
                            className={`rounded-lg border mb-2 ${
                              isDark ? 'border-yellow-500/20 bg-yellow-900/5' : 'border-yellow-200 bg-yellow-50/50'
                            }`}
                          >
                            <div 
                              className="px-3 py-2 flex items-center space-x-3 cursor-pointer hover:bg-opacity-50 rounded"
                              onClick={() => toggleRequestExpand(request.id)}
                            >
                              <div className={`px-2 py-0.5 rounded text-xs font-bold text-white ${getMethodColor(request.method)}`}>
                                {request.method}
                              </div>
                              <code className={`text-sm font-mono flex-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                {request.apiPath}
                              </code>
                              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {request.apiName}
                              </span>
                              <div className="flex items-center space-x-2 ml-auto">
                                <span className={`text-xs px-2 py-0.5 rounded-full flex items-center space-x-1 ${getStatusColor(request.status)}`}>
                                  {getStatusIcon(request.status)}
                                  <span>{request.status}</span>
                                </span>
                                {request.authRequired && (
                                  <LockIcon className={`w-3 h-3 ${isDark ? 'text-yellow-500' : 'text-yellow-600'}`} />
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteRequest(request.id);
                                  }}
                                  className={`p-1 rounded-lg transition-colors ${
                                    isDark ? 'hover:bg-[#1e2d45] text-red-400' : 'hover:bg-gray-200 text-red-500'
                                  }`}
                                  title="Delete Request"
                                >
                                  <DeleteIcon className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(request.apiPath, request.id);
                                  }}
                                  className={`p-1 rounded-lg transition-colors ${
                                    isDark ? 'hover:bg-[#1e2d45]' : 'hover:bg-gray-200'
                                  }`}
                                  title="Copy path"
                                >
                                  {copied === request.id ? (
                                    <CheckIcon className="w-3 h-3 text-green-500" />
                                  ) : (
                                    <CopyAllIcon className={`w-3 h-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                  )}
                                </button>
                                {expandedRequests[request.id] ? (
                                  <ExpandLessIcon className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                ) : (
                                  <ExpandMoreIcon className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                )}
                              </div>
                            </div>

                            {/* Expanded Request Details */}
                            {expandedRequests[request.id] && (
                              <div className="px-3 pb-3 space-y-2">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Developer</span>
                                    <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                      {request.developerName}
                                    </p>
                                  </div>
                                  <div>
                                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Email</span>
                                    <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                      {request.developerEmail}
                                    </p>
                                  </div>
                                  <div>
                                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Priority</span>
                                    <p className={`font-medium ${
                                      request.priority === 'Critical' ? 'text-red-500' :
                                      request.priority === 'High' ? 'text-orange-500' :
                                      request.priority === 'Medium' ? 'text-yellow-500' :
                                      'text-blue-500'
                                    }`}>
                                      {request.priority}
                                    </p>
                                  </div>
                                  <div>
                                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Submitted</span>
                                    <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                      {new Date(request.submittedAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div>
                                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Estimated Time</span>
                                    <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                      {request.estimatedTime || 'Not specified'}
                                    </p>
                                  </div>
                                  <div>
                                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Auth Required</span>
                                    <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                      {request.authRequired ? '✅ Yes' : '❌ No'}
                                    </p>
                                  </div>
                                </div>

                                {request.description && (
                                  <div>
                                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Description</span>
                                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                      {request.description}
                                    </p>
                                  </div>
                                )}

                                {request.requestBody && (
                                  <div>
                                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Request Body</span>
                                    <pre className={`text-xs font-mono p-2 rounded ${
                                      isDark ? 'bg-[#141c2b] text-gray-300' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                      {request.requestBody}
                                    </pre>
                                  </div>
                                )}

                                {request.responseBody && (
                                  <div>
                                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Response Body</span>
                                    <pre className={`text-xs font-mono p-2 rounded ${
                                      isDark ? 'bg-[#141c2b] text-gray-300' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                      {request.responseBody}
                                    </pre>
                                  </div>
                                )}

                                {request.additionalNotes && (
                                  <div>
                                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Additional Notes</span>
                                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                      {request.additionalNotes}
                                    </p>
                                  </div>
                                )}

                                {/* Status Update */}
                                <div className="flex items-center space-x-2 pt-2">
                                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Update Status:</span>
                                  <select
                                    value={request.status}
                                    onChange={(e) => updateRequestStatus(request.id, e.target.value)}
                                    className={`text-xs px-2 py-1 rounded border focus:ring-2 focus:ring-blue-500 ${
                                      isDark ? 'bg-[#141c2b] border-[#1e2d45] text-white' : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                                  >
                                    <option value="Pending Review">Pending Review</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="On Hold">On Hold</option>
                                    <option value="Rejected">Rejected</option>
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`px-4 py-8 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        No requests in this category yet.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredRequests.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              No requests found matching your search
            </p>
          </div>
        )}

        {apiRequests.length === 0 && !searchTerm && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              No API requests yet. Click "Request API" to submit your first request!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiDocs;