import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import devxlineDark from "../img/devxlinedark.png";
import devxlineLight from "../img/devxlinelight.png";

// Import project images
import scandiwebImg from "../img/scandiweb/1.png";
import tbilisidiscoverImg from "../img/tbilisidiscover/1.png";
import digitalconnectsImg from "../img/digitalconnects/1.png";
import estisharaImg from "../img/estishara/1.png";

const Navbar = ({ darkMode, toggleDarkMode, scrollTo, activeSection }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const projects = [
    { 
      slug: "scandiweb", 
      name: "ScandiWeb Platform", 
      icon: "🛒",
      image: scandiwebImg,
      category: "Web Development",
      color: "#6366f1",
      gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)"
    },
    { 
      slug: "tbilisidiscover", 
      name: "Tbilisi Discover", 
      icon: "🗺️",
      image: tbilisidiscoverImg,
      category: "Web Development",
      color: "#10b981",
      gradient: "linear-gradient(135deg, #10b981, #06b6d4)"
    },
    { 
      slug: "digitalconnects", 
      name: "Digital Connects", 
      icon: "🔗",
      image: digitalconnectsImg,
      category: "Custom Software",
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b, #f97316)"
    },
    { 
      slug: "estishara", 
      name: "Estishara · visa", 
      icon: "🛂",
      image: estisharaImg,
      category: "Web Development",
      color: "#4f46e5",
      gradient: "linear-gradient(135deg, #4f46e5, #7c3aed)"
    },
  ];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 800 && menuOpen) {
        setMenuOpen(false);
        setMobileDropdownOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  const handleMouseEnter = () => {
    if (window.innerWidth > 800) {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        setHoverTimeout(null);
      }
      setDropdownOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth > 800) {
      const timeout = setTimeout(() => {
        setDropdownOpen(false);
      }, 200);
      setHoverTimeout(timeout);
    }
  };

  const handleMobileProjectsToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileDropdownOpen(!mobileDropdownOpen);
  };

  const handleNavClick = (id) => {
    if (isHomePage) {
      scrollTo(id);
    }
    setMenuOpen(false);
    setDropdownOpen(false);
    setMobileDropdownOpen(false);
  };

  const getNavLinkClass = (section) => {
    if (!isHomePage) return "nav-link";
    return `nav-link ${activeSection === section ? "active" : ""}`;
  };

  const getIndicator = (section) => {
    if (!isHomePage) return null;
    return activeSection === section ? <span className="nav-indicator" /> : null;
  };

  const handleProjectClick = () => {
    setDropdownOpen(false);
    setMenuOpen(false);
    setMobileDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.navbar')) {
        setMenuOpen(false);
        setMobileDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <Link to="/" className="brand" aria-label="DevXLine home" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none' }}>
        <img 
          src={darkMode ? devxlineLight : devxlineDark} 
          alt="DevXLine" 
          className="brand-logo"
        />
      </Link>

      <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
        {isHomePage ? (
          <>
            <button 
              className={getNavLinkClass("home")}
              onClick={() => handleNavClick("home")}
            >
              Home
              {getIndicator("home")}
            </button>
            <button 
              className={getNavLinkClass("about")}
              onClick={() => handleNavClick("about")}
            >
              About
              {getIndicator("about")}
            </button>
            <button 
              className={getNavLinkClass("services")}
              onClick={() => handleNavClick("services")}
            >
              Services
              {getIndicator("services")}
            </button>
            
            <div 
              className="projects-dropdown-wrapper"
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className={`${getNavLinkClass("projects")} projects-dropdown-btn`}
                onClick={handleMobileProjectsToggle}
                style={{ width: '100%', justifyContent: 'space-between' }}
              >
                <span>Projects</span>
                <span className={`dropdown-arrow ${(dropdownOpen || mobileDropdownOpen) ? 'open' : ''}`}>▾</span>
                {getIndicator("projects")}
              </button>
              
              {(dropdownOpen || mobileDropdownOpen) && (
                <div 
                  className={`landscape-dropdown ${menuOpen ? 'mobile-dropdown-open' : ''}`}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="dropdown-grid">
                    {projects.map((project) => (
                      <Link
                        key={project.slug}
                        to={`/project/${project.slug}`}
                        className="project-dropdown-card"
                        onClick={handleProjectClick}
                        style={{ '--project-color': project.color, '--project-gradient': project.gradient }}
                      >
                        <div className="project-card-image-wrapper">
                          <img 
                            src={project.image} 
                            alt={project.name} 
                            className="project-card-image"
                            loading="lazy"
                          />
                          <div className="project-card-overlay" style={{ background: project.gradient }}></div>
                          <span className="project-card-badge">{project.category}</span>
                        </div>
                        <div className="project-card-content">
                          <span className="project-card-icon">{project.icon}</span>
                          <div className="project-card-info">
                            <span className="project-card-name">{project.name}</span>
                            <span className="project-card-category">{project.category}</span>
                          </div>
                          <span className="project-card-arrow">→</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="dropdown-footer">
                    <Link
                      to="/#projects"
                      className="dropdown-view-all-btn"
                      onClick={handleProjectClick}
                    >
                      <span>📂</span>
                      <span>View All Projects</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <button 
              className={getNavLinkClass("process")}
              onClick={() => handleNavClick("process")}
            >
              Process
              {getIndicator("process")}
            </button>
            <button 
              className={getNavLinkClass("contact")}
              onClick={() => handleNavClick("contact")}
            >
              Contact
              {getIndicator("contact")}
            </button>
          </>
        ) : (
          <>
            <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link to="/#about" className="nav-link" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link to="/#services" className="nav-link" onClick={() => setMenuOpen(false)}>
              Services
            </Link>
            
            <div 
              className="projects-dropdown-wrapper"
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className="nav-link projects-dropdown-btn"
                onClick={handleMobileProjectsToggle}
                style={{ width: '100%', justifyContent: 'space-between' }}
              >
                <span>Projects</span>
                <span className={`dropdown-arrow ${(dropdownOpen || mobileDropdownOpen) ? 'open' : ''}`}>▾</span>
              </button>
              
              {(dropdownOpen || mobileDropdownOpen) && (
                <div 
                  className={`landscape-dropdown ${menuOpen ? 'mobile-dropdown-open' : ''}`}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="dropdown-grid">
                    {projects.map((project) => (
                      <Link
                        key={project.slug}
                        to={`/project/${project.slug}`}
                        className="project-dropdown-card"
                        onClick={handleProjectClick}
                        style={{ '--project-color': project.color, '--project-gradient': project.gradient }}
                      >
                        <div className="project-card-image-wrapper">
                          <img 
                            src={project.image} 
                            alt={project.name} 
                            className="project-card-image"
                            loading="lazy"
                          />
                          <div className="project-card-overlay" style={{ background: project.gradient }}></div>
                          <span className="project-card-badge">{project.category}</span>
                        </div>
                        <div className="project-card-content">
                          <span className="project-card-icon">{project.icon}</span>
                          <div className="project-card-info">
                            <span className="project-card-name">{project.name}</span>
                            <span className="project-card-category">{project.category}</span>
                          </div>
                          <span className="project-card-arrow">→</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="dropdown-footer">
                    <Link
                      to="/#projects"
                      className="dropdown-view-all-btn"
                      onClick={handleProjectClick}
                    >
                      <span>📂</span>
                      <span>View All Projects</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/#process" className="nav-link" onClick={() => setMenuOpen(false)}>
              Process
            </Link>
            <Link to="/#contact" className="nav-link" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
          </>
        )}
        
        <button className="dark-toggle" onClick={toggleDarkMode} aria-label="Toggle dark mode">
          {darkMode ? "☀️" : "🌙"}
        </button>
        
        <Link to="/#contact" className="nav-cta" onClick={() => setMenuOpen(false)}>
          Start a project <span>↗</span>
        </Link>
      </nav>

      <button 
        className="menu-toggle" 
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen(!menuOpen);
          if (menuOpen) {
            setMobileDropdownOpen(false);
          }
        }} 
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  );
};

export default Navbar;