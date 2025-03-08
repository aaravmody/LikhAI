import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProject } from '../contexts/ProjectContext';
import { useTheme } from '../contexts/ThemeContext';

const Dashboard = () => {
  const { projects, addProject } = useProject();
  const { isDarkMode, toggleTheme } = useTheme();
  const [filter, setFilter] = useState('all');

  const handleCreateProject = () => {
    addProject({
      title: 'Untitled Project',
      description: '',
      category: 'draft',
      createdAt: new Date(),
      lastModified: new Date(),
    });
  };

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.category === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                LikhAI
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
              >
                {isDarkMode ? '🌞' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Projects</h1>
          <button
            onClick={handleCreateProject}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            New Project
          </button>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 mb-8">
          <FilterButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            All
          </FilterButton>
          <FilterButton
            active={filter === 'draft'}
            onClick={() => setFilter('draft')}
          >
            Drafts
          </FilterButton>
          <FilterButton
            active={filter === 'in-progress'}
            onClick={() => setFilter('in-progress')}
          >
            In Progress
          </FilterButton>
          <FilterButton
            active={filter === 'completed'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </FilterButton>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
};

const FilterButton = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg ${
      active
        ? 'bg-indigo-600 text-white'
        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`}
  >
    {children}
  </button>
);

const ProjectCard = ({ project }) => (
  <Link
    to={`/project/${project.id}`}
    className="block bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
  >
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {project.title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        {project.description || 'No description'}
      </p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(project.lastModified).toLocaleDateString()}
        </span>
        <span className="px-3 py-1 rounded-full text-sm bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
          {project.category}
        </span>
      </div>
    </div>
  </Link>
);

export default Dashboard; 