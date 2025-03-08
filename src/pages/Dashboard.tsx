import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useProjects } from '../contexts/ProjectContext';
import IconButton from '../components/common/IconButton';
import ProjectGrid from '../components/dashboard/ProjectGrid';
import CategoryFilter from '../components/dashboard/CategoryFilter';
import Modal from '../components/common/Modal';

const Dashboard: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { projects, addProject } = useProjects();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectType, setNewProjectType] = useState('story');
  const navigate = useNavigate();

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      const newId = `project-${Date.now()}`;
      addProject({
        id: newId,
        title: newProjectName,
        type: newProjectType,
        lastEdited: new Date().toISOString(),
        collaborators: [],
        categories: [newProjectType],
      });
      setShowNewProjectModal(false);
      setNewProjectName('');
      // Navigate to the new project's editor
      navigate(`/editor/${newId}`);
    }
  };

  const filterProjects = () => {
    if (selectedCategories.length === 0) return projects;
    return projects.filter(project => 
      project.categories.some(category => selectedCategories.includes(category))
    );
  };

  const availableCategories = ['story', 'screenplay', 'poem', 'essay', 'script', 'novel'];

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`py-4 px-6 flex justify-between items-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <div className="flex items-center">
          <h1 className="text-2xl font-bold mr-8">StoryForge</h1>
          <nav className="hidden md:flex space-x-6">
            <Link to="/dashboard" className="font-medium border-b-2 border-blue-500 pb-1">Projects</Link>
            <Link to="#" className="font-medium text-gray-500 hover:text-current">Templates</Link>
            <Link to="#" className="font-medium text-gray-500 hover:text-current">Resources</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <IconButton
            icon={theme === 'dark' ? '/assets/icons/light-mode.svg' : '/assets/icons/dark-mode.svg'}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          />
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            U
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">My Projects</h2>
          <button
            className={`px-4 py-2 rounded-md font-medium ${
              theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            } text-white transition-colors`}
            onClick={() => setShowNewProjectModal(true)}
          >
            New Project
          </button>
        </div>

        <div className="mb-6">
          <CategoryFilter 
            categories={availableCategories}
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
          />
        </div>

        {projects.length > 0 ? (
          <ProjectGrid projects={filterProjects()} />
        ) : (
          <div className={`text-center py-16 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
            <h3 className="text-xl font-medium mb-2">No projects yet</h3>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Create your first project to get started
            </p>
            <button
              className={`px-4 py-2 rounded-md font-medium ${
                theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-colors`}
              onClick={() => setShowNewProjectModal(true)}
            >
              Create Project
            </button>
          </div>
        )}
      </main>

      {/* New Project Modal */}
      <Modal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        title="Create New Project"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="project-name" className="block text-sm font-medium mb-1">
              Project Name
            </label>
            <input
              type="text"
              id="project-name"
              className={`w-full px-3 py-2 rounded-md border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>
          <div>
            <label htmlFor="project-type" className="block text-sm font-medium mb-1">
              Project Type
            </label>
            <select
              id="project-type"
              className={`w-full px-3 py-2 rounded-md border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              value={newProjectType}
              onChange={(e) => setNewProjectType(e.target.value)}
            >
              <option value="story">Story</option>
              <option value="screenplay">Screenplay</option>
              <option value="poem">Poem</option>
              <option value="essay">Essay</option>
              <option value="script">Script</option>
              <option value="novel">Novel</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              className={`px-4 py-2 rounded-md ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
              onClick={() => setShowNewProjectModal(false)}
            >
              Cancel
            </button>
            <button
              className={`px-4 py-2 rounded-md font-medium ${
                theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-colors`}
              onClick={handleCreateProject}
            >
              Create
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;