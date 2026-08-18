import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectPages.css";
import Navbar from "../components/Navbar";
import InteractiveDashboard from "../components/InteractiveDashboard";

const ECommerceGrowthSuite = () => {
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

      <section className="project-hero ecommerce-hero">
        <div className="project-hero-overlay"></div>
        <div className="project-hero-content">
          <span className="project-hero-badge">Digital Growth</span>
          <h1>E-Commerce <br /><span>Growth Suite</span></h1>
          <p>AI-powered analytics and optimization platform that increased conversions by 156%.</p>
          <div className="project-hero-stats">
            <div>
              <strong>156%</strong>
              <span>Increase in Conversions</span>
            </div>
            <div>
              <strong>42%</strong>
              <span>Higher Average Order Value</span>
            </div>
            <div>
              <strong>67%</strong>
              <span>Reduced Cart Abandonment</span>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DASHBOARD */}
      <section className="project-section dashboard-section">
        <div className="project-container">
          <span className="project-section-label">LIVE DEMO</span>
          <h2 className="project-section-title">Analytics <span>Dashboard</span></h2>
          <p className="project-section-desc">
            Click anywhere on the dashboard to interact with live data and explore the platform.
          </p>
          
          <InteractiveDashboard type="ecommerce" />
        </div>
      </section>

      <section className="project-section">
        <div className="project-container">
          <div className="project-grid">
            <div className="project-grid-text">
              <span className="project-section-label">OVERVIEW</span>
              <h2>The Challenge</h2>
              <p>
                An e-commerce retailer was struggling to understand why visitors were abandoning carts and 
                how to optimize their conversion funnel. They had massive traffic but low conversion rates.
              </p>
              <p>
                They needed an AI-driven solution that could analyze user behavior in real-time, provide 
                personalized product recommendations, and automatically adjust pricing strategies to maximize 
                revenue.
              </p>
            </div>
            <div className="project-grid-image">
              <div className="project-stat-card">
                <div className="stat-icon">🤖</div>
                <h4>AI-Powered Analytics</h4>
                <p>Real-time behavior analysis and insights</p>
              </div>
              <div className="project-stat-card">
                <div className="stat-icon">📊</div>
                <h4>Conversion Optimization</h4>
                <p>Data-driven strategies for maximum revenue</p>
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
            We built an AI-driven analytics platform using TensorFlow that analyzes user behavior in real-time, 
            provides personalized product recommendations, and automatically adjusts pricing strategies.
          </p>
          
          <div className="project-features-grid">
            <div className="project-feature-card">
              <div className="feature-icon">📈</div>
              <h4>Real-Time Analytics</h4>
              <p>Live behavior tracking with heatmaps and session recording for deep insights.</p>
            </div>
            <div className="project-feature-card">
              <div className="feature-icon">🎯</div>
              <h4>AI Recommendations</h4>
              <p>TensorFlow-powered personalization for product suggestions and upselling.</p>
            </div>
            <div className="project-feature-card">
              <div className="feature-icon">💰</div>
              <h4>Dynamic Pricing</h4>
              <p>Automated price optimization based on demand, competition, and inventory.</p>
            </div>
            <div className="project-feature-card">
              <div className="feature-icon">🧪</div>
              <h4>Auto A/B Testing</h4>
              <p>Automated experimentation for continuous optimization and improvement.</p>
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
              <div className="result-number">156%</div>
              <h4>Conversions Increased</h4>
              <p>Dramatic improvement in conversion rates</p>
              <div className="result-bar"><div style={{ width: "100%" }}></div></div>
            </div>
            <div className="project-result-card">
              <div className="result-number">42%</div>
              <h4>Higher Order Value</h4>
              <p>Customers spending significantly more per purchase</p>
              <div className="result-bar"><div style={{ width: "85%" }}></div></div>
            </div>
            <div className="project-result-card">
              <div className="result-number">67%</div>
              <h4>Less Abandonment</h4>
              <p>Dramatic reduction in cart abandonment rates</p>
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
            <span className="project-tech-item">Python</span>
            <span className="project-tech-item">TensorFlow</span>
            <span className="project-tech-item">React</span>
            <span className="project-tech-item">Docker</span>
            <span className="project-tech-item">Kafka</span>
            <span className="project-tech-item">Elasticsearch</span>
            <span className="project-tech-item">Redis</span>
            <span className="project-tech-item">GraphQL</span>
          </div>
        </div>
      </section>

      <section className="project-cta">
        <div className="project-container">
          <h2>Ready to <span>scale your e-commerce?</span></h2>
          <p>Let AI-powered growth drive your business forward.</p>
          <button className="project-cta-btn" onClick={() => navigate("/#contact")}>Boost Your Growth →</button>
        </div>
      </section>
    </div>
  );
};

export default ECommerceGrowthSuite;