import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProjectProvider } from './contexts/ProjectContext';
import Home from './pages/Home';
import Editor from './pages/Editor';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ProjectProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/editor/:projectId" element={<Editor />} />
            <Route path="/project/:projectId" element={<ProjectDetails />} />
          </Routes>
        </Router>
      </ProjectProvider>
    </ThemeProvider>
  );
};

export default App;