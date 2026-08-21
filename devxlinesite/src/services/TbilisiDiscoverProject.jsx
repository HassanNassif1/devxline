import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import homepageImg from "../img/tbilisidiscover/1.png";
import attractionsImg from "../img/tbilisidiscover/2.png";
import culturalImg from "../img/tbilisidiscover/3.png";
import diningImg from "../img/tbilisidiscover/4.png";
import nightlifeImg from "../img/tbilisidiscover/5.png";
import shoppingImg from "../img/tbilisidiscover/6.png";
import eventsImg from "../img/tbilisidiscover/7.png";
import mapImg from "../img/tbilisidiscover/8.png";
import Navbar from "../components/Navbar";

const TbilisiDiscoverProject = () => {
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
      src: homepageImg, 
      title: "Homepage", 
      description: "Beautiful landing page showcasing Tbilisi", 
      details: "Stunning homepage with hero section featuring Tbilisi's iconic landmarks, quick navigation to attractions, and a warm welcoming design that captures the essence of the city." 
    },
    { 
      id: 2, 
      src: attractionsImg, 
      title: "Attractions", 
      description: "Explore top attractions in Tbilisi", 
      details: "Curated list of must-visit attractions including the Holy Trinity Cathedral, Narikala Fortress, and the charming Old Town with detailed descriptions and visitor information." 
    },
    { 
      id: 3, 
      src: culturalImg, 
      title: "Cultural Sites", 
      description: "Discover cultural heritage sites", 
      details: "Explore Tbilisi's rich cultural heritage with detailed guides to museums, theaters, galleries, and historical monuments that tell the story of Georgia's capital." 
    },
    { 
      id: 4, 
      src: diningImg, 
      title: "Dining", 
      description: "Best restaurants and dining experiences", 
      details: "Comprehensive dining guide featuring traditional Georgian cuisine, modern fusion restaurants, cozy cafes, and wine bars with authentic Georgian wines and hospitality." 
    },
    { 
      id: 5, 
      src: nightlifeImg, 
      title: "Nightlife", 
      description: "Nightlife and entertainment guide", 
      details: "Vibrant nightlife scene with rooftop bars, underground clubs, live music venues, and entertainment options for every taste and style in Tbilisi." 
    },
    { 
      id: 6, 
      src: shoppingImg, 
      title: "Shopping", 
      description: "Shopping destinations and local markets", 
      details: "Explore shopping destinations from luxury boutiques to local markets, including the famous Dry Bridge Market, shopping malls, and unique Georgian craft shops." 
    },
    { 
      id: 7, 
      src: eventsImg, 
      title: "Events", 
      description: "Events and festivals in Tbilisi", 
      details: "Calendar of events, festivals, concerts, and cultural celebrations happening throughout the year in Tbilisi, from the Tbilisi Jazz Festival to the Tbilisi International Film Festival." 
    },
    { 
      id: 8, 
      src: mapImg, 
      title: "Interactive Map", 
      description: "Interactive city map with points of interest", 
      details: "Interactive map with all points of interest, allowing users to explore Tbilisi's neighborhoods, find nearby attractions, and plan their perfect itinerary with ease." 
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
    <div className={`project-detail-page tbilisi-project ${darkMode ? 'dark-mode' : ''}`}>
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

        <div className="project-detail-header project-detail-header-centered">
          <div className="project-detail-badge">✦ Travel & Tourism Platform</div>
          <h1 className="project-detail-title">
            Tbilisi <span>Discover</span>
          </h1>
          <p className="project-detail-subtitle">
            A comprehensive travel guide platform showcasing the best of Tbilisi - 
            from attractions and dining to nightlife and cultural experiences
          </p>
        </div>

        <div className="project-detail-meta project-detail-meta-centered">
          <div className="meta-item">
            <span>📅</span>
            <div>
              <strong>Project Type</strong>
              <p>Travel & Tourism Platform</p>
            </div>
          </div>
          <div className="meta-item">
            <span>🛠️</span>
            <div>
              <strong>Technologies</strong>
              <p>React, Node.js, MongoDB, Mapbox</p>
            </div>
          </div>
          <div className="meta-item">
            <span>📊</span>
            <div>
              <strong>Results</strong>
              <p>+200% User Engagement</p>
            </div>
          </div>
        </div>

        {/* Screenshot Grid - Centered */}
        <div className="screenshot-grid-container screenshot-grid-container-centered">
          <div className="screenshot-grid-header screenshot-grid-header-centered">
            <h2>Project <span>Screenshots</span></h2>
            <p>Click any screenshot to view in fullscreen</p>
          </div>

          <div className="screenshot-grid screenshot-grid-4 screenshot-grid-centered">
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

        {/* Project Details - Centered */}
        <div className="project-detail-content project-detail-content-centered">
          <div className="detail-section detail-section-centered">
            <h3>Challenge</h3>
            <p>
              Tbilisi needed a comprehensive digital platform to showcase the city's rich culture, 
              attractions, dining, and nightlife to tourists and locals alike. The platform needed 
              to be visually stunning, easy to navigate, and provide valuable information to users.
            </p>
          </div>

          <div className="detail-section detail-section-centered">
            <h3>Solution</h3>
            <p>
              We built a full-featured travel guide platform using React with dynamic content 
              management. The platform includes interactive maps, detailed attraction guides, 
              restaurant recommendations, event calendars, and user reviews to help visitors 
              discover the best of Tbilisi.
            </p>
          </div>

          <div className="detail-section detail-section-centered">
            <h3>Key Features</h3>
            <ul className="feature-list feature-list-centered">
              <li>✦ Interactive city map with points of interest</li>
              <li>✦ Attractions and cultural site guides</li>
              <li>✦ Restaurant and dining recommendations</li>
              <li>✦ Nightlife and entertainment guide</li>
              <li>✦ Shopping destinations and local markets</li>
              <li>✦ Events and festivals calendar</li>
              <li>✦ User reviews and ratings</li>
              <li>✦ Mobile-responsive design</li>
            </ul>
          </div>

          <div className="detail-section detail-section-centered">
            <h3>Technologies Used</h3>
            <div className="tech-stack tech-stack-centered">
              <span className="tech-tag">React</span>
              <span className="tech-tag">Node.js</span>
              <span className="tech-tag">Express</span>
              <span className="tech-tag">MongoDB</span>
              <span className="tech-tag">Mapbox</span>
              <span className="tech-tag">Redux</span>
              <span className="tech-tag">JWT</span>
              <span className="tech-tag">Cloudinary</span>
            </div>
          </div>
        </div>

        <div className="project-detail-cta project-detail-cta-centered">
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

export default TbilisiDiscoverProject;