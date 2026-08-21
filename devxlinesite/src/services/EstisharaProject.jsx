import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import image1 from "../img/estishara/1.png";
import image2 from "../img/estishara/2.png";
import image3 from "../img/estishara/3.png";
import image4 from "../img/estishara/4.png";
import Navbar from "../components/Navbar";

const EstisharaProject = () => {
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
      src: image4, 
      title: "Estishara - Login Page", 
      description: "Professional login page with visa consultation branding",
      details: "Beautifully designed login interface with Estishara branding, featuring a split layout with brand information on the left and a secure login form on the right. Includes dark mode toggle and responsive design."
    },
    { 
      id: 2, 
      src: image3, 
      title: "Client Dashboard", 
      description: "Visa appointment management dashboard for clients",
      details: "Comprehensive client dashboard showing visa types, appointment booking form, and a list of all upcoming appointments with real-time status tracking."
    },
    { 
      id: 3, 
      src: image2, 
      title: "Admin Dashboard", 
      description: "Complete administrative control panel",
      details: "Full-featured admin dashboard with appointment management, user management, visa type configuration, and comprehensive analytics and reporting tools."
    },
     { 
    id: 4, 
    src: image1, 
    title: "Client Appointments", 
    description: "Efficient client appointment management system",
    details: "Streamlined interface for managing client appointments with calendar view, status tracking, and quick actions. Admins can easily schedule, reschedule, and cancel appointments while viewing client history and preferences."
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
    <div className={`project-detail-page estishara-project ${darkMode ? 'dark-mode' : ''}`}>
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
          <div className="project-detail-badge">✦ Visa Consultation Platform</div>
          <h1 className="project-detail-title">
            Estishara <span>· visa</span>
          </h1>
          <p className="project-detail-subtitle">
            A comprehensive visa consultation and appointment management platform connecting 
            clients with expert visa services for Spain and beyond
          </p>
        </div>

        <div className="project-detail-meta">
          <div className="meta-item">
            <span>📅</span>
            <div>
              <strong>Project Type</strong>
              <p>Visa Consultation Platform</p>
            </div>
          </div>
          <div className="meta-item">
            <span>🛠️</span>
            <div>
              <strong>Technologies</strong>
              <p>React, Node.js, MongoDB, JWT</p>
            </div>
          </div>
          <div className="meta-item">
            <span>📊</span>
            <div>
              <strong>Results</strong>
              <p>+320% Appointment Bookings</p>
            </div>
          </div>
        </div>

        {/* Screenshot Grid - No carousel */}
        <div className="estishara-screenshot-grid">
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
              Estishara needed a modern, secure platform to manage their visa consultation services. 
              The platform needed to handle client registration, appointment booking, visa type management, 
              and administrative oversight while providing a seamless experience for both clients and staff.
            </p>
          </div>

          <div className="detail-section">
            <h3>Solution</h3>
            <p>
              We built Estishara - a comprehensive visa consultation platform using React with a robust 
              Node.js backend. The platform features a beautiful login page, client dashboard for booking 
              appointments, administrative control panel, and real-time appointment tracking with automated 
              notifications.
            </p>
          </div>

          <div className="detail-section">
            <h3>Key Features</h3>
            <ul className="feature-list">
              <li>✦ Professional login page with brand identity</li>
              <li>✦ Client registration and authentication</li>
              <li>✦ Visa type management and configuration</li>
              <li>✦ Appointment booking with calendar integration</li>
              <li>✦ Real-time appointment status tracking</li>
              <li>✦ Administrative dashboard with analytics</li>
              <li>✦ User management and role-based access</li>
              <li>✦ Automated email notifications</li>
              <li>✦ Dark mode support</li>
              <li>✦ Mobile-responsive design</li>
            </ul>
          </div>

          <div className="detail-section">
            <h3>Technologies Used</h3>
            <div className="tech-stack">
              <span className="tech-tag">React</span>
              <span className="tech-tag">Node.js</span>
              <span className="tech-tag">Express</span>
              <span className="tech-tag">MongoDB</span>
              <span className="tech-tag">JWT</span>
              <span className="tech-tag">Redux</span>
              <span className="tech-tag">WebSocket</span>
              <span className="tech-tag">SendGrid</span>
              <span className="tech-tag">Docker</span>
              <span className="tech-tag">AWS</span>
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

export default EstisharaProject;