export type ProjectCategory = 
  | 'screenplay' 
  | 'short-story' 
  | 'novel' 
  | 'poem' 
  | 'essay' 
  | 'documentary' 
  | 'other';

export type ProjectStatus = 
  | 'draft' 
  | 'in-progress' 
  | 'review' 
  | 'final' 
  | 'archived';

export interface StoryboardScene {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  order: number;
}

export interface VisualCue {
  id: string;
  type: 'scene-description' | 'sound-effect' | 'camera-movement';
  content: string;
  position: number; // Position in the document
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  content: string;
  coverImage?: string;
  isPublic: boolean;
  authorId: string;
  collaboratorIds: string[];
  createdAt: Date;
  updatedAt: Date;
  storyboard?: StoryboardScene[];
  visualCues?: VisualCue[];
  tags: string[];
}

export interface ProjectFilter {
  category?: ProjectCategory;
  status?: ProjectStatus;
  tags?: string[];
  search?: string;
}