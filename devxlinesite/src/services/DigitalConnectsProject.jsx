import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import image1 from "../img/digitalconnects/1.png";
import image2 from "../img/digitalconnects/2.png";
import image3 from "../img/digitalconnects/3.png";
import Navbar from "../components/Navbar";

const DigitalConnectsProject = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [darkMode]);

  const screenshots = [
    { 
      id: 1, 
      src: image1, 
      title: "Digital Connects - Login", 
      description: "Secure authentication portal with enterprise-grade security",
      details: "Modern login interface with username and password fields, featuring security badges and professional design."
    },
    { 
      id: 2, 
      src: image2, 
      title: "Accounting Dashboard", 
      description: "Complete accounting and financial management dashboard",
      details: "Comprehensive dashboard showing total profit, amount, net profit trends with interactive charts and real-time data updates."
    },
     { 
    id: 3, 
    src: image3, 
    title: "General Dashboard", 
    description: "Full invoicing and payment tracking system",
    details: "Advanced invoice management interface with create, refresh, and deduction options. Shows total invoices, unique clients, and pending status with monthly overview."
  },
  ];

  const toggleFullscreen = (image) => {
    setSelectedImage(image);
    setIsFullscreen(!isFullscreen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const scrollTo = (id) => {
    navigate(`/#${id}`);
  };

  return (
    <div className={`project-detail-page digitalconnects-project ${darkMode ? 'dark-mode' : ''}`}>
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        scrollTo={scrollTo}
        activeSection={null}
      />

      <div className="project-content-wrapper">
        <button className="back-button" onClick={() => navigate("/")}>
          ← Back to Projects
        </button>

        <div className="project-detail-header">
          <div className="project-detail-badge">✦ Digital Solutions Platform</div>
          <h1 className="project-detail-title">
            Digital <span>Connects</span>
          </h1>
          <p className="project-detail-subtitle">
            A comprehensive digital solutions platform connecting businesses with powerful 
            analytics, network management, and integration tools
          </p>
        </div>

        <div className="project-detail-meta">
          <div className="meta-item">
            <span>📅</span>
            <div>
              <strong>Project Type</strong>
              <p>Digital Solutions Platform</p>
            </div>
          </div>
          <div className="meta-item">
            <span>🛠️</span>
            <div>
              <strong>Technologies</strong>
              <p>React, Node.js, PostgreSQL, AWS</p>
            </div>
          </div>
          <div className="meta-item">
            <span>📊</span>
            <div>
              <strong>Results</strong>
              <p>+180% Platform Adoption</p>
            </div>
          </div>
        </div>

        {/* Screenshot Grid - No carousel */}
        <div className="screenshot-grid-container">
          <div className="screenshot-grid-header">
            <h2>Project <span>Screenshots</span></h2>
            <p>Click any screenshot to view in fullscreen</p>
          </div>

          <div className="screenshot-grid">
            {screenshots.map((screenshot) => (
              <div 
                key={screenshot.id} 
                className="screenshot-grid-item"
                onClick={() => toggleFullscreen(screenshot)}
              >
                <div className="screenshot-grid-item-inner">
                  <img 
                    src={screenshot.src} 
                    alt={screenshot.title}
                    className="screenshot-grid-image"
                  />
                  <div className="screenshot-grid-overlay">
                    <div className="screenshot-grid-label">
                      <span className="screenshot-grid-badge">Screenshot {screenshot.id}</span>
                      <h4>{screenshot.title}</h4>
                      <p>{screenshot.description}</p>
                      <span className="screenshot-grid-zoom">🔍 Click to zoom</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fullscreen Modal */}
        {isFullscreen && selectedImage && (
          <div className="fullscreen-modal" onClick={() => toggleFullscreen(null)}>
            <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
              <button className="fullscreen-close" onClick={() => toggleFullscreen(null)}>✕</button>
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="fullscreen-image"
              />
              <div className="fullscreen-info">
                <h3>{selectedImage.title}</h3>
                <p>{selectedImage.details}</p>
              </div>
            </div>
          </div>
        )}

        {/* Project Details */}
        <div className="project-detail-content">
          <div className="detail-section">
            <h3>Challenge</h3>
            <p>
              Businesses needed a unified digital platform that could connect various aspects 
              of their operations - from network monitoring and data analytics to user management 
              and third-party integrations. The platform needed to be scalable, secure, and easy to use.
            </p>
          </div>

          <div className="detail-section">
            <h3>Solution</h3>
            <p>
              We built Digital Connects - a comprehensive digital solutions platform using React 
              with a robust Node.js backend. The platform includes real-time network monitoring, 
              advanced data analytics dashboards, secure user authentication, and seamless API 
              integration capabilities.
            </p>
          </div>

          <div className="detail-section">
            <h3>Key Features</h3>
            <ul className="feature-list">
              <li>✦ Real-time network monitoring and analytics</li>
              <li>✦ Advanced data visualization dashboards</li>
              <li>✦ Secure user authentication and RBAC</li>
              <li>✦ Third-party API integration hub</li>
              <li>✦ Automated reporting and alerts</li>
              <li>✦ Scalable microservices architecture</li>
              <li>✦ Customizable widget system</li>
              <li>✦ Mobile-responsive design</li>
            </ul>
          </div>

          <div className="detail-section">
            <h3>Technologies Used</h3>
            <div className="tech-stack">
              <span className="tech-tag">React</span>
              <span className="tech-tag">Node.js</span>
              <span className="tech-tag">Express</span>
              <span className="tech-tag">PostgreSQL</span>
              <span className="tech-tag">AWS</span>
              <span className="tech-tag">Redux</span>
              <span className="tech-tag">JWT</span>
              <span className="tech-tag">WebSocket</span>
              <span className="tech-tag">Docker</span>
              <span className="tech-tag">Redis</span>
            </div>
          </div>
        </div>

        <div className="project-detail-cta">
          <button className="button button-primary" onClick={() => navigate("/#contact")}>
            Start Your Project <span>↗</span>
          </button>
          <button className="button button-ghost" onClick={() => navigate("/")}>
            View All Projects <span>←</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DigitalConnectsProject;