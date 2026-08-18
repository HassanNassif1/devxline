import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  FolderOpen as ProjectsIcon,
  Assessment as AssessmentIcon,
  Logout as LogoutIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Security as SecurityIcon,
  ConfirmationNumber as TicketIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  ListAlt as ListAltIcon,
  Rule as RuleIcon,
  Task as TaskIcon,
  PlaylistAddCheck as PlaylistAddCheckIcon,
  CheckCircle as CheckCircleIcon,
  PendingActions as PendingActionsIcon,
  Speed as SpeedIcon,
  FolderOpen as FolderOpenIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Logo from '../common/Logo';
import ThemeToggle from '../common/ThemeToggle';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [expandedMenus, setExpandedMenus] = useState({
    taskManagement: true,
    projectManagement: false,
    userManagement: false,
    ticketManagement: false,
  });

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const isChildActive = (children) => {
    return children.some(child => {
      return location.pathname === child.path || 
             location.pathname.startsWith(child.path + '/');
    });
  };

  const isItemActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { 
      path: '/dashboard', 
      icon: DashboardIcon, 
      label: 'Dashboard',
      type: 'single',
      glow: '#00e5ff'
    },
    // {
    //   type: 'menu',
    //   icon: TaskIcon,
    //   label: 'Tasks',
    //   key: 'taskManagement',
    //   glow: '#ff007f',
    //   children: [
    //     { path: '/tasks', icon: PlaylistAddCheckIcon, label: 'All Tasks' },
    //     { path: '/tasks/my', icon: AssignmentIcon, label: 'My Tasks' },
    //     { path: '/tasks/completed', icon: CheckCircleIcon, label: 'Completed' },
    //     { path: '/tasks/pending', icon: PendingActionsIcon, label: 'Pending' },
    //   ]
    // },
    {
      type: 'menu',
      icon: ProjectsIcon,
      label: 'Project Management',
      key: 'projectManagement',
      glow: '#b300ff',
      children: [
        { path: '/projects', icon: FolderOpenIcon, label: 'Projects' },
      { path: '/api-docs', icon: FolderOpenIcon, label: 'API Requests' },
      ]
    },
    {
      type: 'menu',
      icon: PeopleIcon,
      label: 'Users',
      key: 'userManagement',
      glow: '#00e5ff',
      children: [
        { path: '/users', icon: PersonIcon, label: 'Users' },
        { path: '/roles', icon: AdminPanelSettingsIcon, label: 'Roles' },
        { path: '/permissions', icon: SecurityIcon, label: 'Permissions' },
        { path: '/role-permissions', icon: RuleIcon, label: 'Role Permissions' },
      ]
    },
    {
      type: 'menu',
      icon: TicketIcon,
      label: 'Tickets',
      key: 'ticketManagement',
      glow: '#ff4da6',
      children: [
        { path: '/tickets', icon: TicketIcon, label: 'All Tickets' },
        { path: '/tickets/my', icon: AssignmentIcon, label: 'My Tickets' },
        { path: '/tickets/reported', icon: ListAltIcon, label: 'Reported' },
      ]
    },
    { 
      path: '/clients', 
      icon: BusinessIcon, 
      label: 'Clients',
      type: 'single',
      glow: '#33ebff'
    },

    { 
      path: '/reports', 
      icon: AssessmentIcon, 
      label: 'Reports',
      type: 'single',
      glow: '#cc33ff'
    },
    { 
      path: '/settings', 
      icon: SettingsIcon, 
      label: 'Settings',
      type: 'single',
      glow: '#ff007f'
    },
  ];

  const renderNavItem = (item) => {
    if (item.type === 'single') {
      const isActive = isItemActive(item.path);
      const glowColor = item.glow || '#00e5ff';
      
      // Light mode colors
      const lightBg = isActive 
        ? `linear-gradient(135deg, ${glowColor}10, ${glowColor}05)`
        : 'transparent';
      const lightBorder = isActive ? `1px solid ${glowColor}30` : '1px solid transparent';
      const lightShadow = isActive ? `0 0 20px ${glowColor}10` : 'none';
      
      // Dark mode colors
      const darkBg = isActive 
        ? `linear-gradient(135deg, ${glowColor}15, ${glowColor}08)`
        : 'transparent';
      const darkBorder = isActive ? `1px solid ${glowColor}40` : '1px solid transparent';
      const darkShadow = isActive ? `0 0 30px ${glowColor}15` : 'none';

      return (
        <NavLink
          key={item.path}
          to={item.path}
          className={`relative group flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
            isActive
              ? isDark ? 'text-white' : 'text-gray-900'
              : isDark 
                ? 'text-gray-400 hover:text-white hover:bg-[#1a2438]/50' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
          }`}
          style={{
            background: isDark ? darkBg : lightBg,
            border: isDark ? darkBorder : lightBorder,
            boxShadow: isDark ? darkShadow : lightShadow,
          }}
          onClick={() => setIsOpen(false)}
        >
          {isActive && (
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
              style={{ 
                background: `linear-gradient(180deg, ${glowColor}, ${glowColor}40)`,
                boxShadow: isDark ? `0 0 10px ${glowColor}30` : `0 0 10px ${glowColor}15`
              }}
            />
          )}
          <item.icon 
            className="w-5 h-5 transition-colors duration-300"
            style={{ 
              color: isActive ? glowColor : (isDark ? 'inherit' : '#4a5568'),
              filter: isActive 
                ? (isDark ? `drop-shadow(0 0 8px ${glowColor}50)` : `drop-shadow(0 0 4px ${glowColor}30)`)
                : 'none'
            }} 
          />
          <span className={`text-sm font-medium tracking-wide ${isActive ? (isDark ? 'text-white' : 'text-gray-900') : ''}`}>
            {item.label}
          </span>
          
          {/* Hover Glow Effect */}
          <div 
            className={`absolute inset-0 rounded-lg transition-opacity duration-300 pointer-events-none ${
              isActive ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
            }`}
            style={{
              background: isDark 
                ? `radial-gradient(circle at 30% 50%, ${glowColor}08, transparent 70%)`
                : `radial-gradient(circle at 30% 50%, ${glowColor}05, transparent 70%)`,
            }}
          />
        </NavLink>
      );
    }

    if (item.type === 'menu') {
      const isExpanded = expandedMenus[item.key];
      const hasActiveChild = isChildActive(item.children);
      const isMenuActive = hasActiveChild;
      const glowColor = item.glow || '#ff007f';

      // Light mode colors
      const lightMenuBg = isMenuActive 
        ? `linear-gradient(135deg, ${glowColor}10, ${glowColor}05)`
        : 'transparent';
      const lightMenuBorder = isMenuActive ? `1px solid ${glowColor}30` : '1px solid transparent';
      const lightMenuShadow = isMenuActive ? `0 0 20px ${glowColor}10` : 'none';
      
      // Dark mode colors
      const darkMenuBg = isMenuActive 
        ? `linear-gradient(135deg, ${glowColor}12, ${glowColor}08)`
        : 'transparent';
      const darkMenuBorder = isMenuActive ? `1px solid ${glowColor}40` : '1px solid transparent';
      const darkMenuShadow = isMenuActive ? `0 0 30px ${glowColor}15` : 'none';

      return (
        <div key={item.key} className="space-y-0.5">
          <button
            onClick={() => toggleMenu(item.key)}
            className={`relative group flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-all duration-300 ${
              isMenuActive
                ? isDark ? 'text-white' : 'text-gray-900'
                : isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-[#1a2438]/50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
            }`}
            style={{
              background: isDark ? darkMenuBg : lightMenuBg,
              border: isDark ? darkMenuBorder : lightMenuBorder,
              boxShadow: isDark ? darkMenuShadow : lightMenuShadow,
            }}
          >
            <div className="flex items-center space-x-3">
              <item.icon 
                className="w-5 h-5 transition-colors duration-300"
                style={{ 
                  color: isMenuActive ? glowColor : (isDark ? 'inherit' : '#4a5568'),
                  filter: isMenuActive 
                    ? (isDark ? `drop-shadow(0 0 8px ${glowColor}50)` : `drop-shadow(0 0 4px ${glowColor}30)`)
                    : 'none'
                }} 
              />
              <span className={`text-sm font-medium tracking-wide ${isMenuActive ? (isDark ? 'text-white' : 'text-gray-900') : ''}`}>
                {item.label}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {/* Status Indicator */}
              {isMenuActive && (
                <div 
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ 
                    background: glowColor,
                    boxShadow: isDark ? `0 0 8px ${glowColor}50` : `0 0 4px ${glowColor}30`
                  }}
                />
              )}
              {isExpanded ? (
                <ExpandLessIcon className={`w-4 h-4 ${isDark ? 'opacity-60' : 'opacity-40'}`} />
              ) : (
                <ExpandMoreIcon className={`w-4 h-4 ${isDark ? 'opacity-60' : 'opacity-40'}`} />
              )}
            </div>

            {/* Hover Glow Effect */}
            <div 
              className={`absolute inset-0 rounded-lg transition-opacity duration-300 pointer-events-none ${
                isMenuActive ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
              }`}
              style={{
                background: isDark 
                  ? `radial-gradient(circle at 30% 50%, ${glowColor}08, transparent 70%)`
                  : `radial-gradient(circle at 30% 50%, ${glowColor}05, transparent 70%)`,
              }}
            />
          </button>
          
          {isExpanded && (
            <div 
              className="ml-6 space-y-0.5 pl-3 relative"
              style={{
                borderLeft: `2px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
              }}
            >
              {/* Vertical Line with Gradient */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-[2px] opacity-20"
                style={{
                  background: `linear-gradient(180deg, ${glowColor}, ${glowColor}00)`
                }}
              />
              
              {item.children.map((child) => {
                const isChildActive = location.pathname === child.path;
                return (
                  <NavLink
                    key={child.path}
                    to={child.path}
                    className={`relative group flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
                      isChildActive
                        ? isDark ? 'text-white font-medium' : 'text-gray-900 font-medium'
                        : isDark 
                          ? 'text-gray-400 hover:text-white hover:bg-[#1a2438]/50' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                    }`}
                    style={{
                      background: isChildActive 
                        ? (isDark ? `${glowColor}15` : `${glowColor}08`)
                        : 'transparent',
                      border: isChildActive 
                        ? (isDark ? `1px solid ${glowColor}30` : `1px solid ${glowColor}20`)
                        : '1px solid transparent',
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    {isChildActive && (
                      <div 
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                        style={{ 
                          background: glowColor,
                          boxShadow: isDark ? `0 0 8px ${glowColor}30` : `0 0 4px ${glowColor}15`
                        }}
                      />
                    )}
                    <child.icon 
                      className="w-4 h-4 transition-colors duration-300"
                      style={{ 
                        color: isChildActive ? glowColor : (isDark ? 'inherit' : '#718096'),
                        filter: isChildActive 
                          ? (isDark ? `drop-shadow(0 0 6px ${glowColor}50)` : `drop-shadow(0 0 3px ${glowColor}30)`)
                          : 'none'
                      }} 
                    />
                    <span>{child.label}</span>
                    
                    {/* Hover Glow for Child */}
                    <div 
                      className={`absolute inset-0 rounded-lg transition-opacity duration-300 pointer-events-none ${
                        isChildActive ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
                      }`}
                      style={{
                        background: isDark 
                          ? `radial-gradient(circle at 30% 50%, ${glowColor}06, transparent 70%)`
                          : `radial-gradient(circle at 30% 50%, ${glowColor}04, transparent 70%)`,
                      }}
                    />
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>
      );
    }
  };

  // Sidebar background colors
  const sidebarBg = isDark 
    ? 'bg-gradient-to-b from-[#0a0e17] via-[#0d1520] to-[#0a0e17]'
    : 'bg-gradient-to-b from-gray-50 via-white to-gray-50';
  
  const sidebarBorder = isDark ? 'border-white/5' : 'border-gray-200/50';
  const sidebarShadow = isDark 
    ? '0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 80px rgba(0, 229, 255, 0.02)'
    : '0 0 40px rgba(0, 0, 0, 0.05), inset 0 0 80px rgba(0, 229, 255, 0.01)';

  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 z-40 lg:hidden ${
            isDark ? 'bg-black/60 backdrop-blur-md' : 'bg-black/20 backdrop-blur-sm'
          }`}
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-72 ${sidebarBg} border-r ${sidebarBorder} transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 h-full overflow-y-auto`}
        style={{
          boxShadow: sidebarShadow
        }}
      >
        {/* Grid Background - Light/Dark mode */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: isDark 
              ? `
                linear-gradient(rgba(0, 229, 255, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 229, 255, 0.05) 1px, transparent 1px)
              `
              : `
                linear-gradient(rgba(0, 229, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 229, 255, 0.03) 1px, transparent 1px)
              `,
            backgroundSize: '20px 20px',
            opacity: isDark ? 0.5 : 0.3
          }}
        />

        <div className="relative flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center justify-between px-4 py-5 border-b ${isDark ? 'border-white/5' : 'border-gray-200/50'}`}>
            <Logo variant="sidebar" className="w-full" />
            <button
              onClick={() => setIsOpen(false)}
              className={`lg:hidden p-1.5 rounded-lg transition-colors ${
                isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'
              }`}
            >
              <CloseIcon className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => renderNavItem(item))}
          </nav>

          {/* Bottom Section */}
          <div className={`px-3 py-4 border-t ${isDark ? 'border-white/5' : 'border-gray-200/50'} space-y-3`}>
            {/* System Status */}
            <div className={`flex items-center justify-between px-3 py-2 rounded-lg backdrop-blur-sm border ${
              isDark 
                ? 'bg-white/5 border-white/5' 
                : 'bg-gray-50/80 border-gray-200/50'
            }`}>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className={`text-xs font-mono ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  SYS.ONLINE
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-mono ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  v2.0.1
                </span>
                <div className="w-4 h-4 flex items-center justify-center">
                  <div className={`w-1 h-1 rounded-full ${
                    isDark ? 'bg-blue-400' : 'bg-blue-500'
                  } animate-pulse`} style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-3 py-2">
              <ThemeToggle />
              <button
                onClick={logout}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 group relative overflow-hidden ${
                  isDark 
                    ? 'bg-gradient-to-r from-red-500/10 to-red-600/5 border border-red-500/20 hover:border-red-500/40'
                    : 'bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200 hover:border-red-300'
                }`}
              >
                {/* Glow Effect */}
                <div 
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    isDark 
                      ? 'bg-gradient-to-r from-red-500/10 to-red-600/5'
                      : 'bg-gradient-to-r from-red-100/50 to-red-200/30'
                  }`}
                />
                <LogoutIcon className={`w-4 h-4 ${
                  isDark ? 'text-red-400 group-hover:text-red-300' : 'text-red-600 group-hover:text-red-700'
                } transition-colors relative z-10`} />
                <span className={`text-xs font-medium ${
                  isDark ? 'text-red-400 group-hover:text-red-300' : 'text-red-600 group-hover:text-red-700'
                } transition-colors relative z-10 tracking-wide`}>
                  LOGOUT
                </span>
              </button>
            </div>

            {/* Tech Footer */}
            <div className="text-center px-3 py-1">
              <div className={`flex items-center justify-center space-x-2 text-[9px] font-mono ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}>
                <span>{'<'}</span>
                <span>SECURE</span>
                <span className={`w-1 h-1 rounded-full ${isDark ? 'bg-blue-400/50' : 'bg-blue-400/30'}`} />
                <span>CONNECTION</span>
                <span>{'>'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Corner Glows */}
        <div 
          className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
          style={{
            background: isDark 
              ? 'radial-gradient(circle at top right, rgba(0, 229, 255, 0.05), transparent 70%)'
              : 'radial-gradient(circle at top right, rgba(0, 229, 255, 0.03), transparent 70%)'
          }}
        />
        <div 
          className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none"
          style={{
            background: isDark 
              ? 'radial-gradient(circle at bottom left, rgba(255, 0, 127, 0.05), transparent 70%)'
              : 'radial-gradient(circle at bottom left, rgba(255, 0, 127, 0.02), transparent 70%)'
          }}
        />
      </aside>
    </>
  );
};

export default Sidebar;