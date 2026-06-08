import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptopCode, faCogs, faUsers,faTimes,faBars } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/aboutus.css';
import '../styles/style.css';
import CoDevelop from '../img/Co Develop.jpg';


const AboutUs = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="about-us"
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
                  <Link to="/about-us" className="active">About Us</Link>
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
                  <Link to="/projects">Projects</Link>
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
        <nav >
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
                  <Link to="/about-us" className="active">About Us</Link>
                </motion.li>
                <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3 }}>
                  <Link to="/services">Services</Link>
                </motion.li>
                <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3 }}>
                  <Link to="/contact-us">Contact Us</Link>
                </motion.li>
                <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3 }}>
                  <Link to="/projects">Projects</Link>
                </motion.li>
                <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3 }}>
                  <Link to="/reviews">Feedbacks</Link>
                </motion.li>
              </ul>
            </nav>

          <section className="intro">
            <div className="intro-text">
              <h1>Welcome to Co Develop</h1>
              <p>Your trusted partner for web development, software applications, and more.</p>
            </div>
          </section>

          <section className="what-we-do">
            <div className="section-heading">
              <h2>What We Do?</h2>
              <div className="line"></div>
            </div>
            <div className="services">
              <div className="service-box">
                <FontAwesomeIcon icon={faLaptopCode} className='service-icon' />
                <h3>Website Development</h3>
                <p>We specialize in creating custom websites including E-commerce, portfolios, and more.</p>
              </div>
              <div className="service-box">
                <FontAwesomeIcon icon={faCogs} className='service-icon' />
                <h3>Software Development</h3>
                <p>We develop efficient software applications for businesses including data entry and cashier systems.</p>
              </div>
              <div className="service-box">
                <FontAwesomeIcon icon={faUsers} className='service-icon' />
                <h3>Customer Support</h3>
                <p>We provide excellent support to ensure smooth operations for all our clients.</p>
              </div>
            </div>
          </section>

          <section className="future-works">
            <div className="section-heading">
              <h2>Future Works</h2>
              <div className="line"></div>
            </div>
            <p>Co Develop is always expanding, and we aim to bring even more exciting services, such as mobile app development and AI-powered solutions, in the near future.</p>
          </section>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AboutUs;
