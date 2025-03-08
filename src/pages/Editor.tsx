import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useProjects } from '../contexts/ProjectContext';
import Sidebar from '../components/common/Sidebar';
import EditorToolbar from '../components/editor/EditorToolbar';
import CollaborationIndicator from '../components/editor/CollaborationIndicator';
import EditorContainer from '../components/editor/EditorContainer';
import CommentsPanel from '../components/collaboration/CommentsPanel';
import VersionHistory from '../components/collaboration/VersionHistory';
import StoryboardPanel from '../components/storytelling/StoryboardPanel';
import VisualCuesToolbar from '../components/storytelling/VisualCuesToolbar';
import PoeticAnalysisPanel from '../components/storytelling/PoeticAnalysisPanel';
import SceneGenerator from '../components/storytelling/SceneGenerator';
import IconButton from '../components/common/IconButton';

const Editor: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects } = useProjects();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [showComments, setShowComments] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showStoryboard, setShowStoryboard] = useState(false);
  const [showPoeticAnalysis, setShowPoeticAnalysis] = useState(false);
  const [showSceneGenerator, setShowSceneGenerator] = useState(false);
  
  const project = projects.find(p => p.id === projectId);
  
  if (!project) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3">Project not found</h2>
          <p className="mb-4">The project you're looking for doesn't exist or has been deleted.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className={`px-4 py-2 rounded-md font-medium ${
              theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            } text-white transition-colors`}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  const togglePanel = (panel: string) => {
    switch (panel) {
      case 'comments':
        setShowComments(!showComments);
        if (!showComments) {
          setShowVersionHistory(false);
          setShowStoryboard(false);
          setShowPoeticAnalysis(false);
          setShowSceneGenerator(false);
        }
        break;
      case 'versions':
        setShowVersionHistory(!showVersionHistory);
        if (!showVersionHistory) {
          setShowComments(false);
          setShowStoryboard(false);
          setShowPoeticAnalysis(false);
          setShowSceneGenerator(false);
        }
        break;
      case 'storyboard':
        setShowStoryboard(!showStoryboard);
        if (!showStoryboard) {
          setShowComments(false);
          setShowVersionHistory(false);
          setShowPoeticAnalysis(false);
          setShowSceneGenerator(false);
        }
        break;
      case 'poetic':
        setShowPoeticAnalysis(!showPoeticAnalysis);
        if (!showPoeticAnalysis) {
          setShowComments(false);
          setShowVersionHistory(false);
          setShowStoryboard(false);
          setShowSceneGenerator(false);
        }
        break;
      case 'scene':
        setShowSceneGenerator(!showSceneGenerator);
        if (!showSceneGenerator) {
          setShowComments(false);
          setShowVersionHistory(false);
          setShowStoryboard(false);
          setShowPoeticAnalysis(false);
        }
        break;
      default:
        break;
    }
  };
  
  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`py-3 px-6 flex justify-between items-center border-b ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
    }`}>
      <div className="flex items-center">
        <button 
          onClick={() => navigate('/dashboard')}
          className={`mr-4 text-sm font-medium ${
            theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-xl font-semibold truncate max-w-xs">{project.title}</h1>
        <CollaborationIndicator 
          collaborators={project.collaborators} 
          isLive={true} 
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          className={`px-3 py-1.5 text-sm rounded-md ${
            theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
          } transition-colors`}
        >
          Save
        </button>
        <button
          className={`px-3 py-1.5 text-sm rounded-md ${
            theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
          } text-white transition-colors`}
        >
          Export
        </button>
        <IconButton
          icon={theme === 'dark' ? '/assets/icons/light-mode.svg' : '/assets/icons/dark-mode.svg'}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        />
      </div>
    </header>

    <div className="flex-1 flex">
      {/* Left sidebar with tools */}
      <Sidebar position="left" theme={theme}>
        <IconButton 
          icon="/assets/icons/comment.svg"
          onClick={() => togglePanel('comments')}
          isActive={showComments}
          label="Comments"
        />
        <IconButton 
          icon="/assets/icons/history.svg"
          onClick={() => togglePanel('versions')}
          isActive={showVersionHistory}
          label="Version History"
        />
        <IconButton 
          icon="/assets/icons/storyboard.svg"
          onClick={() => togglePanel('storyboard')}
          isActive={showStoryboard}
          label="Storyboard"
        />
        <IconButton 
          icon="/assets/icons/export.svg"
          onClick={() => togglePanel('poetic')}
          isActive={showPoeticAnalysis}
          label="Poetic Analysis"
        />
        <IconButton 
          icon="/assets/icons/collaborator.svg"
          onClick={() => togglePanel('scene')}
          isActive={showSceneGenerator}
          label="Scene Generator"
        />
      </Sidebar>

      {/* Main editor area */}
      <div className="flex-1 flex flex-col">
        <EditorToolbar />
        <VisualCuesToolbar />
        <EditorContainer />
      </div>

      {/* Right sidebar panels */}
      {showComments && (
        <div className={`w-80 border-l ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <CommentsPanel />
        </div>
      )}
      
      {showVersionHistory && (
        <div className={`w-80 border-l ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <VersionHistory />
        </div>
      )}
      
      {showStoryboard && (
        <div className={`w-96 border-l ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <StoryboardPanel />
        </div>
      )}
      
      {showPoeticAnalysis && (
        <div className={`w-80 border-l ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <PoeticAnalysisPanel />
        </div>
      )}
      
      {showSceneGenerator && (
        <div className={`w-96 border-l ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <SceneGenerator />
        </div>
      )}
    </div>
  </div>
);
};

export default Editor;