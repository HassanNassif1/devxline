import React, { useState, useEffect, useRef } from "react";

const InteractiveDashboard = ({ type, data }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [notification, setNotification] = useState(null);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [testCount, setTestCount] = useState(0);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState([]);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const isMountedRef = useRef(true);
  const canvasInitialized = useRef(false);
  const storageKey = `dashboard_${type}`;

  // Form state
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    service: "",
    date: "",
    time: "",
    message: "",
    guests: 1,
    status: "pending"
  });

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(false);

    const savedData = localStorage.getItem(storageKey);

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setDashboardData(parsed.dashboardData || []);
        setStats(parsed.stats || []);
        setTestResults(parsed.testResults || []);
        setTestCount(parsed.testCount || 0);
        setChartData(
          parsed.chartData?.length
            ? parsed.chartData
            : generateChartData()
        );
      } catch (error) {
        console.error("Failed to restore saved data:", error);
        loadDefaultData();
      }
    } else {
      loadDefaultData();
    }

    setIsInitialized(true);
  }, [storageKey]);

  // Save AFTER the useEffect above has rendered/restored the data
  useEffect(() => {
    if (!isInitialized) return;

    localStorage.setItem(
      storageKey,
      JSON.stringify({
        dashboardData,
        stats,
        testResults,
        testCount,
        chartData,
        lastUpdated: new Date().toISOString(),
      })
    );
  }, [
    isInitialized,
    storageKey,
    dashboardData,
    stats,
    testResults,
    testCount,
    chartData,
  ]);

  const loadDefaultData = () => {
    const initialData = getInitialData(type);
    setDashboardData(initialData.items);
    setStats(initialData.stats);
    setTestResults([]);
    setTestCount(0);
    const newChartData = generateChartData();
    setChartData(newChartData);
    
    localStorage.setItem(storageKey, JSON.stringify({
      dashboardData: initialData.items,
      stats: initialData.stats,
      testResults: [],
      testCount: 0,
      chartData: newChartData,
      lastUpdated: new Date().toISOString()
    }));
  };

  // Generate chart data
  const generateChartData = () => {
    const data = [];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 0; i < 12; i++) {
      data.push({
        label: labels[i],
        value: Math.floor(Math.random() * 80 + 20),
        growth: Math.floor(Math.random() * 40 + 10)
      });
    }
    return data;
  };

  // Auto-hide notification
  useEffect(() => {
    if (notificationVisible) {
      const timer = setTimeout(() => {
        setNotificationVisible(false);
        setTimeout(() => setNotification(null), 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notificationVisible]);

  // Initialize canvas for wave animation
  useEffect(() => {
    if (!canvasRef.current || canvasInitialized.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;
      
      const width = parent.clientWidth || 800;
      const height = 200;
      
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
    };
    
    resizeCanvas();
    canvasInitialized.current = true;

    let time = 0;

    const drawWave = () => {
      if (!canvas) {
        animationRef.current = requestAnimationFrame(drawWave);
        return;
      }
      
      const width = canvas.width;
      const height = canvas.height;
      
      if (width === 0 || height === 0) {
        animationRef.current = requestAnimationFrame(drawWave);
        return;
      }
      
      ctx.clearRect(0, 0, width, height);
      
      // Background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, 'rgba(99,102,241,0.03)');
      bgGradient.addColorStop(0.5, 'rgba(139,92,246,0.03)');
      bgGradient.addColorStop(1, 'rgba(99,102,241,0.03)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      for (let i = 0; i < height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }
      for (let i = 0; i < width; i += 60) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }

      // Wave parameters - multiple waves for beautiful effect
      const waves = [
        { amplitude: 30, frequency: 0.025, speed: 0.015, color: 'rgba(99, 102, 241, 0.5)', offset: 0, yOffset: height * 0.5 },
        { amplitude: 25, frequency: 0.035, speed: -0.02, color: 'rgba(139, 92, 246, 0.35)', offset: 15, yOffset: height * 0.5 },
        { amplitude: 20, frequency: 0.045, speed: 0.025, color: 'rgba(96, 165, 250, 0.25)', offset: 30, yOffset: height * 0.5 },
        { amplitude: 35, frequency: 0.018, speed: -0.01, color: 'rgba(116, 92, 255, 0.15)', offset: 45, yOffset: height * 0.5 },
      ];

      waves.forEach((wave) => {
        // Fill wave area
        ctx.beginPath();
        ctx.moveTo(0, wave.yOffset);
        for (let x = 0; x <= width; x++) {
          const y = wave.yOffset + 
            Math.sin(x * wave.frequency + time * wave.speed + wave.offset) * wave.amplitude +
            Math.sin(x * wave.frequency * 0.5 + time * wave.speed * 0.7 + wave.offset) * (wave.amplitude * 0.4);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = wave.color;
        ctx.fill();
        
        // Glowing line
        ctx.beginPath();
        ctx.moveTo(0, wave.yOffset + Math.sin(time * wave.speed + wave.offset) * wave.amplitude);
        for (let x = 0; x <= width; x++) {
          const y = wave.yOffset + 
            Math.sin(x * wave.frequency + time * wave.speed + wave.offset) * wave.amplitude +
            Math.sin(x * wave.frequency * 0.5 + time * wave.speed * 0.7 + wave.offset) * (wave.amplitude * 0.4);
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = wave.color;
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Glowing dots along the wave
      const dotWave = waves[0];
      for (let i = 0; i < width; i += 35) {
        const x = i;
        const y = dotWave.yOffset + 
          Math.sin(x * dotWave.frequency + time * dotWave.speed + dotWave.offset) * dotWave.amplitude +
          Math.sin(x * dotWave.frequency * 0.5 + time * dotWave.speed * 0.7 + dotWave.offset) * (dotWave.amplitude * 0.4);
        
        // Glow
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 10);
        glow.addColorStop(0, 'rgba(99, 102, 241, 0.6)');
        glow.addColorStop(1, 'rgba(99, 102, 241, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Dot
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner dot
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Status indicator line at bottom
      const statusY = height - 8;
      ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
      ctx.fillRect(0, statusY, width, 2);
      
      // Moving status indicator
      const statusX = (Math.sin(time * 0.3) * 0.5 + 0.5) * width;
      const statusGlow = ctx.createRadialGradient(statusX, statusY, 0, statusX, statusY, 15);
      statusGlow.addColorStop(0, 'rgba(99, 102, 241, 0.6)');
      statusGlow.addColorStop(1, 'rgba(99, 102, 241, 0)');
      ctx.fillStyle = statusGlow;
      ctx.beginPath();
      ctx.arc(statusX, statusY, 15, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = 'rgba(99, 102, 241, 0.9)';
      ctx.beginPath();
      ctx.arc(statusX, statusY, 4, 0, Math.PI * 2);
      ctx.fill();

      time += 0.015;
      timeRef.current = time;
      animationRef.current = requestAnimationFrame(drawWave);
    };

    drawWave();

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      canvasInitialized.current = false;
    };
  }, []);

  const getInitialData = (type) => {
    const dataMap = {
      restaurant: {
        items: [
          { id: 1, time: "06:30 PM", name: "John Smith", detail: "Table 4 • 4 guests", status: "Seated", color: "green" },
          { id: 2, time: "07:15 PM", name: "Maria Garcia", detail: "Table 8 • 2 guests", status: "Confirmed", color: "blue" },
          { id: 3, time: "08:00 PM", name: "David Kim", detail: "Table 12 • 6 guests", status: "Pending", color: "orange" },
          { id: 4, time: "08:45 PM", name: "Sarah Johnson", detail: "Table 6 • 2 guests", status: "Confirmed", color: "pink" },
        ],
        stats: [
          { label: "Today's Reservations", value: "48", change: "+12.5%", color: "purple" },
          { label: "Table Turnover", value: "2.8x", change: "+28%", color: "blue" },
          { label: "Revenue", value: "$18,450", change: "+22.4%", color: "green" },
          { label: "Avg. Rating", value: "4.9 ★", change: "+0.3", color: "orange" },
        ]
      },
      healthcare: {
        items: [
          { id: 1, time: "08:30 AM", name: "Robert Wilson", detail: "Cardiology Consultation", status: "Check In", color: "green" },
          { id: 2, time: "09:45 AM", name: "Emily Thompson", detail: "Routine Check-up", status: "Confirmed", color: "blue" },
          { id: 3, time: "11:00 AM", name: "David Chen", detail: "Lab Results Review", status: "Pending", color: "orange" },
          { id: 4, time: "02:15 PM", name: "Sarah Johnson", detail: "Physical Therapy", status: "Confirmed", color: "pink" },
        ],
        stats: [
          { label: "Total Patients", value: "12,847", change: "+8.2%", color: "purple" },
          { label: "Today's Appointments", value: "156", change: "+12.5%", color: "blue" },
          { label: "Avg. Wait Time", value: "12 min", change: "-35%", color: "green" },
          { label: "Staff Satisfaction", value: "78%", change: "+8.3%", color: "orange" },
        ]
      },
      ecommerce: {
        items: [
          { id: 1, time: "💡", name: "Smart Pricing", detail: "Dynamic pricing increased revenue by 18%", status: "Active", color: "green" },
          { id: 2, time: "🎯", name: "Recommendations", detail: "AI-powered upsell boosting AOV by 12.5%", status: "Active", color: "blue" },
          { id: 3, time: "📊", name: "Customer Segments", detail: "3 new high-value segments identified", status: "New", color: "orange" },
          { id: 4, time: "⚡", name: "Growth Opportunity", detail: "Mobile optimization could add +22% revenue", status: "Opportunity", color: "pink" },
        ],
        stats: [
          { label: "Revenue", value: "$284,590", change: "+18.4%", color: "purple" },
          { label: "Conversion Rate", value: "4.82%", change: "+1.3%", color: "blue" },
          { label: "Avg. Order Value", value: "$187", change: "+12.5%", color: "green" },
          { label: "Cart Abandonment", value: "32.4%", change: "-4.1%", color: "orange" },
        ]
      },
      booking: {
        items: [
          { id: 1, time: "09:00 AM", name: "Sarah Johnson", detail: "Hair Styling", status: "Confirmed", color: "green" },
          { id: 2, time: "10:30 AM", name: "Michael Chen", detail: "Consultation", status: "Pending", color: "orange" },
          { id: 3, time: "12:00 PM", name: "Emma Wilson", detail: "Massage Therapy", status: "Confirmed", color: "blue" },
          { id: 4, time: "02:30 PM", name: "James Rodriguez", detail: "Facial Treatment", status: "Completed", color: "pink" },
        ],
        stats: [
          { label: "Total Bookings", value: "1,284", change: "+12.5%", color: "purple" },
          { label: "Today's Appointments", value: "48", change: "+8.2%", color: "blue" },
          { label: "Revenue", value: "$24,890", change: "+18.4%", color: "green" },
          { label: "Avg. Rating", value: "4.8 ★", change: "+0.3", color: "orange" },
        ]
      },
      realestate: {
        items: [
          { id: 1, time: "⭐", name: "Modern Penthouse", detail: "$2.4M • 3BR • 2BA", status: "Hot", color: "green" },
          { id: 2, time: "🏡", name: "Luxury Villa", detail: "$3.8M • 5BR • 4BA", status: "Premium", color: "blue" },
          { id: 3, time: "📍", name: "Downtown Loft", detail: "$1.2M • 2BR • 1BA", status: "New", color: "orange" },
          { id: 4, time: "🌊", name: "Beachfront Estate", detail: "$5.6M • 6BR • 5BA", status: "Luxury", color: "pink" },
        ],
        stats: [
          { label: "Active Listings", value: "342", change: "+12.5%", color: "purple" },
          { label: "Property Views", value: "28.4K", change: "+320%", color: "blue" },
          { label: "Qualified Leads", value: "86", change: "+156%", color: "green" },
          { label: "Avg. Time on Site", value: "8.5 min", change: "+3.2x", color: "orange" },
        ]
      },
      logistics: {
        items: [
          { id: 1, time: "🚚", name: "Delivery #1284", detail: "Downtown • 2.3mi • ETA 8min", status: "En Route", color: "green" },
          { id: 2, time: "🚚", name: "Delivery #1283", detail: "Airport • 5.1mi • ETA 15min", status: "En Route", color: "blue" },
          { id: 3, time: "📦", name: "Delivery #1282", detail: "Suburbs • 8.7mi • ETA 22min", status: "Pending", color: "orange" },
          { id: 4, time: "✅", name: "Delivery #1281", detail: "Northside • Completed", status: "Delivered", color: "pink" },
        ],
        stats: [
          { label: "Active Deliveries", value: "1,284", change: "+12.5%", color: "purple" },
          { label: "On-Time Rate", value: "94.2%", change: "+5.8%", color: "blue" },
          { label: "Avg. Delivery Time", value: "24 min", change: "-32%", color: "green" },
          { label: "Fleet Utilization", value: "87%", change: "+12%", color: "orange" },
        ]
      }
    };
    return dataMap[type] || dataMap.booking;
  };

  const showNotification = (title, description, icon = "🎉", color = "violet") => {
    setNotification({ title, description, icon, color });
    setNotificationVisible(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const addItem = (e) => {
    e.preventDefault();
    const newItem = {
      id: Date.now(),
      ...formState,
      detail: formState.service || "New booking",
      status: "Pending",
      color: ["green", "blue", "orange", "pink", "purple"][Math.floor(Math.random() * 5)]
    };
    setDashboardData(prev => [newItem, ...prev]);
    setTestResults(prev => [{
      id: Date.now(),
      ...formState,
      timestamp: new Date().toLocaleString(),
      status: "success",
      action: "Added"
    }, ...prev]);
    setTestCount(prev => prev + 1);
    setShowAddForm(false);
    setFormState({
      name: "",
      email: "",
      service: "",
      date: "",
      time: "",
      message: "",
      guests: 1,
      status: "pending"
    });
    showNotification(
      "✅ Added Successfully!",
      `${newItem.name} has been added to the dashboard`,
      "🎉",
      "green"
    );
    updateStats();
  };

  const deleteItem = (id) => {
    const item = dashboardData.find(i => i.id === id);
    setDashboardData(prev => prev.filter(i => i.id !== id));
    showNotification(
      "🗑️ Item Removed",
      `${item.name} has been deleted from the dashboard`,
      "🧹",
      "orange"
    );
    updateStats();
  };

  const editItem = (id) => {
    const item = dashboardData.find(i => i.id === id);
    setEditingItem(item);
    setFormState({
      name: item.name,
      email: item.email || "",
      service: item.detail || "",
      date: item.date || "",
      time: item.time || "",
      message: item.message || "",
      guests: item.guests || 1,
      status: item.status || "pending"
    });
  };

  const updateItem = (e) => {
    e.preventDefault();
    setDashboardData(prev => prev.map(item => 
      item.id === editingItem.id 
        ? { 
            ...item, 
            name: formState.name,
            detail: formState.service || item.detail,
            time: formState.time || item.time,
            status: formState.status || item.status,
            email: formState.email,
            date: formState.date,
            message: formState.message,
            guests: formState.guests
          }
        : item
    ));
    setEditingItem(null);
    setFormState({
      name: "",
      email: "",
      service: "",
      date: "",
      time: "",
      message: "",
      guests: 1,
      status: "pending"
    });
    showNotification(
      "✏️ Updated Successfully!",
      "The item has been updated",
      "✅",
      "blue"
    );
    updateStats();
  };

  const updateStats = () => {
    const total = dashboardData.length;
    const confirmed = dashboardData.filter(i => i.status === "Confirmed" || i.status === "Seated" || i.status === "En Route").length;
    const pending = dashboardData.filter(i => i.status === "Pending" || i.status === "New").length;
    
    setStats(prev => prev.map((stat, index) => {
      if (index === 0) return { ...stat, value: total.toString() };
      if (index === 1) return { ...stat, value: confirmed.toString() };
      if (index === 2) return { ...stat, value: `${Math.round((confirmed / (total || 1)) * 100)}%` };
      return stat;
    }));
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.removeItem(storageKey);
      loadDefaultData();
      showNotification(
        "🗑️ Data Reset",
        "All data has been reset to default",
        "🔄",
        "orange"
      );
    }
  };

  const getStatusClass = (status) => {
    const statusMap = {
      "Seated": "confirmed",
      "Confirmed": "confirmed",
      "Pending": "pending",
      "Completed": "completed",
      "Delivered": "completed",
      "En Route": "confirmed",
      "Check In": "confirmed",
      "Hot": "confirmed",
      "Premium": "confirmed",
      "New": "pending",
      "Luxury": "confirmed",
      "Active": "confirmed",
      "Opportunity": "pending"
    };
    return statusMap[status] || "pending";
  };

  const getColorClass = (color) => {
    const colors = {
      purple: "stat-purple",
      blue: "stat-blue",
      green: "stat-green",
      orange: "stat-orange",
      pink: "stat-pink",
      teal: "stat-teal",
      indigo: "stat-indigo"
    };
    return colors[color] || "stat-purple";
  };

  return (
    <div className={`interactive-dashboard ${animating ? 'dashboard-animating' : ''}`}>
      {/* Notification */}
      {notification && (
        <div className={`notification-container ${notificationVisible ? 'notification-visible' : 'notification-hidden'}`}>
          <div className={`notification-content notification-${notification.color}`}>
            <div className="notification-glow"></div>
            <div className="notification-icon">{notification.icon}</div>
            <div className="notification-text">
              <h4>{notification.title}</h4>
              <p>{notification.description}</p>
            </div>
            <button 
              className="notification-close"
              onClick={() => {
                setNotificationVisible(false);
                setTimeout(() => setNotification(null), 300);
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📈 Analytics
        </button>
        <button 
          className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          📝 Manage
        </button>
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📋 History
        </button>
        <button 
          className="tab-btn tab-btn-demo"
          onClick={() => {
            showNotification(
              "🚀 Dashboard Active!",
              "All data is saved automatically to your browser",
              "💾",
              "green"
            );
          }}
        >
          💾 Auto-Save
        </button>
        <button 
          className="tab-btn tab-btn-clear"
          onClick={clearAllData}
        >
          🗑️ Reset Data
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <>
          {/* Stats */}
          <div className="dashboard-stats interactive-stats">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`dashboard-stat ${getColorClass(stat.color)} interactive-stat`}
              >
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value">{stat.value}</span>
                <span className={`stat-change ${stat.change && stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                  {stat.change || '+0%'}
                </span>
              </div>
            ))}
          </div>

          {/* Wave Chart */}
     

          <div className="dashboard-main interactive-main">
            <div className="dashboard-calendar">
              <div className="dashboard-section-title">
                <span>📋 Recent Activity</span>
                <button className="dashboard-view-all" onClick={() => setActiveTab('manage')}>
                  Manage →
                </button>
              </div>
              <div className="booking-list interactive-list">
                {dashboardData.slice(0, 5).map((item) => (
                  <div 
                    key={item.id}
                    className={`booking-item interactive-item`}
                    style={{ borderLeft: `3px solid var(--${item.color})` }}
                  >
                    <div className="booking-time">{item.time}</div>
                    <div className="booking-info">
                      <span className="booking-name">{item.name}</span>
                      <span className="booking-service">{item.detail}</span>
                    </div>
                    <span className={`booking-status ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
                {dashboardData.length === 0 && (
                  <div className="empty-state">
                    <span>📭</span>
                    <p>No data yet. Go to Manage tab to add your first entry!</p>
                  </div>
                )}
              </div>
            </div>

            <div className="dashboard-insights">
              <div className="dashboard-section-title">
                <span>📊 Quick Stats</span>
              </div>
              <div className="insight-stats interactive-insights" style={{ gridTemplateColumns: '1fr' }}>
                <div className="insight-stat stat-purple">
                  <span className="insight-label">Total Entries</span>
                  <span className="insight-value">{dashboardData.length}</span>
                </div>
                <div className="insight-stat stat-green">
                  <span className="insight-label">Confirmed</span>
                  <span className="insight-value">
                    {dashboardData.filter(i => i.status === "Confirmed" || i.status === "Seated").length}
                  </span>
                </div>
                <div className="insight-stat stat-orange">
                  <span className="insight-label">Pending</span>
                  <span className="insight-value">
                    {dashboardData.filter(i => i.status === "Pending" || i.status === "New").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="analytics-container">
          <div className="analytics-header">
            <h3>📈 Advanced Analytics</h3>
            <p>Real-time insights and performance metrics</p>
          </div>

          {/* Wave Chart - Same canvas */}
        
          {/* Chart Grid */}
          <div className="chart-grid">
            {/* Bar Chart */}
            <div className="chart-card">
              <h4>📊 Monthly Performance</h4>
              <div className="bar-chart-container">
                {chartData.map((item, index) => (
                  <div key={index} className="bar-chart-item">
                    <div 
                      className="bar-chart-bar"
                      style={{ 
                        height: `${item.value}%`,
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      <span className="bar-value-label">{item.value}%</span>
                    </div>
                    <span className="bar-label">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <span>📈 Growth trend: {chartData.reduce((acc, curr) => acc + curr.growth, 0) / chartData.length}% average</span>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="chart-card">
              <h4>🎯 Status Distribution</h4>
              <div className="donut-chart">
                <div className="donut-container">
                  {['Confirmed', 'Pending', 'Completed', 'Seated'].map((status, index) => {
                    const count = dashboardData.filter(i => i.status === status).length;
                    const percentage = dashboardData.length > 0 ? (count / dashboardData.length) * 360 : 0;
                    const colors = ['#10b981', '#f59e0b', '#6366f1', '#06b6d4'];
                    if (count === 0) return null;
                    return (
                      <div 
                        key={status}
                        className="donut-segment"
                        style={{
                          transform: `rotate(${index * 90}deg)`,
                          background: `conic-gradient(${colors[index]} 0% ${percentage}%, transparent ${percentage}% 100%)`
                        }}
                      >
                        <span className="donut-label">{status}</span>
                        <span className="donut-value">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="chart-legend">
                {['Confirmed', 'Pending', 'Completed', 'Seated'].map((status, index) => {
                  const count = dashboardData.filter(i => i.status === status).length;
                  const colors = ['#10b981', '#f59e0b', '#6366f1', '#06b6d4'];
                  if (count === 0) return null;
                  return (
                    <span key={status} className="legend-item">
                      <span className="legend-dot" style={{ background: colors[index] }}></span>
                      {status}: {count}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Growth Chart */}
            <div className="chart-card">
              <h4>📈 Growth Metrics</h4>
              <div className="growth-chart">
                {chartData.slice(0, 6).map((item, index) => (
                  <div key={index} className="growth-item">
                    <span className="growth-label">{item.label}</span>
                    <div className="growth-bar-container">
                      <div 
                        className="growth-bar"
                        style={{ 
                          width: `${item.growth}%`,
                          animationDelay: `${index * 0.15}s`
                        }}
                      >
                        <span className="growth-value">+{item.growth}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Analytics Stats */}
          <div className="analytics-stats-grid">
            <div className="analytics-stat-card">
              <span className="analytics-stat-icon">📊</span>
              <div>
                <span className="analytics-stat-label">Total Data Points</span>
                <span className="analytics-stat-value">{dashboardData.length * 5}</span>
              </div>
            </div>
            <div className="analytics-stat-card">
              <span className="analytics-stat-icon">⚡</span>
              <div>
                <span className="analytics-stat-label">Active Users</span>
                <span className="analytics-stat-value">{dashboardData.length}</span>
              </div>
            </div>
            <div className="analytics-stat-card">
              <span className="analytics-stat-icon">📈</span>
              <div>
                <span className="analytics-stat-label">Growth Rate</span>
                <span className="analytics-stat-value">
                  {dashboardData.length > 0 ? Math.round((dashboardData.filter(i => i.status === "Confirmed").length / dashboardData.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MANAGE TAB */}
      {activeTab === 'manage' && (
        <div className="manage-container">
          <div className="manage-header">
            <h3>📝 Manage Your Data</h3>
            <p>Add, edit, or delete items from your dashboard</p>
            <div className="manage-actions">
              <button className="add-item-btn" onClick={() => setShowAddForm(true)}>
                ➕ Add New Item
              </button>
              <button className="clear-data-btn" onClick={clearAllData}>
                🗑️ Reset All
              </button>
            </div>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="form-overlay">
              <div className="form-card">
                <div className="form-card-header">
                  <h4>➕ Add New Entry</h4>
                  <button className="form-close-btn" onClick={() => setShowAddForm(false)}>✕</button>
                </div>
                <form onSubmit={addItem} className="test-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formState.name}
                        onChange={handleFormChange}
                        placeholder="Enter name..."
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formState.email}
                        onChange={handleFormChange}
                        placeholder="Enter email..."
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Service/Detail *</label>
                      <input
                        type="text"
                        name="service"
                        value={formState.service}
                        onChange={handleFormChange}
                        placeholder="Enter service or detail..."
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Time</label>
                      <input
                        type="text"
                        name="time"
                        value={formState.time}
                        onChange={handleFormChange}
                        placeholder="e.g. 02:30 PM"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        name="date"
                        value={formState.date}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Guests</label>
                      <input
                        type="number"
                        name="guests"
                        value={formState.guests}
                        onChange={handleFormChange}
                        min="1"
                        max="20"
                      />
                    </div>
                  </div>
                  <div className="form-group full-width">
                    <label>Message / Notes</label>
                    <textarea
                      name="message"
                      value={formState.message}
                      onChange={handleFormChange}
                      placeholder="Enter any notes..."
                      rows="2"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="test-submit-btn">✅ Add Item</button>
                    <button type="button" className="test-reset-btn" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Form */}
          {editingItem && (
            <div className="form-overlay">
              <div className="form-card">
                <div className="form-card-header">
                  <h4>✏️ Edit Entry</h4>
                  <button className="form-close-btn" onClick={() => setEditingItem(null)}>✕</button>
                </div>
                <form onSubmit={updateItem} className="test-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formState.name}
                        onChange={handleFormChange}
                        placeholder="Enter name..."
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formState.email}
                        onChange={handleFormChange}
                        placeholder="Enter email..."
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Service/Detail</label>
                      <input
                        type="text"
                        name="service"
                        value={formState.service}
                        onChange={handleFormChange}
                        placeholder="Enter service or detail..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        name="status"
                        value={formState.status}
                        onChange={handleFormChange}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Time</label>
                      <input
                        type="text"
                        name="time"
                        value={formState.time}
                        onChange={handleFormChange}
                        placeholder="e.g. 02:30 PM"
                      />
                    </div>
                    <div className="form-group">
                      <label>Guests</label>
                      <input
                        type="number"
                        name="guests"
                        value={formState.guests}
                        onChange={handleFormChange}
                        min="1"
                        max="20"
                      />
                    </div>
                  </div>
                  <div className="form-group full-width">
                    <label>Message / Notes</label>
                    <textarea
                      name="message"
                      value={formState.message}
                      onChange={handleFormChange}
                      placeholder="Enter any notes..."
                      rows="2"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="test-submit-btn">💾 Update Item</button>
                    <button type="button" className="test-reset-btn" onClick={() => setEditingItem(null)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Data List */}
          <div className="data-list">
            {dashboardData.map((item) => (
              <div key={item.id} className="data-item">
                <div className="data-item-content">
                  <div className="data-item-left">
                    <span className="data-item-time">{item.time}</span>
                    <div className="data-item-info">
                      <span className="data-item-name">{item.name}</span>
                      <span className="data-item-detail">{item.detail}</span>
                    </div>
                  </div>
                  <div className="data-item-right">
                    <span className={`booking-status ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                    <div className="data-item-actions">
                      <button className="data-edit-btn" onClick={() => editItem(item.id)}>✏️</button>
                      <button className="data-delete-btn" onClick={() => deleteItem(item.id)}>🗑️</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {dashboardData.length === 0 && (
              <div className="empty-state">
                <span>📭</span>
                <h4>No Data Yet</h4>
                <p>Click "Add New Item" to start building your dashboard</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="results-container">
          <div className="results-header">
            <h3>📋 Activity History</h3>
            <p>All your actions and changes</p>
            <span className="results-count">{testResults.length} actions</span>
          </div>

          {testResults.length === 0 ? (
            <div className="empty-results">
              <span className="empty-icon">📭</span>
              <h4>No Activity Yet</h4>
              <p>Start adding data from the Manage tab to see your history here</p>
            </div>
          ) : (
            <div className="results-list">
              {testResults.map((result, index) => (
                <div key={result.id} className={`result-item ${result.status === 'success' ? 'result-success' : 'result-failed'}`}>
                  <div className="result-header">
                    <span className="result-id">#{index + 1}</span>
                    <span className={`result-status ${result.status}`}>
                      {result.action || 'Added'}
                    </span>
                    <span className="result-time">{result.timestamp}</span>
                  </div>
                  <div className="result-body">
                    <div className="result-detail">
                      <span className="result-label">Name:</span>
                      <span className="result-value">{result.name || 'N/A'}</span>
                    </div>
                    <div className="result-detail">
                      <span className="result-label">Service:</span>
                      <span className="result-value">{result.service || result.detail || 'N/A'}</span>
                    </div>
                    <div className="result-detail">
                      <span className="result-label">Email:</span>
                      <span className="result-value">{result.email || 'N/A'}</span>
                    </div>
                    <div className="result-detail">
                      <span className="result-label">Status:</span>
                      <span className="result-value">{result.status || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Demo Note */}
      <div className="demo-note">
        <div className="demo-note-content">
          <span className="demo-note-icon">💡</span>
          <div>
            <h4>Interactive Demo 💾 Auto-Saved</h4>
            <p>
              This is a small demonstration dashboard to showcase the platform's capabilities. 
              All data is automatically saved to your browser's local storage and will persist 
              even after refreshing the page. Feel free to add, edit, and delete entries to 
              explore the full functionality.
            </p>
          </div>
        </div>
      </div>

      {/* Demo CTA */}
      <div className="demo-cta">
        <button 
          className="demo-cta-btn"
          onClick={() => {
            showNotification(
              "💾 Data Auto-Saved!",
              "All your changes are saved automatically to your browser",
              "💾",
              "green"
            );
          }}
        >
          👆 Click Anywhere to Interact | 💾 Auto-Save Enabled
        </button>
      </div>
    </div>
  );
};

export default InteractiveDashboard;