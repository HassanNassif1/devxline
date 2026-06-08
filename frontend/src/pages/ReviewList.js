import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CoDevelop from '../img/Co Develop.jpg';
import { useSpring, animated } from 'react-spring';
import '../styles/review.css';
import '../styles/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptopCode, faCogs, faUsers,faTimes,faBars } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence
const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    message: '',
  });
  const [status, setStatus] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  // Fetch reviews from the API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/reviews');
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, [reviews]);

  // Animation for the page
  const pageAnimation = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 300 },
  });

  // Animation for containers "falling from the sky" with jumping, shaking, and losing balance
  const containerAnimation = useSpring({
    opacity: 1,
    transform: 'translateY(0px)',
    scale: 1,
    rotate: '0deg',
    from: { opacity: 0, transform: 'translateY(-300px)', scale: 0.8, rotate: '40deg' }, // Starts above and slightly rotated
    to: { opacity: 1, transform: 'translateY(0px)', scale: 1, rotate: '0deg' }, // Ends at the original position, no rotation
    config: { tension: 300, friction: 60 }, // Makes the animation bouncy but smooth
  });

  // Animation for form container "falling" and shaking
  const formAnimation = useSpring({
    opacity: 1,
    transform: 'translateY(0px)',
    scale: 1,
    rotate: '0deg',
    from: { opacity: 0, transform: 'translateY(-300px)', scale: 0.8, rotate: '40deg' }, // Starts above and slightly rotated
    to: { opacity: 1, transform: 'translateY(0px)', scale: 1, rotate: '0deg' }, // Ends at the original position, no rotation
    config: { tension: 300, friction: 60 }, // Makes the animation bouncy but smooth
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRating = (rating) => {
    setFormData({
      ...formData,
      rating,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    
    try {
      const response = await axios.post('http://localhost:5001/api/submit', formData);
      setStatus('Review submitted successfully!');
      setFormData({ name: '', email: '', rating: 0, message: '' });
    } catch (error) {
      setStatus('Error submitting review.');
    }
  };

  return (
    <animated.div style={pageAnimation}>
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
                  <Link to="/reviews" className="active">Feedbacks</Link>
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
                  <Link to="/services">Services</Link>
                </motion.li>
                <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3 }}>
                  <Link to="/contact-us">Contact Us</Link>
                </motion.li>
                <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3 }}>
                  <Link to="/projects" >Projects</Link>
                </motion.li>
                <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3 }}>
                  <Link to="/reviews" className="active">Feedbacks</Link>
                </motion.li>
              </ul>
            </nav>

      <div className="review-container">
        {/* Review list container with falling, jumping, and losing balance */}
        <animated.div style={containerAnimation} className="review-list">
          <h2>Customer Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div className="review" key={review.id}>
                <h3>{review.name}</h3>
                <p className="review-rating">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
                <p>{review.message}</p>
                <p className="review-date">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </animated.div>

        {/* Review form container with falling, jumping, and losing balance */}
        <animated.div style={{ ...containerAnimation, ...formAnimation }} className="review-form-container">
          <h2>Submit Your Review</h2>

          <form onSubmit={handleSubmit}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Rating:</label>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${formData.rating >= star ? 'filled' : ''}`}
                    onClick={() => handleRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label>Message:</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <div className='Submit-Container'>
            <button type="submit">Submit Review</button></div>
            {status && <p>{status}</p>}
          </form>
        </animated.div>
      </div>
    </animated.div>
  );
};

export default ReviewList;
