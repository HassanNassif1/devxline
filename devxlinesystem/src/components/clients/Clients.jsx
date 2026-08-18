// Clients.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import ClientTable from './ClientTable';
import ClientFilters from './ClientFilters';
import BusinessTypeFilter from './BusinessTypeFilter';
import Loader from '../common/Loader.jsx';
import { clientsApi } from '../../api/clientsApi';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';

const Clients = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    search: '',
    status: '',
    businessType: '',
  });
  
  const isFirstRender = useRef(true);
  const isFetching = useRef(false);

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => {
    const filtered = {
      page: filters.page,
      pageSize: filters.pageSize,
    };
    
    // Only add filters if they have values
    if (filters.search) filtered.search = filters.search;
    if (filters.status) filtered.status = filters.status;
    if (filters.businessType) filtered.businessType = filters.businessType;
    
    return filtered;
  }, [filters.page, filters.pageSize, filters.search, filters.status, filters.businessType]);

  const fetchClients = useCallback(async (filterParams) => {
    if (isFetching.current) {
      return;
    }
    
    try {
      isFetching.current = true;
      setLoading(true);
      
      const params = filterParams || memoizedFilters;
      
      console.log('Fetching clients with params:', params);
      
      const response = await clientsApi.getClients(params);
      
      console.log('API Response:', response);
      
      if (response && response.data) {
        // The API should return filtered data
        // If the API doesn't filter, we'll filter on the client side
        let filteredData = response.data.data || [];
        let totalCount = response.data.total || 0;
        
        // Client-side filtering as a backup (remove this if API filtering works)
        if (filters.businessType) {
          filteredData = filteredData.filter(
            client => client.businessType === filters.businessType
          );
          totalCount = filteredData.length;
          console.log(`Filtered to ${filteredData.length} clients with business type: ${filters.businessType}`);
        }
        
        setClients(filteredData);
        setTotal(totalCount);
      } else {
        setClients([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error(error.userMessage || 'Failed to fetch clients');
      setClients([]);
      setTotal(0);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [memoizedFilters, filters.businessType]);

  // Fetch clients when filters change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchClients(memoizedFilters);
      return;
    }
    fetchClients(memoizedFilters);
  }, [memoizedFilters, fetchClients]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => {
      const updatedFilters = { ...prev, ...newFilters, page: 1 };
      console.log('Filter changed:', updatedFilters);
      return updatedFilters;
    });
  }, []);

  const handleBusinessTypeSelect = useCallback((businessType) => {
    console.log('Business type selected:', businessType);
    setFilters(prev => ({
      ...prev,
      businessType: businessType,
      page: 1
    }));
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setFilters(prev => {
      if (prev.page === newPage) return prev;
      return { ...prev, page: newPage };
    });
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (!id) return;
    
    try {
      setClients(prev => prev.filter(client => client.clientId !== id));
      await clientsApi.deleteClient(id);
      toast.success('Client deleted successfully');
      await fetchClients(memoizedFilters);
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error(error.userMessage || 'Failed to delete client');
      await fetchClients(memoizedFilters);
    }
  }, [memoizedFilters, fetchClients]);

  const handleRefresh = useCallback(() => {
    if (!isFetching.current) {
      fetchClients(memoizedFilters);
    }
  }, [memoizedFilters, fetchClients]);

  const refreshButton = useMemo(() => (
    <button
      onClick={handleRefresh}
      className={`p-2 rounded-lg transition ${
        isDark 
          ? 'hover:bg-[#1a2438] text-gray-400 hover:text-white' 
          : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
      }`}
      title="Refresh"
      disabled={loading}
    >
      <RefreshIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
    </button>
  ), [handleRefresh, isDark, loading]);

  const addButton = useMemo(() => (
    <button
      onClick={() => navigate('/clients/new')}
      className="btn-primary flex items-center space-x-2 text-white px-5 py-2.5 rounded-lg font-medium"
    >
      <AddIcon className="w-5 h-5" />
      <span>Add Client</span>
    </button>
  ), [navigate]);

  // Get unique business types from clients for display
  const getUniqueBusinessTypes = useCallback(() => {
    const types = new Set();
    clients.forEach(client => {
      if (client.businessType) {
        types.add(client.businessType);
      }
    });
    return Array.from(types);
  }, [clients]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Clients
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            Manage your client portfolio
          </p>
          {filters.businessType && (
            <span className={`inline-flex items-center px-3 py-1 mt-2 rounded-full text-sm ${
              isDark ? 'bg-blue-500/20 text-blue-400 border border-blue-400/20' : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              Filtering by: {filters.businessType}
              <button
                onClick={() => handleBusinessTypeSelect('')}
                className="ml-2 hover:text-red-500 transition"
              >
                ✕
              </button>
            </span>
          )}
          {clients.length > 0 && (
            <span className={`inline-flex items-center px-3 py-1 mt-2 ml-2 rounded-full text-sm ${
              isDark ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}>
              {clients.length} client{clients.length !== 1 ? 's' : ''} found
            </span>
          )}
        </div>
        <div className="flex items-center space-x-3">
          {refreshButton}
          {addButton}
        </div>
      </div>

      {/* Business Type Filter */}
      <div className="mb-4">
        <BusinessTypeFilter 
          selectedType={filters.businessType}
          onTypeSelect={handleBusinessTypeSelect}
        />
      </div>

      {/* Other Filters */}
      <ClientFilters 
        onFilterChange={handleFilterChange} 
        filters={filters}
        onBusinessTypeSelect={handleBusinessTypeSelect}
        isDark={isDark}
      />

      {loading ? (
        <Loader />
      ) : (
        <ClientTable
          clients={clients}
          total={total}
          page={memoizedFilters.page}
          pageSize={memoizedFilters.pageSize}
          onPageChange={handlePageChange}
          onDelete={handleDelete}
          isLoading={loading}
        />
      )}
    </div>
  );
};

export default React.memo(Clients);