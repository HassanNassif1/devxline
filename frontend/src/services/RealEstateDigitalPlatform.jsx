import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectPages.css";
import Navbar from "../components/Navbar";
import InteractiveDashboard from "../components/InteractiveDashboard";

const RealEstateDigitalPlatform = () => {
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

      <section className="project-hero realestate-hero">
        <div className="project-hero-overlay"></div>
        <div className="project-hero-content">
          <span className="project-hero-badge">Web Development</span>
          <h1>Real Estate <br /><span>Digital Platform</span></h1>
          <p>Immersive property showcase with 3D tours, AI recommendations, and smart search.</p>
          <div className="project-hero-stats">
            <div>
              <strong>320%</strong>
              <span>Increase in Property Views</span>
            </div>
            <div>
              <strong>8.5 min</strong>
              <span>Average Time on Site</span>
            </div>
            <div>
              <strong>156%</strong>
              <span>More Qualified Leads</span>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DASHBOARD */}
      <section className="project-section dashboard-section">
        <div className="project-container">
          <span className="project-section-label">LIVE DEMO</span>
          <h2 className="project-section-title">Real Estate <span>Dashboard</span></h2>
          <p className="project-section-desc">
            Click anywhere on the dashboard to interact with live data and explore the platform.
          </p>
          
          <InteractiveDashboard type="realestate" />
        </div>
      </section>

      <section className="project-section">
        <div className="project-container">
          <div className="project-grid">
            <div className="project-grid-text">
              <span className="project-section-label">OVERVIEW</span>
              <h2>The Challenge</h2>
              <p>
                A real estate agency needed a cutting-edge platform to showcase properties with immersive 3D 
                tours and intelligent search capabilities. Their existing platform was outdated and failing 
                to engage modern buyers.
              </p>
              <p>
                They wanted to create an experience that would make buyers feel like they were walking through 
                properties, with smart recommendations and powerful search features.
              </p>
            </div>
            <div className="project-grid-image">
              <div className="project-stat-card">
                <div className="stat-icon">🏠</div>
                <h4>Immersive Experience</h4>
                <p>3D tours and interactive property viewing</p>
              </div>
              <div className="project-stat-card">
                <div className="stat-icon">🤖</div>
                <h4>AI Recommendations</h4>
                <p>Smart property suggestions based on user behavior</p>
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
            We developed a WebGL-powered platform with Three.js for 3D property tours, AI-driven property 
            recommendations, and Elasticsearch for fast, accurate search with filters.
          </p>
          
          <div className="project-features-grid">
            <div className="project-feature-card">
              <div className="feature-icon">🏠</div>
              <h4>3D Property Tours</h4>
              <p>Immersive WebGL-powered tours with interactive navigation and 360° views.</p>
            </div>
            <div className="project-feature-card">
              <div className="feature-icon">🧠</div>
              <h4>AI Recommendations</h4>
              <p>Intelligent property suggestions based on user preferences and viewing history.</p>
            </div>
            <div className="project-feature-card">
              <div className="feature-icon">🔍</div>
              <h4>Smart Search</h4>
              <p>Elasticsearch-powered search with advanced filters, maps, and neighborhoods.</p>
            </div>
            <div className="project-feature-card">
              <div className="feature-icon">🗺️</div>
              <h4>Interactive Maps</h4>
              <p>Integrated Mapbox with neighborhood insights and school zone information.</p>
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
              <div className="result-number">320%</div>
              <h4>More Views</h4>
              <p>Dramatic increase in property engagement</p>
              <div className="result-bar"><div style={{ width: "100%" }}></div></div>
            </div>
            <div className="project-result-card">
              <div className="result-number">8.5</div>
              <h4>Minutes on Site</h4>
              <p>Visitors spending significantly more time exploring</p>
              <div className="result-bar"><div style={{ width: "85%" }}></div></div>
            </div>
            <div className="project-result-card">
              <div className="result-number">156%</div>
              <h4>More Qualified Leads</h4>
              <p>Higher quality leads from engaged visitors</p>
              <div className="result-bar"><div style={{ width: "90%" }}></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="project-section project-section-alt">
        <div className="project-container">
          <span className="project-section-label">TECHNOLOGIES</span>
          <h2 className="project-section-title">Tech <span>Stack</span></h2>
          <div className="project-tech-grid">
            <span className="project-tech-item">Three.js</span>
            <span className="project-tech-item">GraphQL</span>
            <span className="project-tech-item">Elasticsearch</span>
            <span className="project-tech-item">Firebase</span>
            <span className="project-tech-item">React</span>
            <span className="project-tech-item">Node.js</span>
            <span className="project-tech-item">WebGL</span>
            <span className="project-tech-item">Mapbox</span>
          </div>
        </div>
      </section>

      <section className="project-cta">
        <div className="project-container">
          <h2>Ready for a <span>real estate platform?</span></h2>
          <p>Create immersive experiences that sell properties.</p>
          <button className="project-cta-btn" onClick={() => navigate("/#contact")}>Build Your Platform →</button>
        </div>
      </section>
    </div>
  );
};

export default RealEstateDigitalPlatform;