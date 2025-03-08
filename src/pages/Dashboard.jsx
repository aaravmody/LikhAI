import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { TrashIcon, DotsVerticalIcon } from '@heroicons/react/outline';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const STATUS_COLORS = {
  todo: 'bg-yellow-400',
  inprogress: 'bg-blue-400',
  underreview: 'bg-purple-400',
  completed: 'bg-green-400'
};

const STATUS_LABELS = {
  todo: 'To Do',
  inprogress: 'In Progress',
  underreview: 'Under Review',
  completed: 'Completed'
};

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [menuOpen, setMenuOpen] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(null);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.project-menu')) {
        setMenuOpen(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.post(`${API_BASE_URL}/fetch-projects`, { token });
        setProjects(response.data.projects || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError(error.message || 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(`${API_BASE_URL}/create-project`, {
        token,
        title: 'Untitled Project',
        description: '',
        status: 'todo'
      });

      if (response.data.success) {
        const newProject = response.data.project;
        setProjects([...projects, newProject]);
        // Navigate to new document creation with project ID
        navigate('/editor/new', { state: { projectId: newProject._id } });
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setError(error.message || 'Failed to create project');
    }
  };

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      setStatusUpdateLoading(projectId);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(`${API_BASE_URL}/update-project`, {
        token,
        projectId,
        status: newStatus
      });

      if (response.data.success) {
        setProjects(projects.map(project => 
          project._id === projectId 
            ? { ...project, status: newStatus }
            : project
        ));
      }
    } catch (error) {
      console.error('Error updating project status:', error);
      setError('Failed to update project status. Please try again.');
      await fetchProjects();
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(`${API_BASE_URL}/delete-project`, {
        token,
        projectId
      });

      if (response.data.success) {
        setProjects(projects.filter(project => project._id !== projectId));
        setMenuOpen(null);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      setError(error.message || 'Failed to delete project');
    }
  };

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.status === filter;
  }).sort((a, b) => {
    const statusPriority = {
      todo: 1,
      inprogress: 2,
      underreview: 3,
      completed: 4
    };
    if (a.status !== b.status) {
      return statusPriority[a.status] - statusPriority[b.status];
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const buttonHoverVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      boxShadow: isDarkMode 
        ? '0 10px 25px -5px rgba(79, 70, 229, 0.4)' 
        : '0 10px 25px -5px rgba(79, 70, 229, 0.3)',
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  const ProjectCard = ({ project }) => {
    const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
    const statusMenuRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (statusMenuRef.current && !statusMenuRef.current.contains(event.target)) {
          setIsStatusMenuOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <motion.div
        variants={buttonHoverVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        className={`relative rounded-xl shadow-lg overflow-hidden ${
          isDarkMode ? 'bg-gray-800/60 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <Link to={`/project/${project._id}`} className="block p-6">
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {project.title}
          </h3>
          <p className={`text-sm mb-4 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {project.description || 'No description'}
          </p>
        </Link>

        <div className="absolute top-4 right-4 z-20">
          <div className="relative project-menu" ref={statusMenuRef}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsStatusMenuOpen(!isStatusMenuOpen);
              }}
              className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${STATUS_COLORS[project.status]} shadow-sm hover:opacity-90 transition-opacity`}
            >
              <span>{STATUS_LABELS[project.status]}</span>
              <svg
                className={`w-4 h-4 ml-1.5 transform transition-transform ${isStatusMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <AnimatePresence>
              {isStatusMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 z-50 ${
                    isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}
                  style={{ transform: 'translateY(0)', zIndex: 100 }}
                >
                  {Object.entries(STATUS_LABELS).map(([status, label]) => (
                    <button
                      key={status}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleStatusChange(project._id, status);
                        setIsStatusMenuOpen(false);
                      }}
                      disabled={statusUpdateLoading === project._id}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        isDarkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                      } flex items-center space-x-2 transition-colors`}
                    >
                      <span className={`w-3 h-3 rounded-full ${STATUS_COLORS[status]}`}></span>
                      <span>{label}</span>
                      {project.status === status && (
                        <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className={`px-6 py-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Created {new Date(project.createdAt).toLocaleDateString()}
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-indigo-50 via-white to-gray-50'} transition-colors duration-300`}>
      <Navbar />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-500 rounded-full filter blur-3xl opacity-5"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-500 rounded-full filter blur-3xl opacity-5"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="flex justify-between items-center mb-12"
        >
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            My Projects
          </h1>
          <motion.button
            variants={buttonHoverVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            onClick={handleCreateProject}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200"
          >
            New Project
          </motion.button>
        </motion.div>

        <AnimatePresence>
        {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`${isDarkMode ? 'bg-red-900/20 border-red-800 text-red-200' : 'bg-red-50 border-red-200 text-red-600'} border px-4 py-3 rounded-lg mb-6`}
            >
            {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md'
                  : isDarkMode
                    ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                    : 'bg-white/90 text-gray-700 hover:bg-gray-100/90'
              }`}
            >
              All
            </motion.button>
            {Object.entries(STATUS_LABELS).map(([status, label]) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(status)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  filter === status
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md'
                    : isDarkMode
                      ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                      : 'bg-white/90 text-gray-700 hover:bg-gray-100/90'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[status]}`} />
                <span>{label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 