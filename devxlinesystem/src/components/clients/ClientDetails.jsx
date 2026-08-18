import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import { clientsApi } from '../../api/clientsApi';
import { useTheme } from '../../context/ThemeContext';

const ClientDetails = ({ client, onEdit, onSuccess }) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      background: isDark ? '#141c2b' : '#ffffff',
      color: isDark ? '#e8edf5' : '#0f172a',
    });

    if (result.isConfirmed) {
      try {
        await clientsApi.deleteClient(client.clientId);
        Swal.fire({
          title: 'Deleted!',
          text: 'Client has been deleted.',
          icon: 'success',
          background: isDark ? '#141c2b' : '#ffffff',
          color: isDark ? '#e8edf5' : '#0f172a',
          confirmButtonColor: '#3b82f6',
        });
        onSuccess();
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete client.',
          icon: 'error',
          background: isDark ? '#141c2b' : '#ffffff',
          color: isDark ? '#e8edf5' : '#0f172a',
          confirmButtonColor: '#3b82f6',
        });
      }
    }
  };

  const infoCards = [
    {
      icon: BusinessIcon,
      label: 'Business Type',
      value: client.businessType || 'N/A',
      color: isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600',
    },
    {
      icon: MoneyIcon,
      label: 'Monthly Price',
      value: `$${(client.monthlyPrice || 0).toLocaleString()}`,
      color: isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-600',
    },
    {
      icon: BusinessIcon,
      label: 'Status',
      value: client.status || 'Inactive',
      color: isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600',
    },
  ];

  const detailCardClass = `rounded-xl p-6 border transition-theme ${
    isDark ? 'bg-[#141c2b] border-[#1e2d45]' : 'bg-white border-gray-200 shadow-card'
  }`;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/clients')}
            className={`p-2 rounded-lg transition ${
              isDark ? 'hover:bg-[#1a2438] text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <ArrowBackIcon />
          </button>
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {client.businessName || 'Client Details'}
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Client Details</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
              isDark 
                ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-400/20' 
                : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
            }`}
          >
            <EditIcon className="w-5 h-5" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDelete}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
              isDark 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-400/20' 
                : 'bg-red-50 text-red-600 hover:bg-red-100'
            }`}
          >
            <DeleteIcon className="w-5 h-5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {infoCards.map((card, index) => (
          <div key={index} className={`${detailCardClass} flex items-start space-x-4`}>
            <div className={`p-3 rounded-xl ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{card.label}</p>
              <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={detailCardClass}>
          <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Contact Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <EmailIcon className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{client.email || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <PhoneIcon className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Mobile</p>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{client.mobile || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className={detailCardClass}>
          <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Address
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <LocationIcon className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>City</p>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {client.city || 'N/A'}
                </p>
              </div>
            </div>
            {client.address && (
              <div className="flex items-center space-x-3">
                <BusinessIcon className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Address</p>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{client.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div className={detailCardClass}>
        <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Business Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Business Name</p>
            <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {client.businessName || 'N/A'}
            </p>
          </div>
          <div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Business Type</p>
            <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {client.businessType || 'N/A'}
            </p>
          </div>
          <div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Monthly Price</p>
            <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ${(client.monthlyPrice || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
            <span className={`status-badge status-badge-${(client.status || 'inactive').toLowerCase()}`}>
              {client.status || 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;