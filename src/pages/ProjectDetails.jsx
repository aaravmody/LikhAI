import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          {/* Project Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={handleCreateDocument}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                New Document
              </button>
            </div>
            {project.description && (
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                {project.description}
              </p>
            )}
          </div>

          {/* Documents List */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Documents
            </h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {documents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No documents yet.</p>
                <button
                  onClick={handleCreateDocument}
                  className="mt-4 text-indigo-600 hover:text-indigo-500"
                >
                  Create your first document
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc) => (
                  <Link
                    key={doc._id}
                    to={`/editor/${doc._id}`}
                    className="block bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {doc.title}
                    </h3>
                    {doc.description && (
                      <p className="text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                        {doc.description}
                      </p>
                    )}
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                      <span>Version {doc.version}</span>
                      <span>
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails; 