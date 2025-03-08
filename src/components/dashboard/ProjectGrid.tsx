import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Project } from '../../types/project';

interface ProjectGridProps {
  projects: Project[];
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects }) => {
  const { theme } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div 
          key={project.id}
          className={`rounded-lg overflow-hidden border ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
          } transition-all hover:shadow-md`}
        >
          <div className={`h-40 flex items-center justify-center ${
            project.type === 'screenplay' ? 'bg-blue-100' :
            project.type === 'poem' ? 'bg-purple-100' :
            project.type === 'essay' ? 'bg-yellow-100' :
            project.type === 'script' ? 'bg-green-100' :
            project.type === 'novel' ? 'bg-red-100' :
            'bg-gray-100'
          }`}>
            <span className="text-4xl text-gray-400">
              {project.type === 'screenplay' ? '🎬' :
               project.type === 'poem' ? '📝' :
               project.type === 'essay' ? '📄' :
               project.type === 'script' ? '📋' :
               project.type === 'novel' ? '📚' :
               '📘'}
            </span>
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-1 truncate">
              <Link to={`/editor/${project.id}`} className="hover:underline">
                {project.title}
              </Link>
            </h3>
            <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Last edited: {formatDate(project.lastEdited)}
            </p>
            
            <div className="flex gap-2 mb-3">
              {project.categories.map((category, idx) => (
                <span 
                  key={idx}
                  className={`text-xs px-2 py-1 rounded ${
                    theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {category}
                </span>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex -space-x-2">
                {project.collaborators.length > 0 ? (
                  project.collaborators.slice(0, 3).map((collaborator, idx) => (
                    <div 
                      key={idx}
                      className="h-6 w-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs text-gray-600"
                      title={collaborator.name}
                    >
                      {collaborator.name.charAt(0)}
                    </div>
                  ))
                ) : (
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Only you
                  </span>
                )}
                {project.collaborators.length > 3 && (
                  <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                    +{project.collaborators.length - 3}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Link 
                  to={`/editor/${project.id}`}
                  className={`text-xs px-2 py-1 rounded ${
                    theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                  } text-white transition-colors`}
                >
                  Edit
                </Link>
                <Link 
                  to={`/project/${project.id}`}
                  className={`text-xs px-2 py-1 rounded ${
                    theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  } transition-colors`}
                >
                  Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectGrid;