import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import CommentItem from './CommentItem';

const CommentsPanel: React.FC = () => {
  const { theme } = useTheme();
  const [newComment, setNewComment] = useState('');
  
  // Sample comments data
  const [comments, setComments] = useState([
    {
      id: '1',
      text: 'I think we should expand this characters backstory a bit more.',
      author: 'Emma Lee',
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      resolved: false,
    },
    {
      id: '2',
      text: 'This dialogue feels too formal for this characters personality.',
      author: 'James Wilson',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      resolved: false,
    },
    {
      id: '3',
      text: 'We should add more tension to this scene.',
      author: 'You',
      timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
      resolved: true,
    }
  ]);
  
  const addComment = () => {
    if (newComment.trim()) {
      setComments([
        {
          id: Date.now().toString(),
          text: newComment,
          author: 'You',
          timestamp: new Date().toISOString(),
          resolved: false,
        },
        ...comments
      ]);
      setNewComment('');
    }
  };
  
  const toggleResolve = (id: string) => {
    setComments(comments.map(comment => 
      comment.id === id ? { ...comment, resolved: !comment.resolved } : comment
    ));
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className={`px-4 py-3 border-b ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <h3 className="font-medium">Comments & Suggestions</h3>
      </div>
      
      <div className={`p-4 border-b ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <textarea
          placeholder="Add a comment..."
          className={`w-full p-2 text-sm rounded border ${
            theme === 'dark' 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <div className="flex justify-end mt-2">
          <button
            onClick={addComment}
            disabled={!newComment.trim()}
            className={`px-3 py-1 rounded text-sm font-medium ${
              newComment.trim()
                ? theme === 'dark' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                : theme === 'dark'
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Comment
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="p-2">
          {comments.some(c => !c.resolved) && (
            <>
              <h4 className={`px-2 py-1 text-sm font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Active
              </h4>
              {comments.filter(c => !c.resolved).map(comment => (
                <CommentItem 
                  key={comment.id}
                  comment={comment}
                  onResolve={() => toggleResolve(comment.id)}
                />
              ))}
            </>
          )}
          
          {comments.some(c => c.resolved) && (
            <>
              <h4 className={`mt-4 px-2 py-1 text-sm font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Resolved
              </h4>
              {comments.filter(c => c.resolved).map(comment => (
                <CommentItem 
                  key={comment.id}
                  comment={comment}
                  onResolve={() => toggleResolve(comment.id)}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentsPanel;