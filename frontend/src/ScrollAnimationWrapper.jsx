import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { 
  Terminal, 
  Globe, 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  BarChart3, 
  Code2, 
  Users,
  Play,
  Star,
  Layout,
  TrendingUp,
  ShoppingCart,
  Headphones,
  Award,
  ThumbsUp,
  Clock,
  Server,
  Cloud,
  Lock,
  Database,
  GitBranch,
  Rocket,
  Layers,
  Activity,
  Workflow,
  Shield
} from 'lucide-react';
import tech from './img/tech.png';

export const useScrollAnimation = (threshold = 0.2) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: false,
    threshold: threshold,
    margin: "-50px 0px -50px 0px"
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [isInView, controls]);

  return { ref, controls, isInView };
};

// Main scroll animation component
export const ScrollAnimationWrapper = ({ children, animationType = 'slideUp', delay = 0, className = '' }) => {
  const { ref, controls } = useScrollAnimation(0.15);

  const animations = {
    slideUp: {
      hidden: { 
        y: 80, 
        opacity: 0,
        rotateX: 15,
        scale: 0.95
      },
      visible: { 
        y: 0, 
        opacity: 1,
        rotateX: 0,
        scale: 1,
        transition: {
          type: "spring",
          damping: 20,
          stiffness: 100,
          delay: delay,
          duration: 0.8
        }
      }
    },
    slideLeft: {
      hidden: { 
        x: -120, 
        opacity: 0,
        rotateY: -20,
        scale: 0.9
      },
      visible: { 
        x: 0, 
        opacity: 1,
        rotateY: 0,
        scale: 1,
        transition: {
          type: "spring",
          damping: 25,
          stiffness: 80,
          delay: delay,
          duration: 0.9
        }
      }
    },
    slideRight: {
      hidden: { 
        x: 120, 
        opacity: 0,
        rotateY: 20,
        scale: 0.9
      },
      visible: { 
        x: 0, 
        opacity: 1,
        rotateY: 0,
        scale: 1,
        transition: {
          type: "spring",
          damping: 25,
          stiffness: 80,
          delay: delay,
          duration: 0.9
        }
      }
    },
    scale: {
      hidden: { 
        scale: 0.7, 
        opacity: 0,
        rotate: -5
      },
      visible: { 
        scale: 1, 
        opacity: 1,
        rotate: 0,
        transition: {
          type: "spring",
          damping: 15,
          stiffness: 120,
          delay: delay,
          duration: 0.7
        }
      }
    },
    flip: {
      hidden: { 
        rotateY: 90, 
        opacity: 0,
        scale: 0.8
      },
      visible: { 
        rotateY: 0, 
        opacity: 1,
        scale: 1,
        transition: {
          type: "spring",
          damping: 20,
          stiffness: 100,
          delay: delay,
          duration: 0.9
        }
      }
    },
    bounceUp: {
      hidden: { 
        y: 100, 
        opacity: 0,
        scale: 0.9
      },
      visible: { 
        y: 0, 
        opacity: 1,
        scale: 1,
        transition: {
          type: "spring",
          damping: 10,
          stiffness: 150,
          delay: delay,
          duration: 0.8
        }
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={animations[animationType] || animations.slideUp}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Staggered children component for grid items
export const StaggerContainer = ({ children, staggerDelay = 0.15, className = '' }) => {
  const { ref, controls } = useScrollAnimation(0.1);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.2
          }
        }
      }}
      className={className}
    >
      {React.Children.map(children, (child) => (
        <motion.div
          variants={{
            hidden: { 
              y: 60, 
              opacity: 0,
              scale: 0.9,
              rotateX: 10
            },
            visible: { 
              y: 0, 
              opacity: 1,
              scale: 1,
              rotateX: 0,
              transition: {
                type: "spring",
                damping: 20,
                stiffness: 100
              }
            }
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Parallax scroll effect
export const ParallaxSection = ({ children, speed = 0.5, className = '' }) => {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrollPosition = window.scrollY;
        const elementPosition = rect.top + scrollPosition;
        const distance = scrollPosition - elementPosition;
        setOffset(distance * speed);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${offset}px)`,
        transition: 'transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}
    >
      {children}
    </div>
  );
};

// Floating animation for elements
export const FloatAnimation = ({ children, duration = 3, distance = 20 }) => {
  return (
    <motion.div
      animate={{
        y: [0, -distance, 0],
        rotate: [0, 2, -2, 0]
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// Home component - Simplified like the reference site
// Home component - Simplified like the reference site
export const Home = () => {
  const features = [
    { 
      icon: <Activity size={28} />, 
      title: 'Real-Time Data Analytics', 
      desc: 'Powerful real-time analytics with instant insights and data visualization for better decision making.' 
    },
    { 
      icon: <Workflow size={28} />, 
      title: 'Advanced Workflow Automation', 
      desc: 'Streamline your workflows with intelligent automation and seamless integrations across platforms.' 
    },
    { 
      icon: <Shield size={28} />, 
      title: 'Secure Cloud Platform', 
      desc: 'Enterprise-grade security with end-to-end encryption, compliance, and zero-trust architecture.' 
    }
  ];

  const whyChoose = [
    { icon: <TrendingUp size={24} />, title: 'Increased Efficiency', desc: 'Streamline operations and boost productivity with automated workflows and intelligent systems.' },
    { icon: <Layers size={24} />, title: 'Scalability', desc: 'Scale your infrastructure seamlessly as your business grows without compromising performance.' },
    { icon: <Users size={24} />, title: 'Team Collaboration', desc: 'Empower teams with real-time collaboration tools and shared workspaces for better results.' }
  ];

  const trustedCompanies = ['TechCorp', 'FinServ', 'Global Solutions'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero Section - Split Layout with Image */}
      <section className="hero-sas-split">
        <div className="container hero-sas-split-container">
          {/* Left Column - Content */}
          <div className="hero-sas-split-left">
            <ScrollAnimationWrapper animationType="bounceUp">
              <div className="hero-sas-badge">
                <Terminal size={16} /> DevxLine v3.2
              </div>
              <h1 className="hero-sas-title">
                Accelerate Business Growth with <br />
                <span className="gradient-text">Powerful Cloud Analytics</span>
              </h1>
              <p className="hero-sas-description">
                Unlock Insights, Streamline Workflows, and Drive Performance with Our Secure Cloud Platform.
              </p>
              <div className="hero-sas-actions">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-sas-primary">
                  Start Your Free Trial <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                </motion.button>
              </div>
              <div className="hero-sas-stats">
                <div className="stat-item">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Clients</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">Satisfaction</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Support</span>
                </div>
              </div>
            </ScrollAnimationWrapper>
          </div>

          {/* Right Column - Image */}
          <div className="hero-sas-split-right">
            <ScrollAnimationWrapper animationType="scale" delay={0.3}>
              <div >
                <img src={tech} alt="DevxLine Technology" className="hero-sas-image" />
            
              
              
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Features Section - 3 Column Grid */}
      <section className="features-sas">
        <div className="container">
          <StaggerContainer staggerDelay={0.15} className="features-sas-grid">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -10 }}
                className="feature-sas-card"
              >
                <div className="feature-sas-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-sas">
        <div className="container">
          <ScrollAnimationWrapper animationType="slideUp" delay={0.1}>
            <div className="why-sas-header">
              <h2 className="gradient-text">Why Choose Us?</h2>
            </div>
          </ScrollAnimationWrapper>

          <StaggerContainer staggerDelay={0.15} className="why-sas-grid">
            {whyChoose.map((item, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="why-sas-card"
              >
                <div className="why-sas-icon">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="trusted-sas">
        <div className="container">
          <p className="trusted-sas-label">Trusted By</p>
          <div className="trusted-sas-logos">
            {trustedCompanies.map((company, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.05 }}
                className="trusted-sas-logo"
              >
                {company}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-sas">
        <div className="container">
          <ScrollAnimationWrapper animationType="bounceUp" delay={0.2}>
            <div className="cta-sas-content">
              <h2>Ready to Transform Your <br /><span>Business?</span></h2>
              <p>Get started with DevxLine today and experience the future of cloud infrastructure.</p>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-cta-sas">
                Start Your Free Trial <ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </motion.button>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>
    </motion.div>
  );
};


// About Page with Parallax
export const About = () => (
  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
    <ParallaxSection speed={0.3} className="container">
      <div className="feature-header">
        <h2 className="gradient-text" style={{ fontSize: '3.5rem' }}>The DevxLine Standard</h2>
        <p className="page-subtitle">Born from a need for better tools. We merged AI with enterprise-grade stability.</p>
      </div>
    </ParallaxSection>
    
    <ScrollAnimationWrapper animationType="flip" delay={0.3}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', padding: '2rem' }}>
        <div style={{ padding: '2rem', borderRadius: '24px', background: 'var(--bg-glass)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Engineered for Excellence</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.1rem' }}>DevxLine isn't just a platform. It is the operating system for your next big idea. We combine beautiful design with the raw power of modern cloud architecture.</p>
        </div>
        <FloatAnimation duration={4} distance={30}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '200px', height: '200px', borderRadius: '50%', background: 'var(--gradient-main)', boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '5rem', fontWeight: '900' }}>∞</div>
          </div>
        </FloatAnimation>
      </div>
    </ScrollAnimationWrapper>
  </motion.div>
);

// Services Page - Horizontal Grid Layout
export const Services = () => {
  const services = [
    { icon: <Code2 size={32} />, title: 'Smart APIs & Microservices', desc: 'Auto-generating GraphQL/REST with built-in rate limiting and versioning.' },
    { icon: <ShieldCheck size={32} />, title: 'Quantum Security Suite', desc: 'Real-time AI threat monitoring, DDoS shielding, and military-grade encryption.' },
    { icon: <Users size={32} />, title: 'Collaborative Dashboards', desc: 'Real-time collaborative tools for DevOps teams to monitor pipelines together.' },
  ];

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="container">
      <ScrollAnimationWrapper animationType="slideRight" delay={0.2}>
        <div className="feature-header">
          <h2 className="gradient-text" style={{ fontSize: '3.5rem' }}>Core Services</h2>
          <p className="page-subtitle">Every service is engineered to scale effortlessly with your business.</p>
        </div>
      </ScrollAnimationWrapper>
      
      <StaggerContainer staggerDelay={0.15} className="feature-grid">
        {services.map((s, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -10, scale: 1.03, rotate: i % 2 === 0 ? 1 : -1 }}
            className="feature-card"
          >
            <div className="feature-icon">{s.icon}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </motion.div>
        ))}
      </StaggerContainer>
    </motion.div>
  );
};

// Pricing Page - Horizontal Grid Layout
export const Plans = () => {
  const plans = [
    { name: 'Starter', price: '$19', features: ['1 Team Member', '10GB Storage', 'Basic Support'], popular: false },
    { name: 'Professional', price: '$49', features: ['5 Team Members', '100GB Storage', 'Priority 24/7 Support', 'Advanced Analytics'], popular: true },
    { name: 'Enterprise', price: 'Custom', features: ['Unlimited Users', 'Unlimited Storage', 'Dedicated Account Manager', 'Custom Contracts'], popular: false },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="container">
      <ScrollAnimationWrapper animationType="slideUp" delay={0.1}>
        <div className="feature-header">
          <h2 className="gradient-text" style={{ fontSize: '3.5rem' }}>Transparent Pricing</h2>
          <p className="page-subtitle">Scale up without hidden fees.</p>
        </div>
      </ScrollAnimationWrapper>
      
      <StaggerContainer staggerDelay={0.2} className="feature-grid">
        {plans.map((plan, i) => (
          <motion.div 
            key={i} 
            whileHover={{ 
              y: -15, 
              scale: 1.05,
              rotate: plan.popular ? 2 : 0,
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
            }}
            className="feature-card" 
            style={{ textAlign: 'center', padding: '3rem 2rem' }}
          >
            <h3 style={{ color: 'var(--text-secondary)' }}>{plan.name}</h3>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, margin: '1rem 0' }}>
              {plan.price} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>/ mo</span>
            </div>
            <ul style={{ listStyle: 'none', textAlign: 'left', margin: '2rem 0', color: 'var(--text-secondary)', lineHeight: 2.2 }}>
              {plan.features.map((f, j) => <li key={j}>✓ {f}</li>)}
            </ul>
            <motion.button 
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className={plan.popular ? "btn-primary" : "btn-secondary"} 
              style={{ width: '100%', padding: '0.8rem' }}
            >
              Get Started
            </motion.button>
          </motion.div>
        ))}
      </StaggerContainer>
    </motion.div>
  );
};

// Contact Page with Floating Elements
export const Contact = () => {
  const floatingEmojis = ['💬', '📧', '🐦', '🚀', '⚡', '🌟'];

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="container">
      <ScrollAnimationWrapper animationType="bounceUp" delay={0.2}>
        <div className="feature-header">
          <h2 className="gradient-text" style={{ fontSize: '3.5rem' }}>Get in Touch</h2>
          <p className="page-subtitle">Let's build something extraordinary together.</p>
        </div>
      </ScrollAnimationWrapper>
      
      <ScrollAnimationWrapper animationType="flip" delay={0.3}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', background: 'var(--bg-glass)', backdropFilter: 'blur(10px)', padding: '4rem', borderRadius: '30px', border: '1px solid var(--border-color)' }}>
          <div className="contact-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <motion.input 
              whileFocus={{ scale: 1.02 }}
              type="text" 
              placeholder="Your Name" 
              style={{ padding: '1.2rem', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'var(--bg-body)', color: 'var(--text-primary)', outline: 'none' }} 
            />
            <motion.input 
              whileFocus={{ scale: 1.02 }}
              type="email" 
              placeholder="Email Address" 
              style={{ padding: '1.2rem', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'var(--bg-body)', color: 'var(--text-primary)', outline: 'none' }} 
            />
            <motion.textarea 
              whileFocus={{ scale: 1.02 }}
              rows="5" 
              placeholder="Tell us about your project..." 
              style={{ padding: '1.2rem', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'var(--bg-body)', color: 'var(--text-primary)', outline: 'none', resize: 'none' }}
            ></motion.textarea>
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary" 
              style={{ width: '100%', padding: '1.2rem' }}
            >
              Send Message
            </motion.button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem' }}>
            <h3 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Contact Info</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}><strong>Email:</strong> hello@devxline.com</p>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}><strong>Phone:</strong> +1 (555) 123-4567</p>
            <div className="stats-row" style={{ marginTop: 0, padding: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {floatingEmojis.map((emoji, idx) => (
                <FloatAnimation key={idx} duration={3 + idx * 0.5} distance={15 + idx * 5}>
                  <span style={{ fontSize: '2rem' }}>{emoji}</span>
                </FloatAnimation>
              ))}
            </div>
          </div>
        </div>
      </ScrollAnimationWrapper>
    </motion.div>
  );
};

// Projects Page - Horizontal Grid Layout
export const Projects = () => {
  const projects = [
    { icon: <Zap size={32} />, title: 'E-Commerce Hub', desc: 'Scalable full-stack platform handling 10k+ daily transactions with live inventory.' },
    { icon: <BarChart3 size={32} />, title: 'SaaS Analytics', desc: 'Real-time dashboard for a subscription platform with AI-driven user behavior insights.' },
    { icon: <ShieldCheck size={32} />, title: 'Enterprise Vault', desc: 'Encryption tool built for financial institutions requiring military-grade security compliance.' }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container">
      <ScrollAnimationWrapper animationType="slideLeft" delay={0.2}>
        <div className="feature-header">
          <h2 className="gradient-text" style={{ fontSize: '3.5rem' }}>Latest Projects</h2>
          <p className="page-subtitle">Real-world applications built on the DevxLine ecosystem.</p>
        </div>
      </ScrollAnimationWrapper>
      
      <StaggerContainer staggerDelay={0.2} className="feature-grid">
        {projects.map((project, i) => (
          <motion.div 
            key={i}
            whileHover={{ 
              y: -15, 
              rotateY: i % 2 === 0 ? 5 : -5,
              scale: 1.03
            }}
            className="feature-card" 
            style={{ textAlign: 'center' }}
          >
            <div className="feature-icon" style={{ margin: '0 auto 1.5rem' }}>{project.icon}</div>
            <h3>{project.title}</h3>
            <p>{project.desc}</p>
          </motion.div>
        ))}
      </StaggerContainer>
    </motion.div>
  );
};

// Reviews Page - Horizontal Grid Layout
export const Reviews = () => {
  const reviews = [
    { name: 'Sarah J. (CTO)', text: '"DevxLine cut our deployment time by 60%. The integration was seamless!"' },
    { name: 'Michael R. (Lead Dev)', text: '"The security features gave us the peace of mind we needed for our cloud infrastructure."' },
    { name: 'Emily T. (PM)', text: '"The analytics dashboard is a game changer. A must-have for any SaaS."' }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="container">
      <ScrollAnimationWrapper animationType="scale" delay={0.1}>
        <div className="feature-header">
          <h2 className="gradient-text" style={{ fontSize: '3.5rem' }}>What our clients say</h2>
          <p className="page-subtitle">Trusted by developers and CTOs worldwide.</p>
        </div>
      </ScrollAnimationWrapper>
      
      <StaggerContainer staggerDelay={0.25} className="feature-grid">
        {reviews.map((review, i) => (
          <motion.div 
            key={i}
            whileHover={{ 
              y: -10, 
              scale: 1.05,
              rotate: i % 2 === 0 ? 2 : -2
            }}
            className="feature-card"
          >
            <h3>{review.name}</h3>
            <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>{review.text}</p>
          </motion.div>
        ))}
      </StaggerContainer>
    </motion.div>
  );
};