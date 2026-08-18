import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, Cell, PieChart, Pie 
} from 'recharts';
import CountUp from 'react-countup';
import { useAuth } from '../../context/AuthContext';
import {
  UserOutlined, TeamOutlined, DollarOutlined, AppstoreOutlined, 
  ExclamationCircleOutlined, FlagOutlined, RocketOutlined,
  BellOutlined, ReloadOutlined, FilterOutlined, DashboardOutlined,
  MenuOutlined, CloseOutlined
} from '@ant-design/icons';
import { Typography, Badge, Button, Progress, Avatar, Drawer } from 'antd';
import {dashboardApi} from '../../api/dashboardApi';
import Loader from '../common/Loader';
import { useTheme } from '../../context/ThemeContext';
import WorldMap from './WorldMap';

const { Text } = Typography;

// ============ CYBERPUNK / SYNTHWAVE COLOR PALETTE ============
const CYBER_COLORS = [
  { primary: '#ff007f', light: '#ff4da6', bg: 'linear-gradient(135deg, rgba(255, 0, 127, 0.15) 0%, rgba(255, 0, 127, 0.02) 100%)' },
  { primary: '#00e5ff', light: '#33ebff', bg: 'linear-gradient(135deg, rgba(0, 229, 255, 0.15) 0%, rgba(0, 229, 255, 0.02) 100%)' },
  { primary: '#b300ff', light: '#cc33ff', bg: 'linear-gradient(135deg, rgba(179, 0, 255, 0.15) 0%, rgba(179, 0, 255, 0.02) 100%)' },
  { primary: '#ff007f', light: '#ff4da6', bg: 'linear-gradient(135deg, rgba(255, 0, 127, 0.15) 0%, rgba(255, 0, 127, 0.02) 100%)' },
  { primary: '#00e5ff', light: '#33ebff', bg: 'linear-gradient(135deg, rgba(0, 229, 255, 0.15) 0%, rgba(0, 229, 255, 0.02) 100%)' },
  { primary: '#b300ff', light: '#cc33ff', bg: 'linear-gradient(135deg, rgba(179, 0, 255, 0.15) 0%, rgba(179, 0, 255, 0.02) 100%)' },
];

// ============ RESPONSIVE CARD WRAPPER ============
const CardWrapper = memo(({ children, id, isHovered, onMouseEnter, onMouseLeave, isDark, colorIndex = 0, style = {} }) => {
  const isActive = isHovered === id;
  const color = CYBER_COLORS[colorIndex % CYBER_COLORS.length];
  
  return (
    <div 
      onMouseEnter={() => onMouseEnter(id)}
      onMouseLeave={onMouseLeave}
      style={{
        borderRadius: 16,
        padding: 'clamp(16px, 3vw, 24px)',
        background: isDark 
          ? 'linear-gradient(135deg, rgba(10, 8, 20, 0.8) 0%, rgba(20, 12, 30, 0.6) 100%)' 
          : 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: isDark 
          ? `1px solid ${color.primary}40`
          : '1px solid rgba(255,255,255,0.8)',
        boxShadow: isDark 
          ? `0 0 30px ${color.primary}15, inset 0 0 15px ${color.primary}05`
          : `0 8px 32px rgba(108, 92, 231, 0.1)`,
        transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
        transform: isActive ? 'translateY(-4px) scale(1.01)' : 'translateY(0)',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        minHeight: 'clamp(250px, 40vh, 300px)',
        ...style
      }}
    >
      {isActive && isDark && (
        <div style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 300,
          height: 300,
          background: `radial-gradient(circle, ${color.primary}25, transparent 70%)`,
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />
      )}
      {children}
    </div>
  );
});

// ============ RESPONSIVE STAT CARD ============
const StatCard = memo(({ stat, isDark, colorIndex }) => {
  const Icon = stat.icon;
  const color = CYBER_COLORS[colorIndex % CYBER_COLORS.length];
  
  const getTextColor = () => isDark ? '#e0e7ff' : '#1a1a2e';
  const getLabelColor = () => isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';

  return (
    <div style={{
      background: isDark 
        ? `linear-gradient(135deg, rgba(10, 8, 20, 0.8) 0%, ${color.primary}08 100%)`
        : 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      borderRadius: 16,
      padding: 'clamp(12px, 2vw, 20px)',
      border: isDark ? `1px solid ${color.primary}30` : '1px solid rgba(255,255,255,0.1)',
      boxShadow: isDark ? `0 0 20px ${color.primary}10` : 'none',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: '100%',
      minHeight: 'clamp(80px, 12vh, 110px)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      ':hover': {
        transform: 'scale(1.02)'
      }
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'clamp(28px, 4vw, 36px)',
        height: 'clamp(28px, 4vw, 36px)',
        borderRadius: '50%',
        background: isDark ? `${color.primary}20` : `${color.primary}15`,
        marginBottom: 'clamp(6px, 1vw, 12px)',
        boxShadow: isDark ? `0 0 15px ${color.primary}20` : 'none'
      }}>
        <Icon style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: isDark ? color.light : color.primary }} />
      </div>
      
      <div style={{ 
        fontSize: 'clamp(18px, 3vw, 22px)', 
        fontWeight: 700, 
        color: getTextColor(), 
        marginBottom: 2, 
        letterSpacing: '-0.5px' 
      }}>
        {stat.prefix && stat.prefix}<CountUp end={stat.value} decimals={stat.value % 1 !== 0 ? 1 : 0} duration={2.5} />
        {stat.suffix && stat.suffix}
      </div>
      <div style={{ 
        fontSize: 'clamp(10px, 1.2vw, 12px)', 
        color: getLabelColor(), 
        fontWeight: 500, 
        letterSpacing: '0.5px' 
      }}>{stat.label}</div>
      
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: `linear-gradient(90deg, transparent, ${color.primary}, transparent)`,
        opacity: 0.6
      }} />
    </div>
  );
});

// ============ RESPONSIVE WELCOME HEADER ============
const WelcomeHeader = memo(({ isDark, onMenuToggle, mobileMenuOpen }) => {
  const mutedColor = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 'clamp(8px, 1.5vw, 12px) 0',
      marginBottom: 'clamp(4px, 1vw, 8px)',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1.5vw, 12px)' }}>
        {isMobile && (
          <Button
            type="text"
            icon={mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
            onClick={onMenuToggle}
            style={{
              color: isDark ? '#fff' : '#1a1a2e',
              fontSize: 20
            }}
          />
        )}
        <div style={{
          width: 'clamp(40px, 6vw, 48px)',
          height: 'clamp(40px, 6vw, 48px)',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ff007f, #00e5ff)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 0 30px rgba(255, 0, 127, 0.3)',
          flexShrink: 0
        }}>
          <DashboardOutlined style={{ fontSize: 'clamp(18px, 3vw, 24px)', color: '#fff' }} />
        </div>
        <div>
          <h2 style={{ 
            fontSize: 'clamp(16px, 2.5vw, 22px)', 
            fontWeight: 700, 
            color: isDark ? '#fff' : '#1a1a2e', 
            margin: 0,
            background: 'linear-gradient(135deg, #ff007f, #00e5ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {user?.firstName || 'Welcome back, Admin!'}
          </h2>
          <Text style={{ fontSize: 'clamp(11px, 1.2vw, 13px)', color: mutedColor }}>
            HUD System Online. Ready for action.
          </Text>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 'clamp(8px, 1.5vw, 12px)', alignItems: 'center', flexWrap: 'wrap' }}>
        <Badge 
          count={12}
          style={{ 
            background: 'linear-gradient(135deg, #ff007f, #00e5ff)',
            boxShadow: '0 0 15px rgba(255, 0, 127, 0.5)'
          }} 
        >
          <BellOutlined style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: isDark ? '#fff' : '#1a1a2e' }} />
        </Badge>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />}
          style={{
            borderRadius: 12,
            background: 'linear-gradient(135deg, #ff007f, #b300ff)',
            border: 'none',
            boxShadow: '0 0 20px rgba(255, 0, 127, 0.4)',
            padding: 'clamp(4px, 0.8vw, 8px) clamp(12px, 2vw, 20px)',
            fontSize: 'clamp(12px, 1.2vw, 14px)',
            height: 'auto'
          }}
        >
          {!isMobile && 'Sync'}
        </Button>
        <Avatar 
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
          size={isMobile ? 32 : 40}
          style={{ 
            border: '2px solid rgba(255, 0, 127, 0.5)', 
            boxShadow: '0 0 15px rgba(255, 0, 127, 0.2)',
            flexShrink: 0
          }}
        />
      </div>
    </div>
  );
});

// ============ RESPONSIVE REVENUE CHART ============
const RevenueChartCard = memo(({ revenueData, isDark }) => {
  const chartData = useMemo(() => {
    if (!revenueData || revenueData.length === 0) return [];
    return revenueData;
  }, [revenueData]);

  const totalBalance = useMemo(() => {
    return chartData.reduce((sum, item) => sum + (item.value || 0), 0);
  }, [chartData]);

  const textColor = isDark ? '#e0e7ff' : '#1a1a2e';
  const mutedColor = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
  const tooltipBg = isDark ? 'rgba(8, 6, 16, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 'clamp(8px, 1.5vw, 12px)',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <Text style={{ color: textColor, fontSize: 'clamp(12px, 1.4vw, 14px)', fontWeight: 600, letterSpacing: '1px' }}>
          {isMobile ? '/// REVENUE' : '/// REVENUE OVERVIEW'}
        </Text>
        <div style={{ 
          background: isDark ? 'rgba(255,0,127,0.1)' : 'rgba(0,0,0,0.02)', 
          padding: '2px clamp(8px, 1vw, 12px)', 
          borderRadius: 12,
          border: '1px solid rgba(255,0,127,0.3)',
          boxShadow: isDark ? '0 0 10px rgba(255,0,127,0.1)' : 'none'
        }}>
          <Text style={{ color: '#ff007f', fontSize: 'clamp(10px, 1vw, 12px)', fontWeight: 700 }}>+24.5%</Text>
        </div>
      </div>
      
      <div style={{ flex: 1, minHeight: 'clamp(140px, 25vh, 180px)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="cyberGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff007f" stopOpacity={0.8}/>
                <stop offset="30%" stopColor="#b300ff" stopOpacity={0.4}/>
                <stop offset="100%" stopColor="#00e5ff" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke={mutedColor} 
              tick={{fontSize: isMobile ? 8 : 10, fill: mutedColor}} 
              axisLine={false} 
              tickLine={false} 
              dy={10}
            />
            <YAxis 
              stroke={mutedColor} 
              tick={{fontSize: isMobile ? 8 : 10, fill: mutedColor}} 
              axisLine={false} 
              tickLine={false}
              tickFormatter={(value) => isMobile ? `$${value}k` : `$${value}k`}
              hide={isMobile}
            />
            <Tooltip 
              contentStyle={{ 
                background: tooltipBg, 
                border: '1px solid rgba(255,0,127,0.3)',
                borderRadius: 12,
                color: textColor,
                boxShadow: '0 0 20px rgba(255,0,127,0.2)',
                fontSize: isMobile ? 11 : 13,
                padding: isMobile ? '8px 12px' : '12px 16px'
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00e5ff"
              strokeWidth={isMobile ? 2 : 3}
              fill="url(#cyberGrad)"
              animationDuration={2500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ 
        marginTop: 'clamp(8px, 1.5vw, 12px)',
        padding: 'clamp(8px, 1.5vw, 12px) clamp(12px, 2vw, 16px)',
        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.5)',
        borderRadius: 12,
        display: 'flex',
        justifyContent: 'space-between',
        border: isDark ? '1px solid rgba(0,229,255,0.1)' : '1px solid rgba(59,130,246,0.1)',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div>
          <Text style={{ color: mutedColor, fontSize: 'clamp(10px, 1vw, 11px)' }}>TOTAL BALANCE</Text>
          <div style={{ color: '#00e5ff', fontSize: 'clamp(16px, 2.5vw, 18px)', fontWeight: 700, textShadow: isDark ? '0 0 10px rgba(0,229,255,0.3)' : 'none' }}>
            ${totalBalance.toFixed(1)}k
          </div>
        </div>
        <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
          <Text style={{ color: mutedColor, fontSize: 'clamp(10px, 1vw, 11px)' }}>PEAK METRIC</Text>
          <div style={{ color: textColor, fontSize: 'clamp(14px, 2vw, 14px)', fontWeight: 600 }}>
            ${Math.max(...chartData.map(d => d.value))}k
          </div>
        </div>
      </div>
    </div>
  );
});

// ============ RESPONSIVE SERVICE DISTRIBUTION ============
const ServiceDistributionChart = memo(({ serviceData, isDark }) => {
  const colors = ['#ff007f', '#00e5ff', '#b300ff', '#ff4da6', '#33ebff', '#cc33ff'];
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const data = useMemo(() => {
    if (!serviceData || serviceData.length === 0) return [];
    return serviceData.map((item, index) => ({
      ...item,
      color: colors[index % colors.length]
    }));
  }, [serviceData]);

  const textColor = isDark ? '#e0e7ff' : '#1a1a2e';
  const mutedColor = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 'clamp(12px, 2vw, 16px)',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <Text style={{ color: textColor, fontSize: 'clamp(12px, 1.4vw, 14px)', fontWeight: 600, letterSpacing: '1px' }}>
          {isMobile ? '/// SERVICES' : '/// SERVICE MATRIX'}
        </Text>
        <Badge 
          count="Active"
          style={{ 
            background: 'linear-gradient(135deg, #ff007f, #b300ff)',
            fontSize: 'clamp(8px, 0.8vw, 10px)',
            padding: '0 clamp(6px, 1vw, 10px)',
            borderRadius: 12,
            boxShadow: isDark ? '0 0 10px rgba(255,0,127,0.3)' : 'none'
          }} 
        />
      </div>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center', 
        gap: 'clamp(8px, 2vw, 16px)', 
        flex: 1 
      }}>
        <div style={{ 
          width: isMobile ? '100%' : '55%', 
          height: isMobile ? 'clamp(120px, 30vw, 160px)' : '100%',
          minHeight: isMobile ? '120px' : '140px',
          maxHeight: isMobile ? '160px' : 'none'
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={isMobile ? 25 : 45}
                outerRadius={isMobile ? 50 : 75}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke={isDark ? 'rgba(10, 8, 20, 0.8)' : 'rgba(255,255,255,0.6)'}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: isDark ? 'rgba(8, 6, 16, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(255,0,127,0.3)',
                  borderRadius: 12,
                  color: textColor,
                  fontSize: isMobile ? 11 : 13,
                  padding: isMobile ? '6px 10px' : '12px 16px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr', 
          gap: 'clamp(4px, 1vw, 8px)', 
          flex: 1,
          width: isMobile ? '100%' : 'auto'
        }}>
          {data.map((item, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: 'clamp(3px, 0.5vw, 4px) clamp(6px, 1vw, 8px)',
              borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 0.8vw, 8px)' }}>
                <div style={{ 
                  width: 'clamp(8px, 1.2vw, 10px)', 
                  height: 'clamp(8px, 1.2vw, 10px)', 
                  borderRadius: '50%', 
                  background: item.color, 
                  boxShadow: isDark ? `0 0 10px ${item.color}` : 'none' 
                }} />
                <Text style={{ color: mutedColor, fontSize: 'clamp(9px, 1vw, 11px)' }}>{isMobile && item.name.length > 8 ? item.name.substring(0, 6) + '...' : item.name}</Text>
              </div>
              <Text style={{ color: textColor, fontSize: 'clamp(11px, 1.2vw, 13px)', fontWeight: 600 }}>{item.value}%</Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// ============ RESPONSIVE BUSINESS TYPE STATS ============
const BusinessTypeStatsCard = memo(({ businessData, isDark }) => {
  const data = useMemo(() => {
    if (!businessData || businessData.length === 0) return [];
    return businessData;
  }, [businessData]);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const textColor = isDark ? '#e0e7ff' : '#1a1a2e';
  const mutedColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)';
  const colors = ['#ff007f', '#00e5ff', '#b300ff', '#ff4da6'];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 'clamp(12px, 2vw, 16px)',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <Text style={{ color: textColor, fontSize: 'clamp(12px, 1.4vw, 14px)', fontWeight: 600, letterSpacing: '1px' }}>
          {isMobile ? '/// SEGMENTS' : '/// SEGMENT DATA'}
        </Text>
        <FilterOutlined style={{ color: mutedColor, fontSize: 'clamp(14px, 1.5vw, 16px)' }} />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr', 
        gap: 'clamp(8px, 1.5vw, 12px)', 
        flex: 1 
      }}>
        {data.map((item, idx) => (
          <div key={idx} style={{ 
            background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)',
            borderRadius: 12,
            padding: 'clamp(8px, 1.5vw, 12px) clamp(10px, 1.5vw, 14px)',
            border: isDark ? `1px solid ${colors[idx % colors.length]}25` : '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: mutedColor, fontSize: 'clamp(10px, 1vw, 11px)' }}>{isMobile && item.type.length > 6 ? item.type.substring(0, 5) + '...' : item.type}</Text>
              <Text style={{ color: textColor, fontSize: 'clamp(14px, 2vw, 16px)', fontWeight: 700 }}>
                {item.count || 0}
              </Text>
            </div>
            <div style={{ marginTop: 'clamp(4px, 0.8vw, 6px)' }}>
              <Progress 
                percent={item.percentage || 0} 
                strokeColor={colors[idx % colors.length]}
                showInfo={false}
                size="small"
                trailColor={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// ============ RESPONSIVE GLOBAL PRESENCE ============
const GlobalPresenceWrapper = memo(({ isDark }) => {
  const textColor = isDark ? '#e0e7ff' : '#1a1a2e';
  const mutedColor = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 'clamp(12px, 2vw, 16px)',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <Text style={{ color: textColor, fontSize: 'clamp(12px, 1.4vw, 14px)', fontWeight: 600, letterSpacing: '1px' }}>
          <span style={{ color: '#ff007f', marginRight: 8 }}>🌍</span> {isMobile ? 'GLOBAL' : 'GLOBAL PRESENCE'}
        </Text>
        <Badge 
          count="Online"
          style={{ 
            background: 'linear-gradient(135deg, #00e5ff, #ff007f)',
            fontSize: 'clamp(8px, 0.8vw, 10px)',
            padding: '0 clamp(6px, 1vw, 12px)',
            borderRadius: 12,
            boxShadow: isDark ? '0 0 15px rgba(0,229,255,0.2)' : 'none'
          }} 
        />
      </div>
      
      <div style={{ 
        flex: 1, 
        minHeight: 'clamp(140px, 25vh, 220px)',
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        border: isDark ? '1px solid rgba(0,229,255,0.15)' : '1px solid rgba(59,130,246,0.1)',
        background: isDark ? 'rgba(10, 8, 20, 0.4)' : 'rgba(240,240,255,0.5)'
      }}>
        <WorldMap />
      </div>

      <div style={{ 
        marginTop: 'clamp(8px, 1.5vw, 12px)',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 4px',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div>
          <Text style={{ color: mutedColor, fontSize: 'clamp(9px, 1vw, 11px)' }}>ACTIVE REGIONS</Text>
          <div style={{ color: textColor, fontSize: 'clamp(14px, 2vw, 16px)', fontWeight: 700 }}>
            <CountUp end={42} /> {!isMobile && 'Countries'}
          </div>
        </div>
        <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
          <Text style={{ color: mutedColor, fontSize: 'clamp(9px, 1vw, 11px)' }}>LIVE USERS</Text>
          <div style={{ color: '#00e5ff', fontSize: 'clamp(14px, 2vw, 16px)', fontWeight: 700, textShadow: isDark ? '0 0 10px rgba(0,229,255,0.2)' : 'none' }}>
            <CountUp end={2.4} />k
          </div>
        </div>
      </div>
    </div>
  );
});

// ============ MAIN DASHBOARD COMPONENT ============
const Dashboard = () => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [stats, setStats] = useState({
    clients: { total: 0, active: 0, pending: 0, cancelled: 0, leads: 0 },
    financial: { totalIncome: 0, monthlyIncome: 0, annualIncome: 0 },
    projects: { active: 0, completed: 0, pending: 0 },
    operations: { openTickets: 0, closedTickets: 0, upcomingRenewals: 0, recentPayments: 0 },
  });
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dashboardApi.getStats();
        setStats(response.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleMouseEnter = useCallback((id) => setHoveredCard(id), []);
  const handleMouseLeave = useCallback(() => setHoveredCard(null), []);

  const statsData = useMemo(() => [
    { label: 'Total Clients', value: stats.clients.total || 0, icon: UserOutlined },
    { label: 'Active Clients', value: stats.clients.active || 0, icon: TeamOutlined },
    { label: 'Leads', value: stats.clients.leads || 0, icon: FlagOutlined },
    { label: 'Revenue', value: stats.financial.totalIncome || 0, icon: DollarOutlined, prefix: '$' },
    { label: 'Active Projects', value: stats.projects.active || 0, icon: AppstoreOutlined },
    { label: 'Open Tickets', value: stats.operations.openTickets || 0, icon: ExclamationCircleOutlined }
  ], [stats]);

  const mockRevenueData = [
    { month: 'Jan', value: 4.5 },
    { month: 'Feb', value: 5.2 },
    { month: 'Mar', value: 4.8 },
    { month: 'Apr', value: 7.1 },
    { month: 'May', value: 8.2 },
    { month: 'Jun', value: 9.8 }
  ];

  const mockServiceData = [
    { name: 'Web Dev', value: 25 },
    { name: 'Mobile', value: 20 },
    { name: 'Cloud', value: 18 },
    { name: 'AI/ML', value: 22 },
    { name: 'Support', value: 15 }
  ];

  const mockBusinessData = [
    { type: 'Startup', count: 28, percentage: 45 },
    { type: 'SME', count: 18, percentage: 30 },
    { type: 'Enterprise', count: 10, percentage: 15 },
    { type: 'Agency', count: 6, percentage: 10 }
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: 'clamp(12px, 3vw, 24px) clamp(12px, 4vw, 32px)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      background: 'transparent',
      width: '100%',
      overflowX: 'hidden'
    }}>
      
      {/* Cyberpunk Background Glows - Hidden on Mobile for Performance */}
      {!isMobile && (
        <>
          <div style={{
            position: 'fixed',
            top: '10%',
            left: '-10%',
            width: '40vw',
            height: '40vw',
            background: 'radial-gradient(circle, rgba(255, 0, 127, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 0
          }} />
          <div style={{
            position: 'fixed',
            bottom: '10%',
            right: '-10%',
            width: '30vw',
            height: '30vw',
            background: 'radial-gradient(circle, rgba(0, 229, 255, 0.06) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 0
          }} />
        </>
      )}

      <div style={{ 
        width: '100%', 
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex', 
        flexDirection: 'column', 
        gap: 'clamp(16px, 3vw, 24px)', 
        position: 'relative', 
        zIndex: 1 
      }}>
        <WelcomeHeader 
          isDark={isDark} 
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          mobileMenuOpen={mobileMenuOpen}
        />

        {/* Stats Grid - Responsive */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile 
            ? 'repeat(2, 1fr)' 
            : 'repeat(3, 1fr)',
          gap: 'clamp(10px, 1.5vw, 16px)',
          width: '100%'
        }}>
          {statsData.map((stat, i) => (
            <StatCard key={i} stat={stat} isDark={isDark} colorIndex={i} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
          gap: 'clamp(16px, 2.5vw, 20px)',
          width: '100%'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.5vw, 20px)' }}>
            <CardWrapper id="revenue" isHovered={hoveredCard} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} isDark={isDark} colorIndex={0}>
              <RevenueChartCard revenueData={mockRevenueData} isDark={isDark} />
            </CardWrapper>
            <CardWrapper id="business" isHovered={hoveredCard} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} isDark={isDark} colorIndex={1}>
              <BusinessTypeStatsCard businessData={mockBusinessData} isDark={isDark} />
            </CardWrapper>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.5vw, 20px)' }}>
            <CardWrapper id="service" isHovered={hoveredCard} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} isDark={isDark} colorIndex={2}>
              <ServiceDistributionChart serviceData={mockServiceData} isDark={isDark} />
            </CardWrapper>
            <CardWrapper id="global" isHovered={hoveredCard} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} isDark={isDark} colorIndex={3}>
              <GlobalPresenceWrapper isDark={isDark} />
            </CardWrapper>
          </div>
        </div>

        <style>{`
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
          
          /* Mobile Responsive Adjustments */
          @media (max-width: 640px) {
            .ant-badge-count {
              font-size: 10px !important;
              min-width: 16px !important;
              height: 16px !important;
              line-height: 16px !important;
              padding: 0 4px !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Dashboard;