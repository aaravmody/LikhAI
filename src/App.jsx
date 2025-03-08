import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from './firebase-config';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import Home from './pages/Home';
import Editor from './pages/Editor';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';

function App() {
  useEffect(() => {
    signInAnonymously(auth).catch(console.error);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User signed in:', user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider>
      <ProjectProvider>
        <Router>
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200"
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/project/:id" element={<ProjectDetails />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </Router>
      </ProjectProvider>
    </ThemeProvider>
  );
}

export default App; 