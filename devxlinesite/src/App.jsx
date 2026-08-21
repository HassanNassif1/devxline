import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import { Link } from "react-router-dom";

// Import Navbar
import Navbar from "./components/Navbar";
import devxlineLight from './img/devxlinelight.png';
import devxlineDark from './img/devxlinedark.png';

// Import ScandiWeb images
import scandiweb1 from "./img/scandiweb/1.png";

// Import TbilisiDiscover images
import tbilisi1 from "./img/tbilisidiscover/1.png";

// Import DigitalConnects images
import digital1 from "./img/digitalconnects/1.png";

// Import Estishara images
import estishara1 from "./img/estishara/1.png";

// Import project page components
import ScandiWebProject from "./services/ScandiWebProject";
import TbilisiDiscoverProject from "./services/TbilisiDiscoverProject";
import DigitalConnectsProject from "./services/DigitalConnectsProject";
import EstisharaProject from "./services/EstisharaProject";

const services = [
  {
    number: "01",
    title: "Web Experiences",
    tag: "Web Development",
    description:
      "High-performance websites designed to turn attention into enquiries, bookings and sales — not just pages that look good.",
    features: ["Corporate websites", "Landing pages", "Restaurant websites", "E-commerce experiences"],
    icon: "◈",
  },
  {
    number: "02",
    title: "Business Systems",
    tag: "Custom Software",
    description:
      "Custom dashboards and internal platforms that organize your operations, reduce repetitive work and give your team control.",
    features: ["CRM systems", "Admin dashboards", "Inventory", "Management platforms"],
    icon: "⌘",
  },
  {
    number: "03",
    title: "Digital Growth",
    tag: "SEO & Optimization",
    description:
      "A stronger digital presence built around discoverability, speed, conversion and a clear customer journey.",
    features: ["Technical SEO", "Performance", "Conversion strategy", "Analytics"],
    icon: "↗",
  },
  {
    number: "04",
    title: "Booking & Automation",
    tag: "Smart Workflows",
    description:
      "Turn manual processes into streamlined digital workflows so your customers and your team spend less time waiting.",
    features: ["Appointments", "Notifications", "Forms", "Automated workflows"],
    icon: "✦",
  },
];

const process = [
  ["01", "Discover", "We understand your business, audience, competitors and the problem your digital product needs to solve."],
  ["02", "Design", "We turn the strategy into a clear interface, memorable visual system and frictionless customer journey."],
  ["03", "Build", "React-powered frontends and reliable backend systems are developed with scalability and maintainability in mind."],
  ["04", "Launch", "We test, optimize, deploy and help you make the first impression count."],
];

const industries = [
  "Restaurants & Cafés",
  "Beauty & Wellness",
  "Medical Centers",
  "Real Estate",
  "Professional Services",
  "Retail & E-commerce",
  "Hospitality",
  "Startups",
];

// Projects Data
const projects = [
  {
    id: 1,
    title: "ScandiWeb Platform",
    slug: "scandiweb",
    category: "Web Development",
    description: "A comprehensive e-commerce platform with AI-powered recommendations and real-time analytics.",
    image: scandiweb1,
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    serviceId: 0,
    serviceName: "Web Experiences",
    icon: "🛒",
    gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  },
  {
    id: 2,
    title: "Tbilisi Discover",
    slug: "tbilisidiscover",
    category: "Web Development",
    description: "A comprehensive travel guide platform showcasing the best of Tbilisi.",
    image: tbilisi1,
    tags: ["React", "Node.js", "MongoDB", "Mapbox"],
    serviceId: 0,
    serviceName: "Web Experiences",
    icon: "🗺️",
    gradient: "linear-gradient(135deg, #10b981, #06b6d4)",
  },
  {
    id: 3,
    title: "Digital Connects",
    slug: "digitalconnects",
    category: "Custom Software",
    description: "A comprehensive digital solutions platform with real-time analytics, network management, and integration tools.",
    image: digital1,
    tags: ["React", "Node.js", "PostgreSQL", "AWS"],
    serviceId: 1,
    serviceName: "Business Systems",
    icon: "🔗",
    gradient: "linear-gradient(135deg, #f59e0b, #f97316)",
  },
  {
    id: 4,
    title: "Estishara · visa",
    slug: "estishara",
    category: "Web Development",
    description: "A comprehensive visa consultation and appointment management platform.",
    image: estishara1,
    tags: ["React", "Node.js", "MongoDB", "JWT"],
    serviceId: 0,
    serviceName: "Web Experiences",
    icon: "🛂",
    gradient: "linear-gradient(135deg, #4f46e5, #7c3aed)",
  },
];

// Main App Component
function MainApp() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredProject, setHoveredProject] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      const sections = ["home", "about", "services", "projects", "process", "contact"];
      let current = "home";
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };
    
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
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
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
  };

  const navigateToProject = (slug) => {
    navigate(`/project/${slug}`);
  };

  return (
    <div className="site-shell">
      <div className="noise" />

      <Navbar 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        scrollTo={scrollTo}
        activeSection={activeSection}
      />

      <main>
        <section id="home" className="hero section">
          <div className="hero-grid" />
          <div className="hero-orb orb-one" />
          <div className="hero-orb orb-two" />

          <div className="hero-content">
            <div className="eyebrow reveal">
              <span className="pulse-dot" />
              Digital products for ambitious businesses
            </div>

            <h1 className="hero-title reveal delay-1">
              Your business deserves
              <span className="gradient-text"> a digital advantage.</span>
            </h1>

            <p className="hero-description reveal delay-2">
              DevXLine creates premium websites, custom software and digital
              experiences that make businesses look sharper, work smarter and
              grow faster.
            </p>

            <div className="hero-actions reveal delay-3">
              <button className="button button-primary" onClick={() => scrollTo("contact")}>
                Build something great <span>↗</span>
              </button>
              <button className="button button-ghost" onClick={() => scrollTo("services")}>
                Explore services <span>↓</span>
              </button>
            </div>

            <div className="hero-proof reveal delay-4">
              <div><strong>01</strong><span>Strategy-first</span></div>
              <div><strong>02</strong><span>Built for business</span></div>
              <div><strong>03</strong><span>Designed to convert</span></div>
            </div>
          </div>

          <div className="hero-visual reveal delay-2">
            <div className="visual-frame">
              <div className="visual-topbar">
                <div className="window-dots"><i /><i /><i /></div>
                <span>devxline / digital-studio</span>
                <span>● live</span>
              </div>
              <div className="dashboard-preview">
                <div className="preview-sidebar">
                  <span className="preview-logo">&lt;/&gt;</span>
                  <span className="active-line" />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <div className="preview-main">
                  <div className="preview-heading">
                    <div>
                      <small>BUSINESS OVERVIEW</small>
                      <h3>Good morning, let's grow.</h3>
                    </div>
                    <div className="avatar">DX</div>
                  </div>
                  <div className="preview-cards">
                    <div><small>Revenue</small><strong>$84.6K</strong><em>+18.4%</em></div>
                    <div><small>Conversion</small><strong>8.42%</strong><em>+3.2%</em></div>
                    <div><small>Projects</small><strong>128</strong><em>+12</em></div>
                  </div>
                  <div className="preview-chart">
                    <div className="chart-label"><span>Performance</span><small>Last 30 days ↗</small></div>
                    <div className="chart-bars">
                      {[38, 55, 46, 72, 63, 80, 68, 91, 76, 100, 84, 94].map((h, i) => (
                        <i key={i} style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="preview-bottom">
                    <div className="mini-widget"><span>SEO health</span><strong>94 / 100</strong><div className="progress"><i /></div></div>
                    <div className="mini-widget"><span>New enquiries</span><strong>+32 today</strong><div className="mini-spark">╱╲╱╲╱╱╲</div></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="floating-card floating-one"><span>✦</span><div><small>Experience</small><strong>Premium UI</strong></div></div>
            <div className="floating-card floating-two"><span>↗</span><div><small>Growth</small><strong>+42.8%</strong></div></div>
          </div>

          <div className="hero-scroll">SCROLL TO EXPLORE <span>↓</span></div>
        </section>

        <section className="ticker ticker-gradient">
          <div className="ticker-track">
            {[
              "✦ BUILD SMARTER",
              "✦ DESIGN BETTER",
              "✦ GROW FASTER",
              "✦ INNOVATE DAILY",
              "✦ SCALE HIGHER",
              "✦ BUILD SMARTER",
              "✦ DESIGN BETTER",
              "✦ GROW FASTER",
              "✦ INNOVATE DAILY",
              "✦ SCALE HIGHER",
            ].map((text, i) => (
              <span key={i} className="ticker-gradient-text">
                {text}
              </span>
            ))}
          </div>
          <div className="ticker-particle" />
        </section>

        <section id="about" className="section about-section">
          <div className="section-label"><span>01</span> ABOUT DEVXLINE</div>
          <div className="about-grid">
            <div>
              <h2 className="section-title">We don't just build <span>websites.</span><br />We build <em>business tools.</em></h2>
            </div>
            <div className="about-copy">
              <p className="large-copy">
                Your website is often the first conversation a customer has with your company. We make sure it feels like the beginning of a great relationship.
              </p>
              <p>
                DevXLine combines development, design and business thinking to create digital products that are beautiful on the surface and useful underneath. From a first landing page to a complete business management platform, every decision has a purpose.
              </p>
              <button className="text-link" onClick={() => scrollTo("contact")}>Let's discuss your idea <span>↗</span></button>
            </div>
          </div>

          <div className="stats-row">
            <div><strong>01</strong><span>Partner mindset</span><p>We think about your business, not only your code.</p></div>
            <div><strong>24/7</strong><span>Digital presence</span><p>Your customers can discover and interact with you anytime.</p></div>
            <div><strong>∞</strong><span>Built to evolve</span><p>Scalable foundations that can grow with your company.</p></div>
            <div><strong>DX</strong><span>One digital partner</span><p>Strategy, design, development and optimization in one place.</p></div>
          </div>
        </section>

        <section id="services" className="section services-section">
          <div className="section-heading">
            <div>
              <div className="section-label"><span>02</span> WHAT WE DO</div>
              <h2 className="section-title">Digital solutions with<br /><span>real business purpose.</span></h2>
            </div>
            <p>Choose the starting point. We'll help you turn it into something bigger.</p>
          </div>

          <div className="services-layout">
            <div className="service-list">
              {services.map((service, index) => (
                <button
                  className={`service-row ${activeService === index ? "service-active" : ""}`}
                  key={service.number}
                  onMouseEnter={() => setActiveService(index)}
                  onClick={() => setActiveService(index)}
                >
                  <span className="service-number">{service.number}</span>
                  <span className="service-name">{service.title}</span>
                  <span className="service-arrow">↗</span>
                </button>
              ))}
            </div>

            <div>
              <div className="laptop-3d">
                <div className="laptop-3d-wrapper">
                  <div className="laptop-3d-screen">
                    <div className="laptop-3d-bezel">
                      <div className="laptop-3d-camera"></div>
                      <div className="laptop-3d-content">
                        <div className="laptop-3d-tag">{services[activeService].tag}</div>
                        <div className="laptop-3d-title-wrap">
                          <span className="laptop-3d-icon">{services[activeService].icon}</span>
                          <h3 className="laptop-3d-title">{services[activeService].title}</h3>
                        </div>
                        <p className="laptop-3d-desc">{services[activeService].description}</p>
                        <div className="laptop-3d-features">
                          {services[activeService].features.map((feature) => (
                            <div key={feature} className="laptop-3d-feature">
                              <span className="laptop-3d-check">✦</span>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                        <button className="laptop-3d-cta" onClick={() => scrollTo("contact")}>
                          Discuss this service <span>↗</span>
                        </button>
                      </div>
                      <div className="laptop-3d-glare"></div>
                      <div className="laptop-3d-glow"></div>
                    </div>
                  </div>
                  <div className="laptop-3d-hinge">
                    <span></span><span></span><span></span><span></span><span></span>
                  </div>
                  <div className="laptop-3d-base">
                    <div className="laptop-3d-keyboard">
                      <div className="laptop-3d-kb-row">
                        <div className="laptop-3d-key"></div><div className="laptop-3d-key"></div>
                        <div className="laptop-3d-key"></div><div className="laptop-3d-key"></div>
                        <div className="laptop-3d-key"></div><div className="laptop-3d-key"></div>
                        <div className="laptop-3d-key"></div><div className="laptop-3d-key"></div>
                        <div className="laptop-3d-key"></div><div className="laptop-3d-key"></div>
                        <div className="laptop-3d-key"></div><div className="laptop-3d-key"></div>
                      </div>
                      <div className="laptop-3d-kb-row">
                        <div className="laptop-3d-key"></div><div className="laptop-3d-key"></div>
                        <div className="laptop-3d-key"></div><div className="laptop-3d-key"></div>
                        <div className="laptop-3d-key"></div><div className="laptop-3d-key"></div>
                        <div className="laptop-3d-key"></div><div className="laptop-3d-key"></div>
                        <div className="laptop-3d-key"></div><div className="laptop-3d-key"></div>
                        <div className="laptop-3d-key"></div><div className="laptop-3d-key"></div>
                      </div>
                      <div className="laptop-3d-kb-row">
                        <div className="laptop-3d-key"></div><div className="laptop-3d-key"></div>
                        <div className="laptop-3d-key"></div><div className="laptop-3d-key"></div>
                        <div className="laptop-3d-key"></div><div className="laptop-3d-key"></div>
                        <div className="laptop-3d-key"></div><div className="laptop-3d-key"></div>
                        <div className="laptop-3d-key"></div><div className="laptop-3d-key"></div>
                        <div className="laptop-3d-key laptop-3d-space"></div>
                      </div>
                    </div>
                    <div className="laptop-3d-trackpad"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="section projects-section">
          <div className="section-label"><span>03</span> OUR WORK</div>
          <div className="projects-header">
            <div>
              <h2 className="section-title">Featured <span>Projects</span></h2>
              <p className="projects-subtitle">Click any project to view detailed case study.</p>
            </div>
            <div className="projects-badge">
              <span>{projects.length} Projects</span>
              <span>Web & Software</span>
            </div>
          </div>

          <div className="projects-grid">
            {projects.map((project, index) => (
              <div 
                key={project.id}
                className={`project-card ${hoveredProject === index ? 'project-hover' : ''}`}
                onMouseEnter={() => setHoveredProject(index)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => navigateToProject(project.slug)}
              >
                <div className="project-image-wrapper">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="project-image"
                  />
                  <div className="project-image-overlay">
                    <div className="project-overlay-content">
                      <span className="project-icon">{project.icon}</span>
                      <span className="project-view-btn">View Case Study →</span>
                      <span className="project-service-name">{project.serviceName}</span>
                    </div>
                  </div>
                  <div className="project-gradient-overlay" style={{ background: project.gradient }} />
                </div>
                <div className="project-info">
                  <span className="project-category">{project.category}</span>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tags">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="project-tag">{tag}</span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="project-tag project-tag-more">+{project.tags.length - 3}</span>
                    )}
                  </div>
                  <div className="project-service-link">
                    <span className="service-indicator">→ {project.serviceName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="projects-cta">
            <button className="button button-primary" onClick={() => scrollTo("contact")}>
              Start your project <span>↗</span>
            </button>
          </div>
        </section>

        <section id="process" className="section process-section">
          <div className="section-label"><span>04</span> OUR PROCESS</div>
          <div className="process-header">
            <h2 className="section-title">From <span>idea</span> to<br />digital reality.</h2>
            <p>Good projects don't happen by accident. Our process keeps business goals, creative direction and technical execution moving together.</p>
          </div>

          <div className="process-grid">
            {process.map(([num, title, text]) => (
              <article className="process-card" key={num}>
                <span className="process-number">{num}</span>
                <div className="process-line" />
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="process-plus">+</span>
              </article>
            ))}
          </div>
        </section>

        <section className="section industries-section">
          <div className="section-label"><span>05</span> WHO WE HELP</div>
          <div className="industries-grid">
            <div>
              <h2 className="section-title">Built around the<br /><span>way you work.</span></h2>
              <p>Whether you're opening your first location or managing an established company, your digital presence should support the next stage of your business.</p>
            </div>
            <div className="industry-tags">
              {industries.map((industry, i) => (
                <div key={industry} className="industry-tag">
                  <span>0{i + 1}</span>{industry}<b>↗</b>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section why-section">
          <div className="why-card">
            <div className="why-glow" />
            <div className="section-label light"><span>06</span> WHY DEVXLINE</div>
            <div className="why-content">
              <div>
                <h2>Looks premium.<br /><span>Works even better.</span></h2>
              </div>
              <div className="why-points">
                <div><strong>01</strong><p><b>Business-first thinking</b><br />We start with what your customers and team actually need.</p></div>
                <div><strong>02</strong><p><b>Modern technology</b><br />Fast, responsive and maintainable solutions built for the long run.</p></div>
                <div><strong>03</strong><p><b>Conversion-focused design</b><br />Every section has a job — communicate, convince or convert.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="contact-grid">
            <div>
              <div className="section-label"><span>07</span> START A PROJECT</div>
              <h2 className="contact-title">Have an idea?<br /><span>Let's make it real.</span></h2>
              <p className="contact-description">
                Tell us what you're building, what isn't working or simply where you want to go. We'll turn the conversation into a clear next step.
              </p>
              <div className="contact-details">
                <a href="mailto:hello@devxline.com">hello@devxline.com <span>↗</span></a>
                <span>Available worldwide · Remote-first</span>
              </div>
            </div>

            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-row">
                <label><span>Your name</span><input placeholder="John Smith" /></label>
                <label><span>Company</span><input placeholder="Your company" /></label>
              </div>
              <label><span>Email address</span><input type="email" placeholder="you@company.com" /></label>
              <label><span>What can we build?</span>
                <select defaultValue="">
                  <option value="" disabled>Select a service</option>
                  <option>Website</option>
                  <option>Custom software</option>
                  <option>UI / UX design</option>
                  <option>SEO & optimization</option>
                  <option>Something else</option>
                </select>
              </label>
              <label><span>Tell us about your project</span><textarea rows="4" placeholder="A few words about your business, goals and what you need..." /></label>
              <button className="button button-primary form-submit">Send project enquiry <span>↗</span></button>
              <small className="form-note">No pressure. No complicated sales process. Just a conversation.</small>
            </form>
          </div>
        </section>

        <section className="final-cta">
          <div className="final-orb" />
          <span>DEVXLINE / DIGITAL STUDIO</span>
          <h2>Make your next<br /><em>move digital.</em></h2>
          <button className="button button-white" onClick={() => scrollTo("contact")}>Start a conversation <span>↗</span></button>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-top">
          <Link to="/" className="brand footer-brand">
            <img 
              src={darkMode ? devxlineLight : devxlineDark} 
              alt="DevXLine" 
              className="brand-logo footer-logo"
            />
          </Link>
          <p>Digital products for businesses<br />that want to move forward.</p>
          <div className="footer-links">
            <button onClick={() => scrollTo("about")}>About</button>
            <button onClick={() => scrollTo("services")}>Services</button>
            <button onClick={() => scrollTo("projects")}>Projects</button>
            <button onClick={() => scrollTo("process")}>Process</button>
            <button onClick={() => scrollTo("contact")}>Contact</button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} DevXLine. All rights reserved.</span>
          <span>Built with intention <b>✦</b></span>
        </div>
      </footer>
    </div>
  );
}

// Main App with Router
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/project/scandiweb" element={<ScandiWebProject />} />
        <Route path="/project/tbilisidiscover" element={<TbilisiDiscoverProject />} />
        <Route path="/project/digitalconnects" element={<DigitalConnectsProject />} />
        <Route path="/project/estishara" element={<EstisharaProject />} />
      </Routes>
    </Router>
  );
}

export default App;