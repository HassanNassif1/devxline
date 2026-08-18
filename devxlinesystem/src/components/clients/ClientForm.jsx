import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { clientsApi } from '../../api/clientsApi';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeContext';

const clientSchema = yup.object().shape({
  businessType: yup.string().required('Business type is required'),
  businessName: yup.string().required('Business name is required'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  mobile: yup.string().required('Mobile number is required'),
  city: yup.string().required('City is required'),
  address: yup.string(),
  monthlyPrice: yup.number()
    .required('Monthly price is required')
    .min(0, 'Must be greater than 0'),
  status: yup.string().required('Status is required'),
});

const ClientForm = ({ client, onSuccess }) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = !!client;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(clientSchema),
    defaultValues: client || {
      businessType: '',
      businessName: '',
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      city: '',
      address: '',
      monthlyPrice: 0,
      status: 'Pending',
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Check if email exists (for new clients)
      if (!isEdit) {
        const emailCheck = await clientsApi.checkEmail(data.email);
        if (emailCheck.data.exists) {
          toast.error('Email already exists. Please use a different email.');
          setIsSubmitting(false);
          return;
        }
        
        const mobileCheck = await clientsApi.checkMobile(data.mobile);
        if (mobileCheck.data.exists) {
          toast.error('Mobile number already exists. Please use a different number.');
          setIsSubmitting(false);
          return;
        }
      }
      
      if (isEdit) {
        await clientsApi.updateClient(client.clientId, data);
        toast.success('Client updated successfully!');
      } else {
        await clientsApi.createClient(data);
        toast.success('Client created successfully!');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const businessTypes = ['Restaurant', 'Medical', 'E-commerce', 'Retail', 'Education', 'Others'];
  const statusOptions = ['Active', 'Pending', 'Cancelled', 'Suspended'];

  const inputClass = `w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
    isDark 
      ? 'bg-[#1a2438] border-[#1e2d45] text-white placeholder-gray-500' 
      : 'bg-white border-gray-300 text-gray-900'
  }`;

  const labelClass = `block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`;
  const errorClass = "text-red-500 text-sm mt-1";

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
        >
          <ArrowBackIcon />
        </button>
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {isEdit ? 'Edit Client' : 'Add New Client'}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Information */}
          <div className="md:col-span-2">
            <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Business Information
            </h3>
          </div>

          <div>
            <label className={labelClass}>Business Type *</label>
            <select {...register('businessType')} className={inputClass}>
              <option value="">Select business type</option>
              {businessTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.businessType && <p className={errorClass}>{errors.businessType.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Business Name *</label>
            <input {...register('businessName')} className={inputClass} placeholder="Enter business name" />
            {errors.businessName && <p className={errorClass}>{errors.businessName.message}</p>}
          </div>

          {/* Contact Information */}
          <div className="md:col-span-2">
            <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Contact Information
            </h3>
          </div>

          <div>
            <label className={labelClass}>First Name *</label>
            <input {...register('firstName')} className={inputClass} placeholder="Enter first name" />
            {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Last Name *</label>
            <input {...register('lastName')} className={inputClass} placeholder="Enter last name" />
            {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Email *</label>
            <input type="email" {...register('email')} className={inputClass} placeholder="email@example.com" />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Mobile *</label>
            <input {...register('mobile')} className={inputClass} placeholder="+961 70 987 654" />
            {errors.mobile && <p className={errorClass}>{errors.mobile.message}</p>}
          </div>

          <div>
            <label className={labelClass}>City *</label>
            <input {...register('city')} className={inputClass} placeholder="City" />
            {errors.city && <p className={errorClass}>{errors.city.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Address</label>
            <input {...register('address')} className={inputClass} placeholder="Street address" />
          </div>

          {/* Pricing Information */}
          <div className="md:col-span-2">
            <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Pricing & Status
            </h3>
          </div>

          <div>
            <label className={labelClass}>Monthly Price ($) *</label>
            <input 
              type="number" 
              step="0.01" 
              {...register('monthlyPrice')} 
              className={inputClass} 
              placeholder="0.00" 
            />
            {errors.monthlyPrice && <p className={errorClass}>{errors.monthlyPrice.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Status *</label>
            <select {...register('status')} className={inputClass}>
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            {errors.status && <p className={errorClass}>{errors.status.message}</p>}
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
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting ? 'Saving...' : (isEdit ? 'Update Client' : 'Create Client')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;