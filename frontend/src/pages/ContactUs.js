import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/contactus.css';
import '../styles/style.css';
import { faTimes,faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';
import CoDevelop from '../img/Co Develop.jpg';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [zoomOut, setZoomOut] = useState(false); // State for zoom-out effect
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const handleLinkClick = () => {
    setZoomOut(true); // Trigger zoom-out effect
    setTimeout(() => {
      setZoomOut(false); // Reset zoom-out after animation ends (0.3s)
    }, 300);
  };

  const [status, setStatus] = useState('');
  const [remainingChars, setRemainingChars] = useState(1000); // State to track remaining characters

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'message') {
      setRemainingChars(1000 - value.length); // Update remaining characters for message
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set status to "Sending..."
    setStatus('Sending...');

    try {
      const response = await fetch('http://localhost:5001/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' }); // Clear form
        setRemainingChars(1000); // Reset remaining characters
      } else {
        setStatus('Error sending message. Please try again later.');
      }
    } catch (error) {
      setStatus('Network error occurred. Please try again later.');
    }
  };

  return (
    <div>
      
      <AnimatePresence mode="wait">
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
                  <Link to="/services"  >Services</Link>
                </motion.li>
                <motion.li
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to="/contact-us" className="active">Contact Us</Link>
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
                  <Link to="/reviews" >Feedbacks</Link>
                </motion.li>
              </motion.ul>
            </motion.div>
          )}
        <motion.nav
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          exit={{ scale: 0.9 }}
          transition={{ duration: 0.5 }}
        >
          
        
         


          {/* Navbar links */}
        
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
                  <Link to="/contact-us" className="active">Contact Us</Link>
                </motion.li>
                <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3 }}>
                  <Link to="/projects">Projects</Link>
                </motion.li>
                <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3 }}>
                  <Link to="/reviews">Feedbacks</Link>
                </motion.li>
              </ul>
          
            
        </motion.nav>

        <section className={`contact ${zoomOut ? 'zoom-out' : ''}`}>
          <div className="contact-header">
            <h1>Contact Us</h1>
            <p>We would love to hear from you! Please feel free to get in touch via the contact form below or through social media.</p>
          </div>

          <div className="contact-methods">
            <motion.div
              className={`contact-form ${zoomOut ? 'zoom-out' : ''}`}
              initial={{ scale: 1 }}
              animate={{ scale: 1.05 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <h2>Send Us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Your Full Name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="Your Email Address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    maxLength={1000} // Limit to 1000 characters
                  />
                  <p className="remaining-chars">Remaining characters: {remainingChars}</p>
                </div>
                <button type="submit" className="btn-submit">Submit</button>
              </form>
              {status && <p className="status-message">{status}</p>}
            </motion.div>

            <motion.div
              className={`social-icons ${zoomOut ? 'zoom-out' : ''}`}
              initial={{ scale: 1 }}
              animate={{ scale: 1.05 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <a href="https://www.instagram.com/nassiftech" className="social-icon instagram">
                <FontAwesomeIcon icon={faInstagram} />
                <p>Instagram</p>
              </a>
              <a href="https://www.tiktok.com/@nassiftech" className="social-icon tiktok">
                <FontAwesomeIcon icon={faTiktok} />
                <p>TikTok</p>
              </a>
            </motion.div>
          </div>
        </section>
      </AnimatePresence>
    </div>
  );
};

export default ContactUs;
