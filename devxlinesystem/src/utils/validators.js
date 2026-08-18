import * as yup from 'yup';

export const loginValidationSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

export const clientValidationSchema = yup.object().shape({
  businessType: yup.string().required('Business type is required'),
  businessName: yup.string().required('Business name is required'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  mobile: yup.string().required('Mobile number is required'),
  country: yup.string().required('Country is required'),
  city: yup.string().required('City is required'),
  serviceType: yup.string().required('Service type is required'),
  planType: yup.string().required('Plan type is required'),
  monthlyPrice: yup.number().positive('Must be positive').required('Monthly price is required'),
  contractStart: yup.date().required('Contract start date is required'),
  contractEnd: yup.date().required('Contract end date is required'),
});