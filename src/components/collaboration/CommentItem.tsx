import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Comment } from '../../types/comment';

interface CommentItemProps {
  comment: Comment;
  onResolve: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onResolve }) => {
  const { theme } = useTheme();
  
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffMs = now.getTime() - commentTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className={`p-3 mb-2 rounded ${
      theme === 'dark' ? 'bg-gray-750' : 'bg-gray-100'
    }`}>
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center">
          <div className="font-medium text-sm">{comment.author}</div>
          <div className={`ml-2 text-xs ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {formatTimeAgo(comment.timestamp)}
          </div>
        </div>
        <button
          onClick={onResolve}
          className={`text-xs ${
            theme === 'dark' 
              ? 'text-blue-400 hover:text-blue-300' 
              : 'text-blue-600 hover:text-blue-700'
          }`}
        >
          {comment.resolved ? 'Reopen' : 'Resolve'}
        </button>
      </div>
      <div className="text-sm whitespace-pre-wrap">{comment.text}</div>
    </div>
  );
};

export default CommentItem;