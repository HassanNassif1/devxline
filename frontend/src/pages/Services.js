import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/services.css';
import crmAnderp from '../img/erp&crm.jpg';
import Api from '../img/api.jpg';
import ecommerce from '../img/e-commerce.jpg';
import SaaS from '../img/SaaS.jpg';
import CoDevelop from '../img/Co Develop.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptopCode, faCogs, faUsers,faTimes,faBars } from '@fortawesome/free-solid-svg-icons';

import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence
const Services = () => {
  const [showCards, setShowCards] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  useEffect(() => {
    const timer = setTimeout(() => setShowCards(true), 200); // Delay to trigger staggered animations
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {/* Navigation */}
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
                  <Link to="/services"  className="active">Services</Link>
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
                  <Link to="/about-us">About Us</Link>
                </motion.li>
                <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3 }}>
                  <Link to="/services" className="active">Services</Link>
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

      {/* Services Section */}
      <div className="services-container">
        {/* CRM & ERP Software Section */}
        <div className={`service-card ${showCards ? 'show' : ''}`}>
          <h4 className='services-names' align="center">CRM & ERP Software</h4>
          <div className="service-content">
            <img src={crmAnderp} alt="CRM & ERP Software Image" className="service-img" />
            <p className="description" align="center">
              Our CRM & ERP software solutions help businesses streamline processes, enhance customer relationships, and optimize internal workflows.
            </p>
          </div>
        </div>

        {/* API & Database Solutions Section */}
        <div className={`service-card ${showCards ? 'show' : ''}`}>
          <h4 align="center">API & Database Solutions</h4>
          <div className="service-content">
            <img src={Api} alt="API & Database Solutions Image" className="service-img" />
            <p className="description" align="center">
              We provide API and database solutions that help you connect your applications with ease. Our solutions ensure your data is organized and easily accessible.
            </p>
          </div>
        </div>

        {/* Web Applications (E-Commerce and Management Systems) Section */}
        <div className={`service-card ${showCards ? 'show' : ''}`}>
          <h4 align="center">Web Applications (E-Commerce and Management Systems)</h4>
          <div className="service-content">
            <img src={ecommerce} alt="Web Applications Image" className="service-img" />
            <p className="description" align="center">
              Whether you need an e-commerce platform or a custom management system, we have the expertise to develop feature-rich web applications.
            </p>
          </div>
        </div>

        {/* SaaS and Subscription Platforms Section */}
        <div className={`service-card ${showCards ? 'show' : ''}`}>
          <h4 align="center">SaaS and Subscription Platforms</h4>
          <div className="service-content">
            <img src={SaaS} alt="SaaS & Subscription Platforms Image" className="service-img" />
            <p className="description" align="center">
              Our SaaS and subscription platform solutions are designed to help you deliver subscription-based services seamlessly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
