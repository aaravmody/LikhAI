import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PencilAltIcon, DocumentTextIcon, UserGroupIcon } from '@heroicons/react/outline';
import { useTheme } from '../contexts/ThemeContext';

const Home = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const features = [
    {
      icon: <PencilAltIcon className="h-6 w-6" />,
      title: 'Collaborative Writing',
      description: 'Write and edit documents in real-time with your team.',
    },
    {
      icon: <DocumentTextIcon className="h-6 w-6" />,
      title: 'Rich Text Editor',
      description: 'Format your content with a powerful and intuitive editor.',
    },
    {
      icon: <UserGroupIcon className="h-6 w-6" />,
      title: 'Team Collaboration',
      description: 'Share and collaborate on documents seamlessly.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">LikhAI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
              >
                {isDarkMode ? '🌞' : '🌙'}
              </button>
              <Link
                to="/dashboard"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to{' '}
            <span className="text-indigo-600 dark:text-indigo-400">LikhAI</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Your modern collaborative writing platform powered by AI
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/editor/new"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg"
            >
              Start Writing
              <PencilAltIcon className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="relative p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
            >
              <div className="absolute -top-4 left-6">
                <span className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-md shadow-lg">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="text-white"
                  >
                    {feature.icon}
                  </motion.div>
                </span>
              </div>
              <h3 className="mt-8 text-xl font-medium text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Home; 