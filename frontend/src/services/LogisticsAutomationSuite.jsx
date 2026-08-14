import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectPages.css";
import Navbar from "../components/Navbar";
import InteractiveDashboard from "../components/InteractiveDashboard";

const LogisticsAutomationSuite = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const scrollTo = (id) => {
    navigate(`/#${id}`);
  };

  return (
    <div className="project-page">
      <Navbar 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        scrollTo={scrollTo}
        activeSection={null}
      />

      <section className="project-hero logistics-hero">
        <div className="project-hero-overlay"></div>
        <div className="project-hero-content">
          <span className="project-hero-badge">Business Systems</span>
          <h1>Logistics <br /><span>Automation Suite</span></h1>
          <p>End-to-end supply chain management with real-time tracking, route optimization, and analytics.</p>
          <div className="project-hero-stats">
            <div>
              <strong>32%</strong>
              <span>Reduced Delivery Times</span>
            </div>
            <div>
              <strong>28%</strong>
              <span>Lower Operational Costs</span>
            </div>
            <div>
              <strong>4.7/5</strong>
              <span>Customer Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DASHBOARD */}
      <section className="project-section dashboard-section">
        <div className="project-container">
          <span className="project-section-label">LIVE DEMO</span>
          <h2 className="project-section-title">Logistics <span>Dashboard</span></h2>
          <p className="project-section-desc">
            Click anywhere on the dashboard to interact with live data and explore the platform.
          </p>
          
          <InteractiveDashboard type="logistics" />
        </div>
      </section>

      <section className="project-section">
        <div className="project-container">
          <div className="project-grid">
            <div className="project-grid-text">
              <span className="project-section-label">OVERVIEW</span>
              <h2>The Challenge</h2>
              <p>
                A logistics company needed to modernize their operations with real-time tracking, route 
                optimization, and delivery analytics. Their manual processes were inefficient and costly.
              </p>
              <p>
                They needed a sophisticated system that could handle thousands of deliveries daily, optimize 
                routes in real-time, and provide complete visibility into their supply chain operations.
              </p>
            </div>
            <div className="project-grid-image">
              <div className="project-stat-card">
                <div className="stat-icon">🚚</div>
                <h4>Real-Time Tracking</h4>
                <p>Complete visibility into delivery operations</p>
              </div>
              <div className="project-stat-card">
                <div className="stat-icon">📊</div>
                <h4>Smart Analytics</h4>
                <p>Data-driven insights for optimization</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="project-section project-section-alt">
        <div className="project-container">
          <span className="project-section-label">SOLUTION</span>
          <h2 className="project-section-title">What We <span>Built</span></h2>
          <p className="project-section-desc">
            We built a microservices architecture with Go for high-performance processing, Kafka for real-time 
            data streaming, and a React Native mobile app for drivers.
          </p>
          
          <div className="project-features-grid">
            <div className="project-feature-card">
              <div className="feature-icon">📍</div>
              <h4>GPS Tracking</h4>
              <p>Real-time GPS tracking with live location updates and delivery status monitoring.</p>
            </div>
            <div className="project-feature-card">
              <div className="feature-icon">🗺️</div>
              <h4>Route Optimization</h4>
              <p>Dynamic route planning with real-time traffic and weather integration.</p>
            </div>
            <div className="project-feature-card">
              <div className="feature-icon">📱</div>
              <h4>Mobile App</h4>
              <p>React Native driver application with offline capability and scanning features.</p>
            </div>
            <div className="project-feature-card">
              <div className="feature-icon">📈</div>
              <h4>Analytics Dashboard</h4>
              <p>Comprehensive metrics on delivery performance, costs, and efficiency.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="project-section">
        <div className="project-container">
          <span className="project-section-label">RESULTS</span>
          <h2 className="project-section-title">The <span>Impact</span></h2>
          
          <div className="project-results-grid">
            <div className="project-result-card">
              <div className="result-number">32%</div>
              <h4>Faster Deliveries</h4>
              <p>Significant reduction in delivery times</p>
              <div className="result-bar"><div style={{ width: "100%" }}></div></div>
            </div>
            <div className="project-result-card">
              <div className="result-number">28%</div>
              <h4>Lower Costs</h4>
              <p>Reduced operational expenses through efficiency</p>
              <div className="result-bar"><div style={{ width: "85%" }}></div></div>
            </div>
            <div className="project-result-card">
              <div className="result-number">4.7</div>
              <h4>Customer Rating</h4>
              <p>Exceptional customer satisfaction scores</p>
              <div className="result-bar"><div style={{ width: "95%" }}></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="project-section project-section-alt">
        <div className="project-container">
          <span className="project-section-label">TECHNOLOGIES</span>
          <h2 className="project-section-title">Tech <span>Stack</span></h2>
          <div className="project-tech-grid">
            <span className="project-tech-item">Go</span>
            <span className="project-tech-item">Kafka</span>
            <span className="project-tech-item">PostgreSQL</span>
            <span className="project-tech-item">React Native</span>
            <span className="project-tech-item">Docker</span>
            <span className="project-tech-item">Kubernetes</span>
            <span className="project-tech-item">GRPC</span>
            <span className="project-tech-item">Redis</span>
          </div>
        </div>
      </section>

      <section className="project-cta">
        <div className="project-container">
          <h2>Ready to <span>automate your logistics?</span></h2>
          <p>Transform your supply chain with intelligent automation.</p>
          <button className="project-cta-btn" onClick={() => navigate("/#contact")}>Optimize Your Logistics →</button>
        </div>
      </section>
    </div>
  );
};

export default LogisticsAutomationSuite;