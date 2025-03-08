import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserAddIcon, UserGroupIcon } from '@heroicons/react/outline';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useTheme } from '../contexts/ThemeContext';

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

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [collaboratorRole, setCollaboratorRole] = useState('viewer');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  const { isDarkMode } = useTheme();

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

  useEffect(() => {
    const fetchProjectAndDocuments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Fetch project details
        const projectResponse = await axios.post(`${API_BASE_URL}/fetch-projects`, { token });
        const foundProject = projectResponse.data.projects.find(p => p._id === id);
        if (!foundProject) {
          throw new Error('Project not found');
        }
        setProject(foundProject);

        // Fetch documents for this project
        const documentsResponse = await axios.post(`${API_BASE_URL}/get-user-documents`, { token });
        const projectDocuments = documentsResponse.data.documents.filter(doc => doc.projectId === id);
        setDocuments(projectDocuments);
      } catch (error) {
        console.error('Error fetching project details:', error);
        setError(error.response?.data?.message || 'Failed to fetch project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndDocuments();
  }, [id]);

  const handleCreateDocument = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(`${API_BASE_URL}/create-document`, {
        token,
        title: 'Untitled Document',
        content: '',
        projectId: id
      });

      if (response.data.success) {
        navigate(`/editor/${response.data.document._id}`);
      }
    } catch (error) {
      console.error('Error creating document:', error);
      setError(error.response?.data?.message || 'Failed to create document');
    }
  };

  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(`${API_BASE_URL}/add-collaborator`, {
        token,
        projectId: id,
        collaboratorEmail,
        role: collaboratorRole
      });

      if (response.data.success) {
        setProject(prev => ({
          ...prev,
          collaborators: response.data.collaborators
        }));
        setCollaboratorEmail('');
        setShowCollaboratorModal(false);
      }
    } catch (error) {
      console.error('Error adding collaborator:', error);
      setError(error.response?.data?.message || 'Failed to add collaborator');
    }
  };

  const handleRemoveCollaborator = async (email) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(`${API_BASE_URL}/remove-collaborator`, {
        token,
        projectId: id,
        collaboratorEmail: email
      });

      if (response.data.success) {
        setProject(prev => ({
          ...prev,
          collaborators: response.data.collaborators
        }));
      }
    } catch (error) {
      console.error('Error removing collaborator:', error);
      setError(error.response?.data?.message || 'Failed to remove collaborator');
    }
  };

  const handleUpdateProject = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(`${API_BASE_URL}/update-project`, {
        token,
        projectId: id,
        name: editedTitle
      });

      if (response.data.success) {
        setProject(prev => ({
          ...prev,
          title: editedTitle
        }));
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      setError(error.response?.data?.message || 'Failed to update project');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Project not found
          </h2>
          <Link
            to="/dashboard"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Return to Dashboard
          </Link>
        </div>
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
          className={`rounded-2xl shadow-xl overflow-hidden ${
            isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm'
          }`}
        >
          {/* Project Header */}
          <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex justify-between items-start">
              <div>
                <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {project?.title || 'Loading...'}
                </h1>
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {project?.description || 'No description'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${STATUS_COLORS[project?.status]} shadow-sm`}>
                  {STATUS_LABELS[project?.status]}
                </div>
                <motion.button
                  variants={buttonHoverVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleCreateDocument}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200"
                >
                  New Document
                </motion.button>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="p-8">
            <h2 className={`text-2xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Documents
            </h2>

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

            {documents.length === 0 ? (
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible" 
                className="text-center py-16"
              >
                <p className={`text-lg mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No documents yet
                </p>
                <motion.button
                  variants={buttonHoverVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleCreateDocument}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200"
                >
                  Create your first document
                </motion.button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {documents.map((doc) => (
                  <motion.div
                    key={doc._id}
                    variants={buttonHoverVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => navigate(`/editor/${doc._id}`)}
                    className={`rounded-xl shadow-lg overflow-hidden cursor-pointer ${
                      isDarkMode ? 'bg-gray-800/60 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
                    }`}
                  >
                    <div className="p-6">
                      <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {doc.title}
                      </h3>
                      {doc.description && (
                        <p className={`text-sm mb-4 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {doc.description}
                        </p>
                      )}
                      <div className={`flex justify-between items-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <span>Version {doc.version}</span>
                        <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Add Collaborator Modal */}
      {showCollaboratorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Add Collaborator
            </h3>
            <form onSubmit={handleAddCollaborator}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={collaboratorEmail}
                    onChange={(e) => setCollaboratorEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role
                  </label>
                  <select
                    value={collaboratorRole}
                    onChange={(e) => setCollaboratorRole(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCollaboratorModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails; 