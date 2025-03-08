export interface Comment {
    id: string;
    projectId: string;
    authorId: string;
    content: string;
    position: number; // Position in the document
    resolved: boolean;
    replies?: Comment[];
    createdAt: Date;
    mentionedUserIds?: string[];
  }
  
  export interface CommentFilter {
    authorId?: string;
    resolved?: boolean;
    hasReplies?: boolean;
    hasMentions?: boolean;
  }