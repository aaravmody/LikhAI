import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const VisualCuesToolbar: React.FC = () => {
  const { theme } = useTheme();
  
  const cueTypes = [
    { id: 'scene', label: 'Scene', icon: '🎬' },
    { id: 'setting', label: 'Setting', icon: '🏙️' },
    { id: 'action', label: 'Action', icon: '🏃' },
    { id: 'dialogue', label: 'Dialogue', icon: '💬' },
    { id: 'transition', label: 'Transition', icon: '→' },
    { id: 'sound', label: 'Sound', icon: '🔊' },
    { id: 'camera', label: 'Camera', icon: '📷' },
  ];

  return (
    <div className={`border-b ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center px-4 py-1">
        <div className={`text-sm mr-3 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Visual Cues:
        </div>
        {cueTypes.map((cue) => (
          <button
            key={cue.id}
            title={cue.label}
            className={`px-2 py-1 mx-1 rounded text-sm flex items-center ${
              theme === 'dark' 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <span className="mr-1">{cue.icon}</span>
            <span>{cue.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VisualCuesToolbar;