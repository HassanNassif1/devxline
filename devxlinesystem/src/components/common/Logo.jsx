import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import logoLight from '../../assets/images/devxlinelight.png';
import logoDark from '../../assets/images/devxlinedark.png';

const Logo = ({ 
  variant = 'default',
  showName = true,
  showTagline = false,
  className = '',
  imageClassName = '',
  textClassName = '',
  taglineClassName = '',
  forceTheme = null, // 'light', 'dark', or null for auto
}) => {
  const { isDark } = useTheme();
  
  // Determine which logo to use
  const shouldUseDark = forceTheme === 'dark' || (forceTheme === null && isDark);
  const logoSrc = shouldUseDark ? logoDark : logoLight;

  // Define size variants
  const variants = {
    default: {
      image: 'h-24 w-auto',
      name: 'text-3xl',
      tagline: 'text-sm',
      container: 'flex-col items-center'
    },
    sidebar: {
      image: 'h-32 w-auto',
      name: 'text-4xl font-bold',
      tagline: 'text-sm',
      container: 'flex-col items-center'
    },
    header: {
      image: 'h-16 w-auto',
      name: 'text-2xl font-bold',
      tagline: 'text-xs',
      container: 'flex-row items-center space-x-4'
    },
    login: {
      image: 'h-40 w-auto',
      name: 'text-5xl font-bold',
      tagline: 'text-xl',
      container: 'flex-col items-center'
    },
    small: {
      image: 'h-14 w-auto',
      name: 'text-xl',
      tagline: 'text-[10px]',
      container: 'flex-row items-center space-x-3'
    },
    large: {
      image: 'h-48 w-auto',
      name: 'text-6xl font-bold',
      tagline: 'text-2xl',
      container: 'flex-col items-center'
    },
    mobile: {
      image: 'h-14 w-auto',
      name: 'text-xl font-bold',
      tagline: 'text-[10px]',
      container: 'flex-row items-center space-x-3'
    },
    xl: {
      image: 'h-56 w-auto',
      name: 'text-7xl font-bold',
      tagline: 'text-2xl',
      container: 'flex-col items-center'
    },
    hero: {
      image: 'h-64 w-auto',
      name: 'text-8xl font-bold',
      tagline: 'text-3xl',
      container: 'flex-col items-center'
    }
  };

  const variantStyles = variants[variant] || variants.default;

  // Text colors based on theme
  const textColor = shouldUseDark ? 'text-white' : 'text-gray-800';
  const taglineColor = shouldUseDark ? 'text-gray-300' : 'text-gray-500';

  return (
    <div className={`flex ${variantStyles.container} ${className}`}>
      {/* Logo Image */}
      <img 
                  src={logoSrc} 
                  alt="Devxline" 
                  className={`h-40 md:h-40 w-auto object-contain transition-all duration-300 ${
                    isDark ? 'mix-blend-lighten opacity-90' : ''
                  }`} 
                />
    </div>
  );
};

export default Logo;