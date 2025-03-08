export type UserRole = 'owner' | 'editor' | 'reviewer' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  bio?: string;
}

export interface Collaborator extends User {
  isActive: boolean;
  lastActive?: Date;
  color: string; // For cursor/highlight color
}