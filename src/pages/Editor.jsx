import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChatAlt2Icon, ChartBarIcon } from '@heroicons/react/outline';
import Navbar from '../components/Navbar';
import LikhAIEditor from '../components/LikhAIEditor';
import CommentSidebar from '../components/CommentSidebar';
import AIAnalysisSidebar from '../components/AIAnalysisSidebar';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState({
    title: 'Untitled Document',
    content: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [isCommentSidebarOpen, setIsCommentSidebarOpen] = useState(false);
  const [isAIAnalysisSidebarOpen, setIsAIAnalysisSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      if (id === 'new') return setLoading(false);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.post(`${API_BASE_URL}/get-document`, {
          token,
          documentId: id
        });

        if (response.data.success) {
          setDocument(response.data.document);
          setProjectId(response.data.document.projectId);
        }
      } catch (error) {
        console.error('Error fetching document:', error);
        setError(error.response?.data?.message || 'Failed to fetch document');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const handleSave = async (editorContent) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (id === 'new') {
        const response = await axios.post(`${API_BASE_URL}/create-document`, {
          token,
          title: document.title,
          description: document.description,
          content: editorContent,
          projectId
        });

        if (response.data.success) {
          navigate(`/editor/${response.data.document._id}`);
        }
      } else {
        await axios.post(`${API_BASE_URL}/update-document`, {
          token,
          documentId: id,
          title: document.title,
          description: document.description,
          content: editorContent
        });
      }
    } catch (error) {
      console.error('Error saving document:', error);
      setError(error.response?.data?.message || 'Failed to save document');
    } finally {
      setSaving(false);
    }
  };

  const handleTitleChange = (newTitle) => {
    setDocument(prev => ({
      ...prev,
      title: newTitle
    }));
    document.title = `${newTitle} - LikhAI`;
  };

  const handleProjectSelect = async (selectedProjectId) => {
    setProjectId(selectedProjectId);
    await handleSave(document.content);
  };

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
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="relative">
          <LikhAIEditor
            initialContent={document.content}
            onSave={handleSave}
            onTitleChange={handleTitleChange}
            initialTitle={document.title}
            isSaving={saving}
            documentId={id === 'new' ? null : id}
          />

          {id !== 'new' && (
            <>
              <div className="fixed right-4 top-24 z-50 space-y-4">
                <button
                  onClick={() => {
                    setIsCommentSidebarOpen(!isCommentSidebarOpen);
                    setIsAIAnalysisSidebarOpen(false);
                  }}
                  className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors block"
                >
                  <ChatAlt2Icon className="h-6 w-6" />
                </button>

                <button
                  onClick={() => {
                    setIsAIAnalysisSidebarOpen(!isAIAnalysisSidebarOpen);
                    setIsCommentSidebarOpen(false);
                  }}
                  className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors block"
                >
                  <ChartBarIcon className="h-6 w-6" />
                </button>
              </div>

              <CommentSidebar
                isOpen={isCommentSidebarOpen}
                onClose={() => setIsCommentSidebarOpen(false)}
                documentId={id}
              />

              <AIAnalysisSidebar
                isOpen={isAIAnalysisSidebarOpen}
                onClose={() => setIsAIAnalysisSidebarOpen(false)}
                documentContent={document.content}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor; 