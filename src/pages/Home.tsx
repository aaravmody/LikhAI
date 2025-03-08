import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import IconButton from '../components/common/IconButton';

const Home: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`py-4 px-6 flex justify-between items-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <h1 className="text-2xl font-bold">StoryForge</h1>
        <div className="flex items-center gap-4">
          <IconButton
            icon={theme === 'dark' ? '/assets/icons/light-mode.svg' : '/assets/icons/dark-mode.svg'}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          />
          <Link 
            to="/dashboard" 
            className={`px-4 py-2 rounded-md font-medium ${
              theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            } text-white transition-colors`}
          >
            Go to Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Create, Collaborate, and Craft Stories</h2>
            <p className="text-xl mb-8">A powerful writing platform for storytellers, screenwriters, and creative teams</p>
            <div className="flex gap-4 justify-center">
              <Link 
                to="/dashboard" 
                className={`px-6 py-3 rounded-lg font-semibold ${
                  theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition-colors`}
              >
                Start Writing
              </Link>
              <button 
                className={`px-6 py-3 rounded-lg font-semibold ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                } transition-colors`}
              >
                Learn More
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <FeatureCard
              title="Smart Writing Environment"
              description="Rich text editor with formatting tools and AI-assisted content suggestions."
              theme={theme}
            />
            <FeatureCard
              title="Seamless Collaboration"
              description="Work together in real-time with comments, suggestions, and version control."
              theme={theme}
            />
            <FeatureCard
              title="Storytelling Tools"
              description="Specialized features for narratives, screenplays, and poetic content."
              theme={theme}
            />
          </div>

          <div className={`rounded-xl p-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
            <h3 className="text-2xl font-semibold mb-4">Featured Projects</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <DemoProjectCard 
                title="Screenplay Example" 
                description="A collaborative film script with scene visualizations"
                theme={theme}
                tags={['Film', 'Screenplay']}
              />
              <DemoProjectCard 
                title="Novel Draft" 
                description="Literary fiction with poetic analysis features"
                theme={theme}
                tags={['Fiction', 'Novel']}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className={`py-6 px-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} mt-auto`}>
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 StoryForge. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper components
const FeatureCard: React.FC<{ title: string; description: string; theme: string }> = ({ title, description, theme }) => {
  return (
    <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{description}</p>
    </div>
  );
};

const DemoProjectCard: React.FC<{ title: string; description: string; theme: string; tags: string[] }> = ({ 
  title, description, theme, tags 
}) => {
  return (
    <div className={`p-6 rounded-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className={`mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{description}</p>
      <div className="flex gap-2">
        {tags.map((tag, index) => (
          <span 
            key={index} 
            className={`text-xs px-2 py-1 rounded ${
              theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Home;