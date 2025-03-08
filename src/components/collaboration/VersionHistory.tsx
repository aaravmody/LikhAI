import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const VersionHistory: React.FC = () => {
  const { theme } = useTheme();
  
  // Sample versions data
  const versions = [
    {
      id: '1',
      label: 'Current Draft',
      author: 'You',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      changes: 'Minor edits to dialogue',
    },
    {
      id: '2',
      label: 'Revision 2',
      author: 'Emma Lee',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      changes: 'Added new scene',
    },
    {
      id: '3',
      label: 'Revision 1',
      author: 'You',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      changes: 'Character development',
    },
    {
      id: '4',
      label: 'Initial Draft',
      author: 'You',
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      changes: 'First draft',
    }
  ];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="h-full flex flex-col">
      <div className={`px-4 py-3 border-b ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <h3 className="font-medium">Version History</h3>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {versions.map((version, index) => (
            <div 
              key={version.id}
              className={`mb-4 pb-4 ${
                index < versions.length - 1 ? (
                  theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'
                ) : ''
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="font-medium">
                  {version.label}
                  {index === 0 && (
                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                      theme === 'dark' ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'
                    }`}>
                      Current
                    </span>
                  )}
                </div>
                <div className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {formatDate(version.timestamp)}
                </div>
              </div>
              
              <div className={`text-sm mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                By {version.author}
              </div>
              
              <div className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {version.changes}
              </div>
              
              <div className="mt-3 flex gap-2">
                {index === 0 ? (
                  <button className={`text-xs px-2 py-1 rounded ${
                    theme === 'dark' 
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`} disabled>
                    Current
                  </button>
                ) : (
                  <button className={`text-xs px-2 py-1 rounded ${
                    theme === 'dark' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}>
                    Restore
                  </button>
                )}
                <button className={`text-xs px-2 py-1 rounded ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}>
                  View
                </button>
                {index > 0 && (
                  <button className={`text-xs px-2 py-1 rounded ${
                    theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}>
                    Compare
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VersionHistory;