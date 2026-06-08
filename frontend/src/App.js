import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AboutUs from './pages/AboutUs';
import Home from './pages/Home';
import Services from './pages/Services';
import ContactUs from './pages/ContactUs';
import Projects from './pages/Projects';
import ReviewList from './pages/ReviewList';
import CategoriesList from './pages/CategoriesList';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import CreateAppointment from './pages/CreateAppointmentForm';

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,  // Smooth animation timing
      once: false,      // Repeats animation on scroll
      easing: 'ease-in-out',
    });
  }, []);

  return (
    <Router>
      <TransitionGroup>
        <Routes>
          <Route
            path="/"
            element={
              <CSSTransition timeout={300} classNames="slide" key="home">
                <Home />
              </CSSTransition>
            }
          />
          <Route
            path="/about-us"
            element={
              <CSSTransition timeout={300} classNames="slide" key="about-us">
                <AboutUs />
              </CSSTransition>
            }
          />
          <Route
            path="/services"
            element={
              <CSSTransition timeout={300} classNames="slide" key="services">
                <Services />
              </CSSTransition>
            }
          />
            <Route
            path="/create-appointment"
            element={
              <CSSTransition timeout={300} classNames="slide" key="services">
                <CreateAppointment />
              </CSSTransition>
            }
          />
          <Route
            path="/contact-us"
            element={
              <CSSTransition timeout={300} classNames="slide" key="contact-us">
                <ContactUs />
              </CSSTransition>
            }
          />
          <Route
            path="/projects"
            element={
              <CSSTransition timeout={300} classNames="slide" key="projects">
                <Projects />
              </CSSTransition>
            }
          />
          <Route
            path="/reviews"
            element={
              <CSSTransition timeout={300} classNames="slide" key="reviews">
                <ReviewList />
              </CSSTransition>
            }
          />
          <Route
            path="/categories"
            element={
              <CSSTransition timeout={300} classNames="slide" key="categories">
                <CategoriesList />
              </CSSTransition>
            }
          />
        </Routes>
      </TransitionGroup>
    </Router>
  );
};

export default App;
