import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectPages.css";
import Navbar from "../components/Navbar";
import InteractiveDashboard from "../components/InteractiveDashboard";

const LuxuryRestaurant = () => {
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

      {/* Hero Section */}
      <section className="project-hero restaurant-hero">
        <div className="project-hero-overlay"></div>
        <div className="project-hero-content">
          <span className="project-hero-badge">Web Development</span>
          <h1>Luxury Restaurant <br /><span>Website</span></h1>
          <p>A premium dining experience with online reservations, menu management, and interactive gallery.</p>
          <div className="project-hero-stats">
            <div>
              <strong>340%</strong>
              <span>Increase in Reservations</span>
            </div>
            <div>
              <strong>28%</strong>
              <span>Table Turnover Improvement</span>
            </div>
            <div>
              <strong>4.9/5</strong>
              <span>User Satisfaction Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DASHBOARD */}
      <section className="project-section dashboard-section">
        <div className="project-container">
          <span className="project-section-label">LIVE DEMO</span>
          <h2 className="project-section-title">Restaurant <span>Dashboard</span></h2>
          <p className="project-section-desc">
            Click anywhere on the dashboard to interact with live data and explore the platform.
          </p>
          
          <InteractiveDashboard type="restaurant" />
        </div>
      </section>

      {/* Overview */}
      <section className="project-section">
        <div className="project-container">
          <div className="project-grid">
            <div className="project-grid-text">
              <span className="project-section-label">OVERVIEW</span>
              <h2>The Challenge</h2>
              <p>
                The client needed a sophisticated online presence that reflected their premium dining experience. 
                They were struggling with manual reservation management, outdated menu systems, and lacked 
                engagement with their customers outside the restaurant walls.
              </p>
              <p>
                Their existing website was static, unresponsive, and failed to convert visitors into diners. 
                They needed a complete digital transformation that would showcase their culinary excellence 
                and streamline their operations.
              </p>
            </div>
            <div className="project-grid-image">
              <div className="project-stat-card">
                <div className="stat-icon">🍽️</div>
                <h4>Premium Dining Experience</h4>
                <p>Luxury brand identity and immersive visual design</p>
              </div>
              <div className="project-stat-card">
                <div className="stat-icon">📱</div>
                <h4>Mobile-First Approach</h4>
                <p>Flawless experience across all devices</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="project-section project-section-alt">
        <div className="project-container">
          <span className="project-section-label">SOLUTION</span>
          <h2 className="project-section-title">What We <span>Built</span></h2>
          <p className="project-section-desc">
            We built a custom React-based platform with real-time table availability, a dynamic menu system 
            with high-quality imagery, and integrated Stripe for secure deposits. The design focused on warmth 
            and elegance to match the restaurant's brand.
          </p>
          
          <div className="project-features-grid">
            <div className="project-feature-card">
              <div className="feature-icon">📅</div>
              <h4>Real-time Reservations</h4>
              <p>Live table availability with instant booking confirmation and secure deposits via Stripe.</p>
            </div>
            <div className="project-feature-card">
              <div className="feature-icon">📋</div>
              <h4>Interactive Menu</h4>
              <p>Dynamic menu with dietary filters, high-quality imagery, and daily specials integration.</p>
            </div>
            <div className="project-feature-card">
              <div className="feature-icon">⭐</div>
              <h4>Review System</h4>
              <p>Integrated customer reviews with moderation and response capabilities for management.</p>
            </div>
            <div className="project-feature-card">
              <div className="feature-icon">📊</div>
              <h4>Analytics Dashboard</h4>
              <p>Comprehensive insights on reservations, popular dishes, and customer behavior patterns.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="project-section">
        <div className="project-container">
          <span className="project-section-label">RESULTS</span>
          <h2 className="project-section-title">The <span>Impact</span></h2>
          
          <div className="project-results-grid">
            <div className="project-result-card">
              <div className="result-number">340%</div>
              <h4>Online Reservations</h4>
              <p>Dramatic increase in bookings through the new platform</p>
              <div className="result-bar"><div style={{ width: "100%" }}></div></div>
            </div>
            <div className="project-result-card">
              <div className="result-number">28%</div>
              <h4>Table Turnover</h4>
              <p>Improved efficiency in managing dining capacity</p>
              <div className="result-bar"><div style={{ width: "85%" }}></div></div>
            </div>
            <div className="project-result-card">
              <div className="result-number">4.9</div>
              <h4>User Rating</h4>
              <p>Exceptional customer satisfaction across all touchpoints</p>
              <div className="result-bar"><div style={{ width: "95%" }}></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="project-section project-section-alt">
        <div className="project-container">
          <span className="project-section-label">TECHNOLOGIES</span>
          <h2 className="project-section-title">Tech <span>Stack</span></h2>
          <div className="project-tech-grid">
            <span className="project-tech-item">React</span>
            <span className="project-tech-item">Node.js</span>
            <span className="project-tech-item">Express</span>
            <span className="project-tech-item">MongoDB</span>
            <span className="project-tech-item">Stripe API</span>
            <span className="project-tech-item">Cloudinary</span>
            <span className="project-tech-item">Google Maps API</span>
            <span className="project-tech-item">Socket.io</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="project-cta">
        <div className="project-container">
          <h2>Ready to build your <span>digital experience?</span></h2>
          <p>Let's create something extraordinary together.</p>
          <button className="project-cta-btn" onClick={() => navigate("/#contact")}>Start Your Project →</button>
        </div>
      </section>
    </div>
  );
};

export default LuxuryRestaurant;