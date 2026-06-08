import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/style.css";
import "../styles/projects.css";
import ecommerce from "../mp4/2d.mp4";
import socialmedia from "../mp4/2d.mp4";
import github from '../img/github.jpg';
import linkedin from '../img/linkedin.png';
import CoDevelop from '../img/Co Develop.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptopCode, faCogs, faUsers,faTimes,faBars } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from "framer-motion";

const Projects = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    setIsVideoLoaded(true);
  }, []);

  // Project animation (smooth drop + rotation)
  const containerVariants = {
    hidden: { opacity: 0, y: -50, rotate: 1, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  // "More Projects" section animation
  const moreProjectsVariants = {
    hidden: { opacity: 0, y: 50, rotate: 5, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15, delay: 0.3 },
    },
  };

  // Toggle the menu when hamburger icon is clicked


  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="projects"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
         {menuOpen && (
            <motion.div
              className="menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="hamburger"
                onClick={toggleMenu}
                initial={{ rotate: 0 }}
                animate={{ rotate: menuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`hamburger-icon ${menuOpen ? 'open' : ''}`}>
                  <span className="line top"></span>
                  <span className="line middle"></span>
                  <span className="line bottom"></span>
                </div>
              </motion.div>

              <motion.ul
                className={`nav-links ${menuOpen ? 'open' : ''}`}
                initial={{ x: '100%' }}
                animate={{ x: menuOpen ? '0%' : '100%' }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 100 }}
              >
                <motion.li
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to="/" >Home</Link>
                </motion.li>
                <motion.li
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to="/about-us">About Us</Link>
                </motion.li>
                <motion.li
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to="/services">Services</Link>
                </motion.li>
                <motion.li
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to="/contact-us">Contact Us</Link>
                </motion.li>
                <motion.li
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to="/projects" className="active">Projects</Link>
                </motion.li>
                <motion.li
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to="/reviews">Feedbacks</Link>
                </motion.li>
              </motion.ul>
            </motion.div>
          )}
        <div>
          {/* Navigation */}
          <motion.nav
            initial={{ scale: 1 }}
            animate={{ scale: 1.05 }}
            exit={{ scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
           

           
            {/* Menu Links */}
         
              <Link to="/">
                <img src={CoDevelop} alt="CoDevelop Logo" className="logo-img" />
              </Link>
              <div className="hamburger" onClick={toggleMenu}>
                <FontAwesomeIcon icon={!menuOpen ?  faBars : ''} size="2x" />
              </div>
              <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3 }}>
                  <Link to="/" >Home</Link>
                </motion.li>
                <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3 }}>
                  <Link to="/about-us">About Us</Link>
                </motion.li>
                <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3 }}>
                  <Link to="/services">Services</Link>
                </motion.li>
                <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3 }}>
                  <Link to="/contact-us">Contact Us</Link>
                </motion.li>
                <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3 }}>
                  <Link to="/projects" className="active">Projects</Link>
                </motion.li>
                <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3 }}>
                  <Link to="/reviews">Feedbacks</Link>
                </motion.li>
              </ul>
          
          </motion.nav>

          {/* Projects Section */}
          <section className="projects">
            <motion.h1
              className="projects-title"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              Our Featured Projects
            </motion.h1>

            <div className="project-container">
              {/* E-commerce Project */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="project"
              >
                <h2 className="project-title">E-commerce Platform</h2>
                <div className="project-content">
                  <div className="project-video">
                    {isVideoLoaded && (
                      <video width="100%" height="auto" controls preload="auto">
                        <source src={ecommerce} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                  <div className="project-description">
                    <p>
                      This is an E-commerce platform that allows users to buy products seamlessly.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Social Media Management System */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="project"
              >
                <h2 className="project-title">Social Media Management System</h2>
                <div className="project-content">
                  <div className="project-video">
                    {isVideoLoaded && (
                      <video width="100%" height="auto" controls preload="auto">
                        <source src={socialmedia} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                  <div className="project-description">
                    <p>
                      The Social Media Management System allows users to schedule posts, analyze performance, and manage multiple social media accounts from one platform.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* More Projects Section */}
            <motion.section
              variants={moreProjectsVariants}
              initial="hidden"
              animate="visible"
              className="more-projects"
            >
              <p className="more-projects-text">And many more exciting projects to come in the future!</p>
            </motion.section>

            {/* Social Links */}
            <div className="social-links">
              <motion.a
                href="https://github.com/HassanNassif1"
                target="_blank"
                rel="noopener noreferrer"
                className="btn github"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <img src={github} alt="GitHub" className="github-icon" />
                <span className="btn-text">View my GitHub</span>
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/hassan-nassif-0b6b29313/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn linkedin"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <img src={linkedin} alt="LinkedIn" className="linkedin-icon" />
                <span className="btn-text">Connect on LinkedIn</span>
              </motion.a>
            </div>
          </section>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Projects;
