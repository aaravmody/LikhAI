import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const EditorContainer: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`flex-1 overflow-auto p-6 ${
      theme === 'dark' ? 'bg-gray-850' : 'bg-gray-50'
    }`}>
      <div className={`max-w-4xl mx-auto p-8 rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'
      }`}>
        {/* Placeholder for text editor - will be replaced later */}
        <div className={`min-h-[600px] border border-dashed rounded p-4 ${
          theme === 'dark' ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-400'
        } flex items-center justify-center`}>
          <p className="text-center">
            Text editor will be integrated here.<br />
            Use the toolbar above and panels on the sides to enhance your writing experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditorContainer;