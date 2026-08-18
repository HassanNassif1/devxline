import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import { useTheme } from '../../context/ThemeContext';

const ClientTable = ({
  clients = [],
  total = 0,
  page = 1,
  pageSize = 10,
  onPageChange,
  onDelete,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  const columns = useMemo(() => [
   // In the columns definition, make sure Business column shows the type clearly
{
  name: 'Business',
  selector: row => row.businessName || '',
  sortable: true,
  cell: row => (
    <div className="flex flex-col">
      <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {row.businessName || 'N/A'}
      </span>
      <span className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
        {row.businessType || 'N/A'}
      </span>
    </div>
  ),
},
    {
      name: 'Contact',
      selector: row => row.email || '',
      cell: row => (
        <div className="flex flex-col">
          <span className={isDark ? 'text-gray-200' : 'text-gray-800'}>
            {row.firstName || ''} {row.lastName || ''}
          </span>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {row.email || 'N/A'}
          </span>
        </div>
      ),
    },
    {
      name: 'Mobile',
      selector: row => row.mobile || '',
      cell: row => (
        <span className={isDark ? 'text-gray-200' : 'text-gray-800'}>
          {row.mobile || 'N/A'}
        </span>
      ),
    },
    {
      name: 'City',
      selector: row => row.city || '',
      cell: row => (
        <span className={isDark ? 'text-gray-200' : 'text-gray-800'}>
          {row.city || 'N/A'}
        </span>
      ),
    },
    
    {
      name: 'Monthly Price',
      selector: row => row.monthlyPrice || 0,
      cell: row => (
        <span className={`font-medium ${isDark ? 'text-green-400' : 'text-gray-900'}`}>
          ${(row.monthlyPrice || 0).toLocaleString()}
        </span>
      ),
    },
    {
      name: 'Status',
      selector: row => row.status || '',
      cell: row => {
        const status = (row.status || 'Inactive').toLowerCase();
        return (
          <span className={`status-badge status-badge-${status}`}>
            {row.status || 'Inactive'}
          </span>
        );
      },
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex items-center space-x-1">
          <button
            onClick={() => navigate(`/clients/${row.clientId}`)}
            className="icon-btn"
            title="View"
            aria-label="View client"
          >
            <ViewIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate(`/clients/${row.clientId}?edit=true`)}
            className="icon-btn"
            title="Edit"
            aria-label="Edit client"
          >
            <EditIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDelete(row.clientId)}
            className="icon-btn hover:text-red-600 dark:hover:text-red-400"
            title="Delete"
            aria-label="Delete client"
            disabled={deleteInProgress}
          >
            <DeleteIcon className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ], [isDark, navigate, deleteInProgress]);

  const handleDelete = (id) => {
    if (!id || deleteInProgress) return;

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      background: isDark ? '#141c2b' : '#ffffff',
      color: isDark ? '#e8edf5' : '#0f172a',
    }).then((result) => {
      if (result.isConfirmed && onDelete) {
        setDeleteInProgress(true);
        Swal.fire({
          title: 'Deleting...',
          text: 'Please wait',
          icon: 'info',
          showConfirmButton: false,
          background: isDark ? '#141c2b' : '#ffffff',
          color: isDark ? '#e8edf5' : '#0f172a',
          didOpen: () => {
            Swal.showLoading();
          },
        });

        onDelete(id)
          .then(() => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Client has been deleted.',
              icon: 'success',
              background: isDark ? '#141c2b' : '#ffffff',
              color: isDark ? '#e8edf5' : '#0f172a',
              confirmButtonColor: '#3b82f6',
              timer: 3000,
              timerProgressBar: true,
            });
          })
          .catch((error) => {
            console.error('Delete error:', error);
            Swal.fire({
              title: 'Error!',
              text: error.message || 'Failed to delete client. Please try again.',
              icon: 'error',
              background: isDark ? '#141c2b' : '#ffffff',
              color: isDark ? '#e8edf5' : '#0f172a',
              confirmButtonColor: '#3b82f6',
            });
          })
          .finally(() => {
            setDeleteInProgress(false);
          });
      }
    });
  };

  const customStyles = useMemo(() => ({
    headRow: {
      style: {
        backgroundColor: isDark ? '#0f1623' : '#f8fafc',
        borderBottom: `1px solid ${isDark ? '#1e2d45' : '#e2e8f0'}`,
        minHeight: '50px',
        zIndex: 1,
      },
    },
    headCells: {
      style: {
        fontWeight: '600',
        color: isDark ? '#94a3b8' : '#475569',
        fontSize: '0.875rem',
        padding: '12px 16px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      },
    },
    rows: {
      style: {
        minHeight: '60px',
        backgroundColor: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        borderBottom: `1px solid ${isDark ? '#1e2d45' : '#f1f5f9'}`,
        '&:hover': {
          backgroundColor: isDark ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.03)',
        },
      },
    },
    pagination: {
      style: {
        backgroundColor: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#94a3b8' : '#475569',
        borderTop: `1px solid ${isDark ? '#1e2d45' : '#e2e8f0'}`,
      },
      pageButtonsStyle: {
        borderRadius: '8px',
        height: '36px',
        width: '36px',
        padding: '8px',
        margin: '0 2px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        color: isDark ? '#94a3b8' : '#475569',
        backgroundColor: 'transparent',
        '&:hover': {
          background: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.08)',
          color: isDark ? '#60a5fa' : '#3b82f6',
        },
        '&:focus': {
          outline: 'none',
        },
        '&:disabled': {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
      },
    },
    noData: {
      style: {
        backgroundColor: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#94a3b8' : '#64748b',
        padding: '40px 0',
      },
    },
    progress: {
      style: {
        backgroundColor: isDark ? '#141c2b' : '#ffffff',
      },
    },
  }), [isDark]);

  const handlePageChange = (newPage) => {
    if (onPageChange && typeof onPageChange === 'function') {
      onPageChange(newPage);
    }
  };

  return (
    <div className={`rounded-xl overflow-hidden border ${
      isDark ? 'border-[#1e2d45]' : 'border-gray-200'
    }`}>
      <DataTable
        columns={columns}
        data={clients}
        customStyles={customStyles}
        pagination
        paginationServer
        paginationTotalRows={total}
        paginationPerPage={pageSize}
        paginationDefaultPage={page}
        onChangePage={handlePageChange}
        progressPending={isLoading}
        highlightOnHover
        pointerOnHover
        noDataComponent={
          <div className={`py-12 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="text-4xl mb-3">📋</div>
            <p className="text-base font-medium">No clients found</p>
            <p className="text-sm mt-1">Try adjusting your filters or add a new client</p>
          </div>
        }
        paginationComponentOptions={{
          rowsPerPageText: 'Rows per page:',
          rangeSeparatorText: 'of',
          noRowsPerPage: false,
          selectAllRowsItem: false,
          selectAllRowsItemText: 'All',
        }}
      />
    </div>
  );
};

export default ClientTable;