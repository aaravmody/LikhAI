import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

// Import icons
import { 
  DocumentTextIcon, 
  BookOpenIcon,
  MenuIcon,
  XIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/outline';

// Custom icons for features
const CollaborationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const EditorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TeamIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const Home = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <EditorIcon />,
      title: 'Rich Text Editor',
      description: 'Format your content with a powerful and intuitive editor that supports markdown, images, and more.',
    },
    {
      icon: <CollaborationIcon />,
      title: 'Collaborative Writing',
      description: 'Write and edit documents in real-time with your team. See changes as they happen with live cursors and comments.',
    },
    {
      icon: <TeamIcon />,
      title: 'Team Collaboration',
      description: 'Share documents seamlessly with fine-grained permissions, version history, and smart notifications.',
    },
  ];

  // Animation variants
  const navVariants = {
    visible: { 
      backgroundColor: isScrolled 
        ? (isDarkMode ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.85)') 
        : (isDarkMode ? 'rgba(17, 24, 39, 0)' : 'rgba(255, 255, 255, 0)'),
      backdropFilter: isScrolled ? 'blur(8px)' : 'blur(0px)',
      boxShadow: isScrolled 
        ? (isDarkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)') 
        : 'none',
      transition: { duration: 0.3 }
    }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      x: "0%",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const featureCardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -10,
      boxShadow: isDarkMode 
        ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
        : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Button hover animation
  const buttonHoverVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: isDarkMode 
        ? '0 10px 25px -5px rgba(79, 70, 229, 0.4)' 
        : '0 10px 25px -5px rgba(79, 70, 229, 0.3)',
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-indigo-50'} transition-colors duration-300`}>
      {/* Navigation */}
      <motion.nav 
        className={`fixed w-full z-50 transition-all duration-300`}
        variants={navVariants}
        animate="visible"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <motion.h1 
                className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-indigo-600'}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="font-extrabold">Likh</span>
                <span className="text-indigo-500">AI</span>
              </motion.h1>

              {/* Desktop Navigation Links */}
              <div className="hidden md:flex ml-10 space-x-8">
                <NavLink to="/features">Features</NavLink>
                <NavLink to="/pricing">Pricing</NavLink>
                <NavLink to="/tutorials">Tutorials</NavLink>
                <NavLink to="/about">About</NavLink>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-indigo-100 text-indigo-600'}`}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </motion.button>

              {/* Desktop CTA Buttons */}
              <div className="hidden md:flex items-center space-x-3">
                
                <motion.div
                  variants={buttonHoverVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    to="/dashboard"
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium shadow-md"
                  >
                    Dashboard
                  </Link>
                </motion.div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`p-2 rounded-md ${isDarkMode ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-black'}`}
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? 
                    <XIcon className="h-6 w-6" /> : 
                    <MenuIcon className="h-6 w-6" />
                  }
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className={`md:hidden fixed inset-0 z-40 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} pt-20`}
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
            >
              <div className="px-4 pt-2 pb-3 space-y-1 sm:px-3">
                <MobileNavLink to="/features" onClick={() => setMobileMenuOpen(false)}>Features</MobileNavLink>
                <MobileNavLink to="/pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</MobileNavLink>
                <MobileNavLink to="/tutorials" onClick={() => setMobileMenuOpen(false)}>Tutorials</MobileNavLink>
                <MobileNavLink to="/about" onClick={() => setMobileMenuOpen(false)}>About</MobileNavLink>
                <div className="pt-4 border-t border-gray-700">
                  <MobileNavLink to="/login" onClick={() => setMobileMenuOpen(false)}>Log in</MobileNavLink>
                  <Link 
                    to="/dashboard" 
                    className={`block rounded-md my-2 px-3 py-2 text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h1 
              className={`text-5xl md:text-6xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6 leading-tight`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Where AI meets your
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 pl-2">
                creative workflow
              </span>
            </motion.h1>

            <motion.p 
              className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-10 max-w-2xl mx-auto leading-relaxed`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              A modern collaborative writing platform that streamlines your creative process, enhances team collaboration, and brings your ideas to life.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div
                variants={buttonHoverVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-lg"
                >
                  Get Started
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 ml-2" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                    initial={{ x: 0 }}
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 1 }}
                  >
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </motion.svg>
                </Link>
              </motion.div>

              <motion.div
                variants={buttonHoverVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  to="/tutorials"
                  className={`w-full sm:w-auto inline-flex justify-center items-center px-8 py-4 border border-transparent text-base font-medium rounded-lg ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'} shadow-md`}
                >
                  <BookOpenIcon className="mr-2 h-5 w-5" />
                  Watch Demo
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Hero Image/Graphic */}
          <motion.div
            className="mt-20 relative max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className={`relative rounded-xl overflow-hidden shadow-2xl ${isDarkMode ? 'border border-gray-700' : ''}`}>
              {/* App screenshot/mockup placeholder */}
              <div className={`w-full aspect-video ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl flex items-center justify-center`}>
                <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <DocumentTextIcon className="h-20 w-20 mx-auto opacity-20" />
                  <p className="mt-2 font-medium">LikhAI Document Editor Preview</p>
                </div>
              </div>
              
              {/* Overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/20 to-transparent opacity-60"></div>
            </div>
          </motion.div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-20 right-0 w-72 h-72 bg-indigo-500 rounded-full filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl opacity-10"></div>
      </section>

      {/* Features Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-gray-900/50' : 'bg-indigo-50/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2 
              className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Powerful Features for Modern Writers
            </motion.h2>
            <motion.p 
              className={`mt-4 text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Everything you need to create, collaborate, and publish your best work
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                custom={index}
                variants={featureCardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, amount: 0.2 }}
                className={`${isDarkMode ? 'bg-gray-800/60 hover:bg-gray-800' : 'bg-white hover:bg-gray-50'} rounded-xl p-8 shadow-lg backdrop-blur-sm transition-colors duration-300`}
              >
                <div className="rounded-lg inline-flex items-center justify-center p-3 bg-indigo-600 bg-opacity-10 text-indigo-500 mb-5">
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`${isDarkMode ? 'bg-gradient-to-r from-indigo-800 to-purple-800' : 'bg-gradient-to-r from-indigo-600 to-indigo-500'} rounded-2xl shadow-xl overflow-hidden`}
          >
            <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  <span className="block">Ready to get started?</span>
                  <span className="block text-indigo-200">Try LikhAI free for 14 days.</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-indigo-100">
                  No credit card required. Full access to all features.
                </p>
              </div>
              <div className="mt-8 lg:mt-0 lg:flex-shrink-0">
                <motion.div
                  variants={buttonHoverVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 shadow-md"
                  >
                    Start Free Trial
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <span>Likh</span>
                <span className="text-indigo-500">AI</span>
              </h2>
              <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Your modern collaborative writing platform
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <FooterLink to="/terms">Terms</FooterLink>
              <FooterLink to="/privacy">Privacy</FooterLink>
              <FooterLink to="/help">Help</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
            </div>
          </div>
          <div className={`mt-8 pt-6 border-t ${isDarkMode ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-500'} text-center text-sm`}>
            &copy; {new Date().getFullYear()} LikhAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

// Navigation Link Component for desktop
const NavLink = ({ to, children }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <Link 
      to={to} 
      className={`text-base font-medium ${isDarkMode ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'} hover:underline underline-offset-4 decoration-indigo-500 decoration-2`}
    >
      {children}
    </Link>
  );
};

// Mobile Navigation Link Component
const MobileNavLink = ({ to, children, onClick }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <Link 
      to={to} 
      className={`block rounded-md px-3 py-2 text-base font-medium ${isDarkMode ? 'text-gray-200 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-black hover:bg-gray-100'}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

// Footer Link Component
const FooterLink = ({ to, children }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <Link 
      to={to} 
      className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} hover:underline`}
    >
      {children}
    </Link>
  );
};

export default Home;