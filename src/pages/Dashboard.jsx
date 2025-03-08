import React, { useState, useEffect } from 'react';
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
  underreview: 'bg-purple-400'
};

const STATUS_LABELS = {
  todo: 'To Do',
  inprogress: 'In Progress',
  underreview: 'Under Review'
};

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [menuOpen, setMenuOpen] = useState(null); // Store the ID of the project with open menu
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

  useEffect(() => {
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
        setProjects([...projects, response.data.project]);
        navigate(`/project/${response.data.project._id}`);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setError(error.message || 'Failed to create project');
    }
  };

  const handleStatusChange = async (projectId, newStatus) => {
    try {
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
      setError(error.message || 'Failed to update project status');
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
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Projects</h1>
          <button
            onClick={handleCreateProject}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            New Project
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              All
            </button>
            {Object.entries(STATUS_LABELS).map(([status, label]) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  filter === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[status]}`} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No projects found.</p>
            <button
              onClick={handleCreateProject}
              className="mt-4 text-indigo-600 hover:text-indigo-500"
            >
              Create your first project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="group block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6 relative"
              >
                {/* Project Menu */}
                <div className="absolute top-4 right-4 project-menu">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(menuOpen === project._id ? null : project._id);
                    }}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <DotsVerticalIcon className="h-5 w-5 text-gray-500" />
                  </button>
                  
                  {menuOpen === project._id && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1">
                        <button
                          onClick={() => handleDeleteProject(project._id)}
                          className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                        >
                          <TrashIcon className="h-4 w-4 mr-2" />
                          Delete Project
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <Link to={`/project/${project._id}`}>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 pr-8">
                    {project.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                    {project.description || 'No description'}
                  </p>
                </Link>

                <div className="flex flex-col space-y-3">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                      project.status === 'todo' ? 'bg-yellow-100 text-yellow-800' :
                      project.status === 'inprogress' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[project.status || 'todo']}`} />
                      <select
                        value={project.status || 'todo'}
                        onChange={(e) => handleStatusChange(project._id, e.target.value)}
                        className="bg-transparent border-none focus:ring-0 p-0 pr-6 appearance-none cursor-pointer"
                        style={{ WebkitAppearance: 'none' }}
                      >
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value} className="text-gray-900">
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 