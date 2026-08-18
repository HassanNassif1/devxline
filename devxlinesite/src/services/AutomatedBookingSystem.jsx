import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectPages.css";
import Navbar from "../components/Navbar";
import InteractiveDashboard from "../components/InteractiveDashboard";

const AutomatedBookingSystem = () => {
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

      <section className="project-hero booking-hero">
        <div className="project-hero-overlay"></div>
        <div className="project-hero-content">
          <span className="project-hero-badge">Booking & Automation</span>
          <h1>Automated <br /><span>Booking System</span></h1>
          <p>Smart scheduling platform with real-time availability, automated reminders, and payment processing.</p>
          <div className="project-hero-stats">
            <div>
              <strong>85%</strong>
              <span>Reduced No-Shows</span>
            </div>
            <div>
              <strong>120%</strong>
              <span>Increased Booking Capacity</span>
            </div>
            <div>
              <strong>4.8/5</strong>
              <span>Customer Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DASHBOARD */}
      <section className="project-section dashboard-section">
        <div className="project-container">
          <span className="project-section-label">LIVE DEMO</span>
          <h2 className="project-section-title">Booking <span>Dashboard</span></h2>
          <p className="project-section-desc">
            Click anywhere on the dashboard to interact with live data and explore the platform.
          </p>
          
          <InteractiveDashboard type="booking" />
        </div>
      </section>

      <section className="project-section">
        <div className="project-container">
          <div className="project-grid">
            <div className="project-grid-text">
              <span className="project-section-label">OVERVIEW</span>
              <h2>The Challenge</h2>
              <p>
                A service-based business was struggling with manual booking management, double-bookings, and 
                missed appointments. Their staff spent hours on the phone confirming bookings and rescheduling.
              </p>
              <p>
                They needed a comprehensive solution that would automate the entire booking workflow, reduce 
                no-shows, and provide a seamless experience for both customers and staff.
              </p>
            </div>
            <div className="project-grid-image">
              <div className="project-stat-card">
                <div className="stat-icon">⚡</div>
                <h4>Real-Time Sync</h4>
                <p>Instant availability updates across all platforms</p>
              </div>
              <div className="project-stat-card">
                <div className="stat-icon">🔔</div>
                <h4>Smart Reminders</h4>
                <p>Automated email and SMS notifications</p>
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
            We created a comprehensive booking platform with real-time availability sync, automated email/SMS 
            reminders, integrated payment processing, and a staff management dashboard.
          </p>
          
          <div className="project-features-grid">
            <div className="project-feature-card">
              <div className="feature-icon">📅</div>
              <h4>Smart Scheduling</h4>
              <p>Real-time availability with intelligent conflict resolution and automated rescheduling.</p>
            </div>
            <div className="project-feature-card">
              <div className="feature-icon">📱</div>
              <h4>Multi-Channel Reminders</h4>
              <p>Automated email and SMS notifications to reduce no-shows and improve attendance.</p>
            </div>
            <div className="project-feature-card">
              <div className="feature-icon">💳</div>
              <h4>Secure Payments</h4>
              <p>Integrated payment processing with deposits, refunds, and subscription management.</p>
            </div>
            <div className="project-feature-card">
              <div className="feature-icon">👥</div>
              <h4>Staff Management</h4>
              <p>Complete team scheduling with availability tracking and performance analytics.</p>
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
              <div className="result-number">85%</div>
              <h4>Fewer No-Shows</h4>
              <p>Dramatic reduction in missed appointments</p>
              <div className="result-bar"><div style={{ width: "100%" }}></div></div>
            </div>
            <div className="project-result-card">
              <div className="result-number">120%</div>
              <h4>More Bookings</h4>
              <p>Significant increase in booking capacity</p>
              <div className="result-bar"><div style={{ width: "90%" }}></div></div>
            </div>
            <div className="project-result-card">
              <div className="result-number">4.8</div>
              <h4>Customer Rating</h4>
              <p>Exceptional user satisfaction scores</p>
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
            <span className="project-tech-item">Vue.js</span>
            <span className="project-tech-item">Express</span>
            <span className="project-tech-item">Redis</span>
            <span className="project-tech-item">WebSocket</span>
            <span className="project-tech-item">Stripe</span>
            <span className="project-tech-item">SendGrid</span>
            <span className="project-tech-item">MongoDB</span>
            <span className="project-tech-item">JWT</span>
          </div>
        </div>
      </section>

      <section className="project-cta">
        <div className="project-container">
          <h2>Need an <span>automated booking solution?</span></h2>
          <p>Streamline your scheduling and never miss a booking again.</p>
          <button className="project-cta-btn" onClick={() => navigate("/#contact")}>Automate Your Bookings →</button>
        </div>
      </section>
    </div>
  );
};

export default AutomatedBookingSystem;