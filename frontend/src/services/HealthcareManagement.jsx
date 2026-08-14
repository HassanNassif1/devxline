import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectPages.css";
import Navbar from "../components/Navbar";
import InteractiveDashboard from "../components/InteractiveDashboard";

const HealthcareManagement = () => {
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

      <section className="project-hero healthcare-hero">
        <div className="project-hero-overlay"></div>
        <div className="project-hero-content">
          <span className="project-hero-badge">Custom Software</span>
          <h1>Healthcare <br /><span>Management Platform</span></h1>
          <p>Complete patient management system with appointment scheduling, medical records, and billing.</p>
          <div className="project-hero-stats">
            <div>
              <strong>52%</strong>
              <span>Reduced Patient Wait Times</span>
            </div>
            <div>
              <strong>35%</strong>
              <span>Decreased Admin Costs</span>
            </div>
            <div>
              <strong>78%</strong>
              <span>Staff Satisfaction Increase</span>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DASHBOARD */}
      <section className="project-section dashboard-section">
        <div className="project-container">
          <span className="project-section-label">LIVE DEMO</span>
          <h2 className="project-section-title">Healthcare <span>Dashboard</span></h2>
          <p className="project-section-desc">
            Click anywhere on the dashboard to interact with live data and explore the platform.
          </p>
          
          <InteractiveDashboard type="healthcare" />
        </div>
      </section>

      <section className="project-section">
        <div className="project-container">
          <div className="project-grid">
            <div className="project-grid-text">
              <span className="project-section-label">OVERVIEW</span>
              <h2>The Challenge</h2>
              <p>
                A growing medical practice needed a unified platform to manage patient records, appointments, 
                billing, and communication across multiple locations. They were using disconnected systems that 
                led to inefficiencies and errors.
              </p>
              <p>
                Staff spent excessive time on administrative tasks, patients faced long wait times, and data 
                security was a growing concern. They needed a HIPAA-compliant solution that would streamline 
                operations and improve patient care.
              </p>
            </div>
            <div className="project-grid-image">
              <div className="project-stat-card">
                <div className="stat-icon">🏥</div>
                <h4>Multi-Location Management</h4>
                <p>Unified platform across all practice locations</p>
              </div>
              <div className="project-stat-card">
                <div className="stat-icon">🔒</div>
                <h4>HIPAA Compliant</h4>
                <p>Enterprise-grade security for patient data</p>
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
            We developed a HIPAA-compliant Next.js platform with real-time appointment scheduling, electronic 
            medical records (EMR), automated billing, and Twilio integration for SMS notifications.
          </p>
          
          <div className="project-features-grid">
            <div className="project-feature-card">
              <div className="feature-icon">📋</div>
              <h4>EMR System</h4>
              <p>Electronic medical records with secure access and comprehensive patient history tracking.</p>
            </div>
            <div className="project-feature-card">
              <div className="feature-icon">📅</div>
              <h4>Smart Scheduling</h4>
              <p>Real-time appointment booking with automated reminders and waitlist management.</p>
            </div>
            <div className="project-feature-card">
              <div className="feature-icon">💳</div>
              <h4>Automated Billing</h4>
              <p>Integrated billing system with insurance verification and payment processing.</p>
            </div>
            <div className="project-feature-card">
              <div className="feature-icon">📱</div>
              <h4>Patient Portal</h4>
              <p>Secure patient access to records, appointments, and direct messaging with providers.</p>
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
              <div className="result-number">52%</div>
              <h4>Reduced Wait Times</h4>
              <p>Patients spend less time waiting for appointments</p>
              <div className="result-bar"><div style={{ width: "100%" }}></div></div>
            </div>
            <div className="project-result-card">
              <div className="result-number">35%</div>
              <h4>Cost Reduction</h4>
              <p>Significant decrease in administrative overhead</p>
              <div className="result-bar"><div style={{ width: "80%" }}></div></div>
            </div>
            <div className="project-result-card">
              <div className="result-number">78%</div>
              <h4>Staff Satisfaction</h4>
              <p>Healthcare workers more efficient and happier</p>
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
            <span className="project-tech-item">Next.js</span>
            <span className="project-tech-item">PostgreSQL</span>
            <span className="project-tech-item">AWS</span>
            <span className="project-tech-item">Twilio</span>
            <span className="project-tech-item">Redis</span>
            <span className="project-tech-item">Docker</span>
            <span className="project-tech-item">Kubernetes</span>
            <span className="project-tech-item">WebRTC</span>
          </div>
        </div>
      </section>

      <section className="project-cta">
        <div className="project-container">
          <h2>Need a <span>healthcare solution?</span></h2>
          <p>We build secure, compliant platforms for modern healthcare.</p>
          <button className="project-cta-btn" onClick={() => navigate("/#contact")}>Discuss Your Project →</button>
        </div>
      </section>
    </div>
  );
};

export default HealthcareManagement;