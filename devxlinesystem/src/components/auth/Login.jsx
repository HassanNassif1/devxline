// src/components/auth/Login.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../common/ThemeToggle';
import {
  Visibility,
  VisibilityOff,
  Google,
  Email,
  Lock,
  Fingerprint,
  Security,
  CheckCircle,
} from '@mui/icons-material';
import LogoSvgLight from '../../assets/images/devxlinelight.png';
import LogoSvgDark from '../../assets/images/devxlinedark.png';

// Validation Schema
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

// Constants
const ERROR_MESSAGES = {
  default: 'An unexpected error occurred. Please try again.',
  network: 'Network error. Please check your internet connection.',
  timeout: 'Login request timed out. Please try again.',
  invalid: 'Invalid email or password. Please try again.',
};

// Sub-components
const LoadingState = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0e17]">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      <p className="mt-4 text-gray-400">Loading...</p>
    </div>
  </div>
);

const GridBackground = ({ isDark }) => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: isDark
        ? `
          linear-gradient(rgba(0, 229, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 229, 255, 0.03) 1px, transparent 1px)
        `
        : `
          linear-gradient(rgba(0, 229, 255, 0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 229, 255, 0.015) 1px, transparent 1px)
        `,
      backgroundSize: '30px 30px',
    }}
  />
);

const GlowEffects = ({ isDark }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div
      className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl"
      style={{
        background: isDark
          ? 'radial-gradient(circle, rgba(0, 229, 255, 0.12), transparent 70%)'
          : 'radial-gradient(circle, rgba(0, 229, 255, 0.04), transparent 70%)',
      }}
    />
    <div
      className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl"
      style={{
        background: isDark
          ? 'radial-gradient(circle, rgba(255, 0, 127, 0.10), transparent 70%)'
          : 'radial-gradient(circle, rgba(255, 0, 127, 0.03), transparent 70%)',
      }}
    />
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
      style={{
        background: isDark
          ? 'radial-gradient(circle, rgba(179, 0, 255, 0.06), transparent 70%)'
          : 'radial-gradient(circle, rgba(179, 0, 255, 0.02), transparent 70%)',
      }}
    />
  </div>
);

const FormInput = React.memo(({
  id,
  label,
  icon: Icon,
  type,
  register,
  error,
  isFocused,
  onFocus,
  onBlur,
  isDark,
  disabled,
  placeholder,
  autoComplete,
  rightElement,
}) => (
  <div className="space-y-1">
    <label
      htmlFor={id}
      className={`text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
        isDark ? 'text-gray-400' : 'text-gray-600'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </label>
    <div className={`relative group transition-all duration-300 ${isFocused ? 'scale-[1.01]' : 'scale-100'}`}>
      <input
        id={id}
        type={type}
        {...register}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`w-full px-4 py-3 border-2 rounded-2xl text-sm transition-all duration-300 outline-none ${
          error
            ? 'border-red-500 ring-4 ring-red-500/10'
            : isFocused
              ? isDark
                ? 'border-blue-500 ring-4 ring-blue-500/10 bg-white/10'
                : 'border-blue-500 ring-4 ring-blue-500/10 bg-white'
              : isDark
                ? 'border-white/10 bg-white/5 text-white placeholder-gray-500 hover:border-white/20'
                : 'border-gray-200 bg-white/50 text-gray-900 placeholder-gray-400 hover:border-gray-300'
        }`}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
      />
      {rightElement}
    </div>
    {error && <p className="text-red-500 text-xs mt-0.5 pl-1">{error.message}</p>}
  </div>
));

FormInput.displayName = 'FormInput';

const PasswordToggle = ({ show, onToggle, isDark, disabled }) => (
  <button
    type="button"
    onClick={onToggle}
    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-xl transition-all duration-300 ${
      isDark
        ? 'text-gray-400 hover:text-gray-200 hover:bg-white/10'
        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
    }`}
    disabled={disabled}
    aria-label={show ? 'Hide password' : 'Show password'}
  >
    {show ? <VisibilityOff className="w-4 h-4" /> : <Visibility className="w-4 h-4" />}
  </button>
);

const SocialLoginButton = ({ icon: Icon, label, onClick, isDark, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    className={`py-2.5 rounded-2xl border-2 font-medium text-xs flex items-center justify-center gap-2 transition-all duration-300 ${
      isDark
        ? 'border-white/10 text-gray-300 hover:bg-white/5 hover:border-white/20 hover:scale-[1.01]'
        : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:scale-[1.01]'
    }`}
    disabled={disabled}
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </button>
);

const MicrosoftIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 23 23" fill="none">
    <path d="M0 0H11V11H0V0Z" fill="#F25022" />
    <path d="M12 0H23V11H12V0Z" fill="#7FBA00" />
    <path d="M0 12H11V23H0V12Z" fill="#00A4EF" />
    <path d="M12 12H23V23H12V12Z" fill="#FFB900" />
  </svg>
);

// Main Component
const Login = () => {
  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const { login, isAuthenticated, loading } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
  });

  // Memoized values
  const logoSrc = useMemo(() => (isDark ? LogoSvgDark : LogoSvgLight), [isDark]);

  // Effects - MUST be called before conditional returns
  useEffect(() => {
    if (!loading) {
      setIsReady(true);
    }
  }, [loading]);

  // Handlers - MUST be defined before conditional returns
  const handleFocus = useCallback(
    (field) => {
      setIsFocused((prev) => ({ ...prev, [field]: true }));
    },
    []
  );

  const handleBlur = useCallback(
    (field) => {
      setIsFocused((prev) => ({ ...prev, [field]: false }));
    },
    []
  );

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleSocialLogin = useCallback((provider) => {
    alert(`${provider} Sign-In is not configured yet.`);
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      setIsSubmitting(true);
      setLoginError('');

      try {
        const result = await login(data.email, data.password);

        if (result?.success) {
          navigate('/dashboard', { replace: true });
        } else {
          setLoginError(result?.error || ERROR_MESSAGES.invalid);
          reset({ password: '' });
        }
      } catch (error) {
        console.error('Login error:', error);
        
        let errorMessage = ERROR_MESSAGES.default;
        if (error.message?.includes('Network Error')) {
          errorMessage = ERROR_MESSAGES.network;
        } else if (error.message?.includes('timeout')) {
          errorMessage = ERROR_MESSAGES.timeout;
        }
        setLoginError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [login, navigate, reset]
  );

  // CONDITIONAL RETURNS GO AFTER ALL HOOKS
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show loading state
  if (loading || !isReady) {
    return <LoadingState />;
  }

  // Render
  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center transition-theme relative overflow-hidden ${
        isDark ? 'bg-[#0a0e17]' : 'bg-gray-50'
      }`}
    >
      <GridBackground isDark={isDark} />
      <GlowEffects isDark={isDark} />

      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle variant="minimal" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#06080e]/80 backdrop-blur-xl animate-fade-in rounded-3xl">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
              <p className="mt-4 text-white">Logging in...</p>
            </div>
          </div>
        )}

        <div
          className={`w-full transition-all duration-500 ${
            isSubmitting
              ? 'opacity-0 blur-[4px] scale-95 pointer-events-none'
              : 'opacity-100 blur-0 scale-100'
          }`}
        >
          {/* Glow Layers */}
          <div
            className="absolute -inset-1 rounded-3xl blur-2xl animate-pulse-glow"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, #00e5ff, #ff007f, #b300ff, #00e5ff)'
                : 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)',
              backgroundSize: '300% 300%',
              opacity: 0.2,
            }}
          />
          <div
            className="absolute -inset-2 rounded-3xl blur-3xl"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(0, 229, 255, 0.12), rgba(255, 0, 127, 0.12), rgba(179, 0, 255, 0.12))'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(139, 92, 246, 0.08), rgba(236, 72, 153, 0.08))',
              opacity: 0.12,
            }}
          />

          {/* Main Card */}
          <div
            className={`relative rounded-3xl overflow-hidden animate-fade-in ${
              isDark
                ? 'bg-[#0a0e1a]/90 backdrop-blur-xl border border-white/5'
                : 'bg-white/90 backdrop-blur-xl border border-gray-200/50'
            }`}
            style={{
              boxShadow: isDark
                ? `
                  0 0 60px rgba(0, 229, 255, 0.12),
                  0 0 120px rgba(255, 0, 127, 0.08),
                  0 0 180px rgba(179, 0, 255, 0.06),
                  inset 0 0 60px rgba(0, 229, 255, 0.04),
                  inset 0 0 30px rgba(255, 0, 127, 0.02),
                  0 20px 60px rgba(0, 0, 0, 0.3)
                `
                : `
                  0 0 60px rgba(59, 130, 246, 0.08),
                  0 0 120px rgba(139, 92, 246, 0.06),
                  0 0 180px rgba(236, 72, 153, 0.04),
                  inset 0 0 60px rgba(59, 130, 246, 0.02),
                  inset 0 0 30px rgba(139, 92, 246, 0.015),
                  0 20px 60px rgba(0, 0, 0, 0.08)
                `,
            }}
          >
            {/* Card Decorations */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-blue-500/20 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-blue-500/20 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-blue-500/20 rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-blue-500/20 rounded-br-3xl" />

            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl" />

            {/* Content Grid */}
            <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-0">
              {/* Left Panel - Branding */}
              <div
                className={`hidden lg:flex lg:col-span-2 flex-col justify-center items-center p-8 relative overflow-hidden ${
                  isDark
                    ? 'bg-gradient-to-br from-[#0a0e1a] via-[#0d1520] to-[#0a0e1a] border-r border-white/5'
                    : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-r border-gray-200/50'
                }`}
              >
                <div className="absolute inset-0 pointer-events-none">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: isDark
                        ? `
                          linear-gradient(rgba(0, 229, 255, 0.02) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(0, 229, 255, 0.02) 1px, transparent 1px)
                        `
                        : `
                          linear-gradient(rgba(0, 229, 255, 0.01) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(0, 229, 255, 0.01) 1px, transparent 1px)
                        `,
                      backgroundSize: '20px 20px',
                    }}
                  />
                  <div
                    className="absolute -top-40 -left-40 w-64 h-64 rounded-full blur-3xl"
                    style={{
                      background: isDark
                        ? 'radial-gradient(circle, rgba(0, 229, 255, 0.08), transparent 70%)'
                        : 'radial-gradient(circle, rgba(0, 229, 255, 0.05), transparent 70%)',
                    }}
                  />
                </div>

                <div className="relative z-10 text-center">
                  <img
                    src={logoSrc}
                    alt="DEVXLINE"
                    className={`h-35 w-auto mx-auto mb-4 transition-all duration-300 ${
                      isDark ? 'mix-blend-lighten opacity-90' : ''
                    }`}
                  />

                  <h1
                    className={`text-3xl font-bold mb-2 ${
                      isDark
                        ? 'bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent'
                        : 'text-gray-900'
                    }`}
                  >
                    Welcome Back
                  </h1>

                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Log in to your workspace
                  </p>

                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2">
                      <Security
                        className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-500'}`}
                      />
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Enterprise-grade security
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle
                        className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-500'}`}
                      />
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Two-factor authentication ready
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fingerprint
                        className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-500'}`}
                      />
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Biometric login support
                      </span>
                    </div>
                  </div>

                  <div
                    className={`mt-4 inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border ${
                      isDark
                        ? 'border-green-500/20 bg-green-500/10'
                        : 'border-green-200 bg-green-50'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span
                      className={`text-[10px] font-mono ${
                        isDark ? 'text-green-400' : 'text-green-600'
                      }`}
                    >
                      SECURE CONNECTION
                    </span>
                    <span
                      className={`text-[10px] font-mono ${
                        isDark ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    >
                      v2.0.1
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Panel - Login Form */}
              <div
                className={`lg:col-span-3 relative ${
                  isDark ? 'bg-[#0a0e1a]/90 backdrop-blur-xl' : 'bg-white/90 backdrop-blur-xl'
                }`}
              >
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: isDark
                        ? `
                          linear-gradient(rgba(0, 229, 255, 0.02) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(0, 229, 255, 0.02) 1px, transparent 1px)
                        `
                        : `
                          linear-gradient(rgba(0, 229, 255, 0.01) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(0, 229, 255, 0.01) 1px, transparent 1px)
                        `,
                      backgroundSize: '20px 20px',
                    }}
                  />
                </div>

                {/* Mobile Logo */}
                <div className="lg:hidden flex justify-center pt-6 pb-2">
                  <img
                    src={logoSrc}
                    alt="DEVXLINE"
                    className={`h-12 w-auto transition-all duration-300 ${
                      isDark ? 'mix-blend-lighten opacity-90' : ''
                    }`}
                  />
                </div>

                <div className="relative p-6 md:p-8">
                  {/* Mobile Welcome */}
                  <div className="lg:hidden text-center mb-4">
                    <h2
                      className={`text-xl font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Welcome Back
                    </h2>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Log in to your workspace
                    </p>
                  </div>

                  {/* Error Message */}
                  {loginError && (
                    <div
                      className={`mb-4 p-3 rounded-2xl text-sm flex items-center gap-3 border animate-shake ${
                        isDark
                          ? 'bg-red-900/20 border-red-800/30 text-red-300'
                          : 'bg-red-50 border-red-200 text-red-600'
                      }`}
                      role="alert"
                    >
                      <span className="text-lg">⚠️</span>
                      <span>{loginError}</span>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email Field */}
                    <FormInput
                      id="email"
                      label="Email Address"
                      icon={Email}
                      type="email"
                      register={register('email')}
                      error={errors.email}
                      isFocused={isFocused.email}
                      onFocus={() => handleFocus('email')}
                      onBlur={() => handleBlur('email')}
                      isDark={isDark}
                      disabled={isSubmitting}
                      placeholder="name@example.com"
                      autoComplete="email"
                    />

                    {/* Password Field */}
                    <FormInput
                      id="password"
                      label="Password"
                      icon={Lock}
                      type={showPassword ? 'text' : 'password'}
                      register={register('password')}
                      error={errors.password}
                      isFocused={isFocused.password}
                      onFocus={() => handleFocus('password')}
                      onBlur={() => handleBlur('password')}
                      isDark={isDark}
                      disabled={isSubmitting}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      rightElement={
                        <PasswordToggle
                          show={showPassword}
                          onToggle={handleTogglePassword}
                          isDark={isDark}
                          disabled={isSubmitting}
                        />
                      }
                    />

                    {/* Forgot Password */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className={`text-xs font-medium transition-all duration-300 hover:scale-105 ${
                          isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                        }`}
                        onClick={() =>
                          alert('Please contact your administrator to reset your password.')
                        }
                        disabled={isSubmitting}
                      >
                        Forgot password?
                      </button>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 rounded-2xl font-semibold text-sm transition-all duration-300 relative overflow-hidden group ${
                        isSubmitting
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:scale-[1.01] active:scale-[0.98] hover:shadow-2xl'
                      }`}
                    >
                      <span
                        className={`absolute inset-0 bg-gradient-to-r ${
                          isDark
                            ? 'from-blue-600 via-purple-600 to-blue-600'
                            : 'from-blue-500 via-purple-500 to-blue-500'
                        } transition-all duration-500 group-hover:scale-110 group-hover:bg-[length:200%_100%] ${
                          isSubmitting ? 'scale-100' : ''
                        }`}
                        style={{ backgroundSize: '200% 100%' }}
                      />
                      <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Logging in...
                          </>
                        ) : (
                          <>
                            <Fingerprint className="w-4 h-4" />
                            Secure Login
                          </>
                        )}
                      </span>
                    </button>

                    {/* Divider */}
                    <div className="relative my-3">
                      <div className="absolute inset-0 flex items-center">
                        <div
                          className={`w-full border-t ${
                            isDark ? 'border-white/10' : 'border-gray-200'
                          }`}
                        />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span
                          className={`px-3 ${
                            isDark ? 'bg-[#0a0e1a] text-gray-400' : 'bg-white/90 text-gray-500'
                          }`}
                        >
                          Or continue with
                        </span>
                      </div>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-3">
                      <SocialLoginButton
                        icon={Google}
                        label="Google"
                        onClick={() => handleSocialLogin('Google')}
                        isDark={isDark}
                        disabled={isSubmitting}
                      />
                      <SocialLoginButton
                        icon={MicrosoftIcon}
                        label="Microsoft"
                        onClick={() => handleSocialLogin('Microsoft')}
                        isDark={isDark}
                        disabled={isSubmitting}
                      />
                    </div>
                  </form>

                  {/* Footer */}
                  <div className="mt-4 text-center text-xs">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                      Don't have an account?{' '}
                    </span>
                    <button
                      type="button"
                      className={`font-semibold transition-all duration-300 hover:scale-105 ${
                        isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                      }`}
                      onClick={() => alert('Registration is handled by the Admin Panel.')}
                      disabled={isSubmitting}
                    >
                      Contact Admin
                    </button>
                  </div>

                  {/* Mobile Security Badge */}
                  <div className="lg:hidden mt-3 flex justify-center">
                    <div
                      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full border ${
                        isDark
                          ? 'border-green-500/20 bg-green-500/10'
                          : 'border-green-200 bg-green-50'
                      }`}
                    >
                      <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                      <span
                        className={`text-[8px] font-mono ${
                          isDark ? 'text-green-400' : 'text-green-600'
                        }`}
                      >
                        SECURE
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.02); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;