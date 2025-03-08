import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProject } from '../contexts/ProjectContext';
import { useTheme } from '../contexts/ThemeContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const { projects, updateProject } = useProject();
  const { isDarkMode, toggleTheme } = useTheme();
  const [showExportOptions, setShowExportOptions] = useState(false);

  const project = projects.find(p => p.id === parseInt(id));

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

  const handleUpdateProject = (updates) => {
    updateProject(project.id, updates);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/dashboard"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ← Back to Dashboard
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

      {/* Project Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Last modified: {new Date(project.lastModified).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-4">
                <Link
                  to={`/editor`}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Open in Editor
                </Link>
                <button
                  onClick={() => setShowExportOptions(!showExportOptions)}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Description
                </h2>
                <textarea
                  value={project.description || ''}
                  onChange={(e) => handleUpdateProject({ description: e.target.value })}
                  className="w-full h-32 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Add a description..."
                />
              </div>

              {/* Statistics */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Statistics
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <StatItem label="Category" value={project.category} />
                  <StatItem label="Created" value={new Date(project.createdAt).toLocaleDateString()} />
                  <StatItem label="Words" value="0" />
                  <StatItem label="Characters" value="0" />
                </div>
              </div>
            </div>
          </div>

          {/* Export Options Modal */}
          {showExportOptions && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Export Options
                </h2>
                <div className="space-y-4">
                  <ExportOption icon="📄" format="PDF" />
                  <ExportOption icon="📱" format="EPUB" />
                  <ExportOption icon="🎬" format="Script Format" />
                  <ExportOption icon="📱" format="Social Media" />
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowExportOptions(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, value }) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-gray-500 dark:text-gray-400">{label}</span>
    <span className="font-medium text-gray-900 dark:text-white">{value}</span>
  </div>
);

const ExportOption = ({ icon, format }) => (
  <button className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
    <span className="text-2xl mr-3">{icon}</span>
    <span className="text-gray-900 dark:text-white">{format}</span>
  </button>
);

export default ProjectDetails; 