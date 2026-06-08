import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence
import '../styles/style.css'; // Assuming you have your styles here
import CoDevelop from '../img/Co Develop.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptopCode, faCogs, faUsers,faTimes,faBars } from '@fortawesome/free-solid-svg-icons';
import Typewriter from '../AnimatedTyping/TypeWriter';
import { useDarkMode } from '../DarkMode/DarkModeContext';
import videoSrc from '../mp4/2d.mp4';
import { useNavigate } from 'react-router-dom';
import CreateAppointment from './CreateAppointmentForm';
// import videoSrc from '../mp4/Video2d';
const Home = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // State to manage modal visibility



  const handleOpenModal = () => {
    setModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setModalOpen(false); // Close the modal
  };
 

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1 }}
      >
      {modalOpen && (
  <motion.div
    className="consultation-modal-overlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <motion.div
      className="consultation-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="modal-content">
        <button className="close-modal" onClick={handleCloseModal}>X</button>
        <CreateAppointment />
      </div>
    </motion.div>
  </motion.div>
)}

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
                  <Link to="/" className="active">Home</Link>
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

        {/* Hero Section */}
        
        <div className="hero-container" data-aos="fade-up">
          
          <div className="hero">
            <nav >
              <Link to="/">
                <img src={CoDevelop} alt="CoDevelop Logo" className="logo-img" />
              </Link>
              <div className="hamburger" onClick={toggleMenu}>
                <FontAwesomeIcon icon={!menuOpen ?  faBars : ''} size="2x" />
              </div>
              <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3 }}>
                  <Link to="/" className="active">Home</Link>
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
                  <Link to="/projects">Projects</Link>
                </motion.li>
                <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3 }}>
                  <Link to="/reviews">Feedbacks</Link>
                </motion.li>
              </ul>
            </nav>
            <div className='first'>
              <div className='Consultation'>
              <button className="free-consultation-btn" onClick={handleOpenModal}>
                  Create a Free Consultation 🚀
                </button>
</div>
<video src={videoSrc} autoPlay loop muted alt="CoDevelopBg Logo" className="background-logo" />
            </div>
            
            <div className="TypeWriter">
  <p>
    <span>Hello,</span>
    We are Co Develop Company, <br />
    We specialize in Web and Software Development.
  </p>
</div>

           

          </div>
        
        </div>
       
        {/* About Section */}
        <section className="about" data-aos="fade-left">
          <div className="main">
            <div className="about-text">
              <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}>
                About Me
              </motion.h2>
              <motion.h5 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}>
                Development <span>& Design</span>
              </motion.h5>
              <motion.p
                style={{ color: 'rgb(114, 189, 255)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                We are a full-stack development and design company, focused on delivering robust functionality and appealing design for websites. Our aim is to ensure that all customer needs are met with high-quality solutions and seamless user experiences. Whether it's front-end design or back-end development, we work to create solutions that are both practical and visually compelling.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <div className="service" data-aos="zoom-in">
          <div className="title">
            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
              Our Services
            </motion.h2>
          </div>

          <div className="box">
            <motion.div
              className="card"
              data-aos="fade-up"
              data-aos-delay="200"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <FontAwesomeIcon icon={faLaptopCode} size="3x" className="service-icon" />
              <h5>Web Development</h5>
              <div className="pra">
                <p>We specialize in creating custom websites including E-commerce, portfolios, and more.</p>
              </div>
            </motion.div>

            <motion.div
              className="card"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <FontAwesomeIcon icon={faCogs} size="3x" className="service-icon" />
              <h5>Software Development</h5>
              <div className="pra">
                <p>We develop efficient software applications for businesses including data entry and cashier systems.</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="contact-me">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Grow your business with us!
          </motion.p>
        </div>

        {/* Footer Section */}
        <footer data-aos="fade-up">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Co Develop
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            For any service, you can contact me.<br />
            <span>Tel:</span> +995511100247<br />
            <span>Email:</span> hassannassif.lb@gmail.com
          </motion.p>

          <motion.p
            className="end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            CopyRight By Co Develop
          </motion.p>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
};

export default Home;
