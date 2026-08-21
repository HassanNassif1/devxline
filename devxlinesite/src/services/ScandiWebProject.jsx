import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import image1 from "../img/scandiweb/1.png";
import image2 from "../img/scandiweb/2.png";
import image3 from "../img/scandiweb/3.png";
import Navbar from "../components/Navbar";

const ScandiWebProject = () => {
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
      title: "Product Catalog Dashboard",
      description: "Complete product catalog with live inventory management",
      details: "View all products with real-time stock status, pricing, and category filters. Includes out-of-stock indicators and seamless navigation between All, Clothes, and Tech categories."
    },
    {
      id: 2,
      src: image2,
      title: "Shopping Cart & Checkout",
      description: "Seamless checkout experience with currency selection",
      details: "Multi-currency support (USD, EUR, GBP) with real-time price updates. Cart shows itemized totals with size selection and smooth place order flow."
    },
    {
      id: 3,
      src: image3,
      title: "Product Management",
      description: "Advanced product catalog and inventory management",
      details: "Complete product catalog with stock management, size variations, and category organization."
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
    <div className={`project-detail-page scandiweb-project ${darkMode ? 'dark-mode' : ''}`}>
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
          <div className="project-detail-badge">✦ E-Commerce Platform</div>
          <h1 className="project-detail-title">
            ScandiWeb <span>Online Store</span>
          </h1>
          <p className="project-detail-subtitle">
            A full-featured e-commerce platform with real-time inventory management,
            multi-currency support, and seamless checkout experience
          </p>
        </div>

        <div className="project-detail-meta">
          <div className="meta-item">
            <span>📅</span>
            <div>
              <strong>Project Type</strong>
              <p>E-Commerce Platform</p>
            </div>
          </div>
          <div className="meta-item">
            <span>🛠️</span>
            <div>
              <strong>Technologies</strong>
              <p>React, GraphQL, Node.js, MongoDB</p>
            </div>
          </div>
          <div className="meta-item">
            <span>📊</span>
            <div>
              <strong>Results</strong>
              <p>+156% Revenue Growth</p>
            </div>
          </div>
        </div>

        {/* Screenshot Grid */}
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
              The client needed a modern e-commerce platform for their clothing store that could handle
              real-time inventory management, support multiple currencies, and provide a seamless shopping
              experience across all devices.
            </p>
          </div>

          <div className="detail-section">
            <h3>Solution</h3>
            <p>
              We built a full-featured e-commerce platform using React with GraphQL for efficient data fetching.
              The platform includes real-time inventory tracking, multi-currency support (USD, EUR, GBP),
              category filtering (All, Clothes, Tech), and a streamlined checkout process.
            </p>
          </div>

          <div className="detail-section">
            <h3>Key Features</h3>
            <ul className="feature-list">
              <li>✦ Real-time inventory management</li>
              <li>✦ Multi-currency support (USD, EUR, GBP)</li>
              <li>✦ Category filtering (All, Clothes, Tech)</li>
              <li>✦ Out-of-stock indicators</li>
              <li>✦ Size selection (S, M, L, XL / 40, 41, 42, 43)</li>
              <li>✦ Seamless checkout experience</li>
              <li>✦ Responsive design</li>
              <li>✦ Cart management with totals</li>
            </ul>
          </div>

          <div className="detail-section">
            <h3>Technologies Used</h3>
            <div className="tech-stack">
              <span className="tech-tag">React</span>
              <span className="tech-tag">GraphQL</span>
              <span className="tech-tag">Apollo Client</span>
              <span className="tech-tag">Node.js</span>
              <span className="tech-tag">Express</span>
              <span className="tech-tag">MongoDB</span>
              <span className="tech-tag">Stripe</span>
              <span className="tech-tag">JWT</span>
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

export default ScandiWebProject;