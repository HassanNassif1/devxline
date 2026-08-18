import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { clientsApi } from '../api/clientsApi';

const ClientAddPage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessType: '',
    businessName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    mobile: '',
    country: '',
    city: '',
    address: '',
    serviceType: '',
    planType: 'Starter',
    monthlyPrice: 0,
    contractStart: new Date().toISOString().split('T')[0],
    contractEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    assignedDeveloper: '',
    assignedSales: '',
  });

  const businessTypes = ['Restaurant', 'Medical', 'E-commerce', 'Retail', 'Education', 'Others'];
  const serviceTypes = ['Restaurant System', 'Medical System', 'E-commerce Platform', 'ERP System', 'CRM System', 'POS System', 'Accounting System'];
  const planTypes = ['Starter', 'Professional', 'Enterprise'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.businessType || !formData.businessName || !formData.firstName || 
        !formData.lastName || !formData.email || !formData.mobile || 
        !formData.country || !formData.city || !formData.serviceType) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fill in all required fields.',
        icon: 'warning',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Format data for API - ensure monthlyPrice is a number
      const submitData = {
        ...formData,
        monthlyPrice: parseFloat(formData.monthlyPrice) || 0
      };
      
      console.log('📤 Submitting client data:', submitData);
      
      await clientsApi.createClient(submitData);
      
      Swal.fire({
        title: 'Success!',
        text: 'Client created successfully',
        icon: 'success',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
        timer: 2000,
        timerProgressBar: true,
      });
      
      navigate('/clients');
    } catch (error) {
      console.error('❌ Error creating client:', error);
      
      let errorMessage = 'Failed to create client';
      
      if (error.isTimeout) {
        errorMessage = 'The server is taking too long to respond. Please try again.';
      } else if (error.isNetworkError) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        errorMessage = errors.join(', ');
      }
      
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const inputClass = `w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
    isDark 
      ? 'bg-[#1a2438] border-[#1e2d45] text-white placeholder-gray-500' 
      : 'bg-white border-gray-300 text-gray-900'
  }`;

  const labelClass = `block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <div className={`rounded-xl p-6 border transition-theme ${
      isDark ? 'bg-[#141c2b] border-[#1e2d45]' : 'bg-white border-gray-200 shadow-card'
    }`}>
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => navigate('/clients')}
          className={`p-2 rounded-lg transition ${
            isDark ? 'hover:bg-[#1a2438] text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
          }`}
          disabled={isSubmitting}
        >
          <ArrowBackIcon />
        </button>
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Add New Client
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Information */}
          <div className="md:col-span-2">
            <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Business Information
            </h3>
          </div>

          <div>
            <label className={labelClass}>Business Type *</label>
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              className={inputClass}
              required
              disabled={isSubmitting}
            >
              <option value="">Select business type</option>
              {businessTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Business Name *</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter business name"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Contact Information */}
          <div className="md:col-span-2">
            <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Contact Information
            </h3>
          </div>

          <div>
            <label className={labelClass}>First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter first name"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className={labelClass}>Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter last name"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className={labelClass}>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
              placeholder="email@example.com"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className={labelClass}>Mobile *</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className={inputClass}
              placeholder="+961 70 987 654"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className={labelClass}>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputClass}
              placeholder="+961 1 234 567"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className={labelClass}>Country *</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={inputClass}
              placeholder="Country"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className={labelClass}>City *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={inputClass}
              placeholder="City"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={inputClass}
              placeholder="Street address"
              disabled={isSubmitting}
            />
          </div>

          {/* Service Information */}
          <div className="md:col-span-2">
            <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Service Information
            </h3>
          </div>

          <div>
            <label className={labelClass}>Service Type *</label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className={inputClass}
              required
              disabled={isSubmitting}
            >
              <option value="">Select service type</option>
              {serviceTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Plan Type *</label>
            <select
              name="planType"
              value={formData.planType}
              onChange={handleChange}
              className={inputClass}
              required
              disabled={isSubmitting}
            >
              {planTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Monthly Price ($) *</label>
            <input
              type="number"
              step="0.01"
              name="monthlyPrice"
              value={formData.monthlyPrice || ''}
              onChange={(e) => {
                const value = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  monthlyPrice: value === '' ? 0 : parseFloat(value)
                }));
              }}
              className={inputClass}
              placeholder="0.00"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className={labelClass}>Contract Start *</label>
            <input
              type="date"
              name="contractStart"
              value={formData.contractStart}
              onChange={handleChange}
              className={inputClass}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className={labelClass}>Contract End *</label>
            <input
              type="date"
              name="contractEnd"
              value={formData.contractEnd}
              onChange={handleChange}
              className={inputClass}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Assignment */}
          <div className="md:col-span-2">
            <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Assignment
            </h3>
          </div>

          <div>
            <label className={labelClass}>Assigned Developer</label>
            <input
              type="text"
              name="assignedDeveloper"
              value={formData.assignedDeveloper}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter developer name"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className={labelClass}>Assigned Sales</label>
            <input
              type="text"
              name="assignedSales"
              value={formData.assignedSales}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter sales person name"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-[#1e2d45]">
          <button
            type="button"
            onClick={() => navigate('/clients')}
            className={`px-6 py-2.5 rounded-lg transition ${
              isDark 
                ? 'border border-[#1e2d45] text-gray-400 hover:bg-[#1a2438] hover:text-white' 
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2.5 rounded-lg font-medium transition flex items-center space-x-2 ${
              isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <SaveIcon className="w-5 h-5" />
                <span>Create Client</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientAddPage;