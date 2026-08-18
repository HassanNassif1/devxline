import React from 'react';
import logo from '../../assets/images/co-develop-logo.png';

const LogoAdvanced = ({
  variant = 'default',
  showIcon = true,
  showName = true,
  showTagline = false,
  iconOnly = false,
  className = '',
}) => {
  const variants = {
    default: 'h-16',
    sidebar: 'h-20',
    header: 'h-12',
    login: 'h-28',
    small: 'h-10',
    large: 'h-32',
    mobile: 'h-10',
  };

  const nameSizes = {
    default: 'text-2xl',
    sidebar: 'text-2xl',
    header: 'text-xl',
    login: 'text-4xl',
    small: 'text-lg',
    large: 'text-5xl',
    mobile: 'text-base',
  };

  const taglineSizes = {
    default: 'text-xs',
    sidebar: 'text-xs',
    header: 'text-[10px]',
    login: 'text-base',
    small: 'text-[8px]',
    large: 'text-lg',
    mobile: 'text-[8px]',
  };

  const containerClasses = {
    default: 'flex-col items-center',
    sidebar: 'flex-col items-center',
    header: 'flex-row items-center space-x-3',
    login: 'flex-col items-center',
    small: 'flex-row items-center space-x-2',
    large: 'flex-col items-center',
    mobile: 'flex-row items-center space-x-2',
  };

  const imageSize = variants[variant] || variants.default;
  const nameSize = nameSizes[variant] || nameSizes.default;
  const taglineSize = taglineSizes[variant] || taglineSizes.default;
  const containerClass = containerClasses[variant] || containerClasses.default;

  if (iconOnly) {
    return (
      <div className={`flex ${containerClass} ${className}`}>
        <img 
          src={logo} 
          alt="Co Develop" 
          className={`${imageSize} w-auto object-contain`}
        />
      </div>
    );
  }

  return (
    <div className={`flex ${containerClass} ${className}`}>
      {showIcon && (
        <img 
          src={logo} 
          alt="Co Develop" 
          className={`${imageSize} w-auto object-contain`}
        />
      )}
      
      <div className={`flex flex-col ${variant === 'header' || variant === 'small' || variant === 'mobile' ? '' : 'items-center'}`}>
        {showName && (
          <span className={`font-bold text-gray-800 ${nameSize}`}>
            Co Develop
          </span>
        )}
        {showTagline && (
          <span className={`text-gray-500 font-medium tracking-wide ${taglineSize}`}>
            SMART SOLUTIONS FOR A DIGITAL WORLD
          </span>
        )}
      </div>
    </div>
  );
};

export default LogoAdvanced;