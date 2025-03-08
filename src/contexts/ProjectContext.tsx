import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Project, ProjectCategory } from '../types/project';
import { Comment } from '../types/comment';
import { User } from '../types/user';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  collaborators: User[];
  comments: Comment[];
  versions: { id: string; label: string; date: Date; content: string }[];
  
  // Project management
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (id: string | null) => void;
  
  // Collaboration
  addCollaborator: (user: User) => void;
  removeCollaborator: (userId: string) => void;
  
  // Comments
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  deleteComment: (id: string) => void;
  resolveComment: (id: string) => void;
  
  // Version history
  saveVersion: (label: string, content: string) => void;
  revertToVersion: (versionId: string) => void;
  
  // Filters
  filterByCategory: (category: ProjectCategory | null) => Project[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  // Load initial state from localStorage or use defaults
  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem('projects');
    return savedProjects ? JSON.parse(savedProjects) : [];
  });
  
  const [currentProject, setCurrentProjectState] = useState<Project | null>(null);
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [versions, setVersions] = useState<{ id: string; label: string; date: Date; content: string }[]>([]);
  
  // Persist projects to localStorage
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);
  
  // Project management functions
  const createProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setProjects(prev => [...prev, newProject]);
    return newProject.id;
  };
  
  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === id 
          ? { ...project, ...updates, updatedAt: new Date() } 
          : project
      )
    );
    
    if (currentProject?.id === id) {
      setCurrentProjectState(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
    }
  };
  
  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    if (currentProject?.id === id) {
      setCurrentProjectState(null);
    }
  };
  
  const setCurrentProject = (id: string | null) => {
    if (id === null) {
      setCurrentProjectState(null);
      setCollaborators([]);
      setComments([]);
      setVersions([]);
      return;
    }
    
    const project = projects.find(p => p.id === id) || null;
    setCurrentProjectState(project);
    
    // In a real app, you would fetch these from an API
    // For now, we'll just simulate it with empty arrays or mock data
    setCollaborators([]);
    setComments([]);
    setVersions([
      { 
        id: crypto.randomUUID(), 
        label: 'Initial Draft', 
        date: new Date(), 
        content: project?.content || '' 
      }
    ]);
  };
  
  // Collaboration functions
  const addCollaborator = (user: User) => {
    setCollaborators(prev => [...prev, user]);
  };
  
  const removeCollaborator = (userId: string) => {
    setCollaborators(prev => prev.filter(user => user.id !== userId));
  };
  
  // Comments functions
  const addComment = (commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...commentData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    setComments(prev => [...prev, newComment]);
  };
  
  const deleteComment = (id: string) => {
    setComments(prev => prev.filter(comment => comment.id !== id));
  };
  
  const resolveComment = (id: string) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === id 
          ? { ...comment, resolved: true } 
          : comment
      )
    );
  };
  
  // Version history functions
  const saveVersion = (label: string, content: string) => {
    const newVersion = {
      id: crypto.randomUUID(),
      label,
      date: new Date(),
      content,
    };
    
    setVersions(prev => [...prev, newVersion]);
    
    // Also update the current project content
    if (currentProject) {
      updateProject(currentProject.id, { content });
    }
  };
  
  const revertToVersion = (versionId: string) => {
    const version = versions.find(v => v.id === versionId);
    if (version && currentProject) {
      updateProject(currentProject.id, { content: version.content });
    }
  };
  
  // Filter function
  const filterByCategory = (category: ProjectCategory | null) => {
    if (!category) return projects;
    return projects.filter(project => project.category === category);
  };
  
  const value = {
    projects,
    currentProject,
    collaborators,
    comments,
    versions,
    createProject,
    updateProject,
    deleteProject,
    setCurrentProject,
    addCollaborator,
    removeCollaborator,
    addComment,
    deleteComment,
    resolveComment,
    saveVersion,
    revertToVersion,
    filterByCategory,
  };
  
  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};