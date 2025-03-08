import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Collaborator } from '../../types/user';

interface CollaborationIndicatorProps {
  collaborators: Collaborator[];
  isLive: boolean;
}

const CollaborationIndicator: React.FC<CollaborationIndicatorProps> = ({ 
  collaborators, 
  isLive 
}) => {
  const { theme } = useTheme();

  return (
    <div className="flex items-center ml-4">
      {isLive && (
        <div className="flex items-center mr-3">
          <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></div>
          <span className={`text-xs ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>Live</span>
        </div>
      )}
      
      <div className="flex -space-x-2">
        {collaborators.length > 0 ? (
          collaborators.slice(0, 3).map((collaborator, idx) => (
            <div 
              key={idx}
              className="h-6 w-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs text-gray-600"
              title={collaborator.name}
            >
              {collaborator.name.charAt(0)}
            </div>
          ))
        ) : (
          <div 
            className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
          >
            Only you
          </div>
        )}
        {collaborators.length > 3 && (
          <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
            +{collaborators.length - 3}
          </div>
        )}
      </div>
      
      <button
        className={`ml-3 px-2 py-0.5 rounded text-xs ${
          theme === 'dark' 
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        }`}
      >
        Add collaborator
      </button>
    </div>
  );
};

export default CollaborationIndicator;