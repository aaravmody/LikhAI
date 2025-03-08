import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const EditorToolbar: React.FC = () => {
  const { theme } = useTheme();
  
  const toolbarSections = [
    {
      name: 'text',
      tools: [
        { id: 'bold', label: 'Bold', icon: 'B' },
        { id: 'italic', label: 'Italic', icon: 'I' },
        { id: 'underline', label: 'Underline', icon: 'U' },
        { id: 'strikethrough', label: 'Strikethrough', icon: 'S' },
      ]
    },
    {
      name: 'paragraph',
      tools: [
        { id: 'heading', label: 'Heading', icon: 'H' },
        { id: 'paragraph', label: 'Paragraph', icon: 'P' },
        { id: 'quote', label: 'Quote', icon: '"' },
        { id: 'ul', label: 'Bullet List', icon: '•' },
        { id: 'ol', label: 'Numbered List', icon: '#' },
      ]
    },
    {
      name: 'insert',
      tools: [
        { id: 'link', label: 'Link', icon: '🔗' },
        { id: 'image', label: 'Image', icon: '🖼️' },
        { id: 'table', label: 'Table', icon: '◧' },
      ]
    },
    {
      name: 'advanced',
      tools: [
        { id: 'clear', label: 'Clear Formatting', icon: 'T×' },
        { id: 'undo', label: 'Undo', icon: '↩' },
        { id: 'redo', label: 'Redo', icon: '↪' },
      ]
    }
  ];

  return (
    <div className={`border-b sticky top-0 z-10 ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex flex-wrap items-center px-4 py-1">
        {toolbarSections.map((section, sIndex) => (
          <React.Fragment key={section.name}>
            {sIndex > 0 && (
              <div className={`h-6 w-px mx-2 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
              }`}></div>
            )}
            <div className="flex items-center">
              {section.tools.map((tool) => (
                <button
                  key={tool.id}
                  title={tool.label}
                  className={`w-8 h-8 flex items-center justify-center rounded text-sm ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-700 text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {tool.icon}
                </button>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default EditorToolbar;