import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { motion } from "framer-motion";
import { SaveIcon, DocumentTextIcon, UserGroupIcon } from "@heroicons/react/outline";
import { debounce } from "lodash";

const WS_BASE_URL = 'ws://localhost:5000';
const API_BASE_URL = 'http://localhost:5000/api/v1';

const LikhAIEditor = ({ onSave, onTitleChange, initialTitle = "Untitled Document", initialContent = "", isSaving, documentId }) => {
  const editorRef = useRef(null);
  const wsRef = useRef(null);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const isLocalChange = useRef(false);

  useEffect(() => {
    // Connect to WebSocket for real-time collaboration
    const token = localStorage.getItem('token');
    if (!token || !documentId) return;

    wsRef.current = new WebSocket(`${WS_BASE_URL}/document/${documentId}?token=${token}`);

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'content_update' && !isLocalChange.current) {
        // Update content from other users
        setContent(data.content);
        if (editorRef.current) {
          const editor = editorRef.current;
          const cursorPos = editor.selection.getRng();
          editor.setContent(data.content);
          editor.selection.setRng(cursorPos);
        }
      } else if (data.type === 'title_update' && !isLocalChange.current) {
        // Update title from other users
        setTitle(data.title);
        onTitleChange?.(data.title);
      } else if (data.type === 'active_users') {
        // Update list of active users
        setActiveUsers(data.users);
      }
      
      isLocalChange.current = false;
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [documentId]);

  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
  }, [initialTitle, initialContent]);

  // Debounced auto-save and broadcast changes
  const debouncedSave = debounce((newContent) => {
    isLocalChange.current = true;
    onSave?.(newContent);
    
    // Broadcast content change to other users
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'content_update',
        content: newContent
      }));
    }
  }, 1000);

  const handleEditorChange = (newContent) => {
    setContent(newContent);
    debouncedSave(newContent);
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onTitleChange?.(newTitle);

    // Broadcast title change to other users
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'title_update',
        title: newTitle
      }));
    }
  };

  const handleManualSave = () => {
    if (editorRef.current) {
      const currentContent = editorRef.current.getContent();
      isLocalChange.current = true;
      onSave?.(currentContent);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="editor-container max-w-6xl mx-auto p-6 space-y-4"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4 flex-grow">
          <DocumentTextIcon className="h-6 w-6 text-indigo-600" />
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="text-2xl font-semibold bg-transparent border-b-2 border-transparent hover:border-indigo-600 focus:border-indigo-600 focus:outline-none transition-colors duration-200 flex-grow"
            placeholder="Enter document title..."
          />
        </div>
        <div className="flex items-center space-x-4">
          {activeUsers.length > 0 && (
            <div className="flex items-center space-x-2">
              <UserGroupIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-500">{activeUsers.length} active</span>
            </div>
          )}
          <motion.div
            animate={{ opacity: isSaving ? 1 : 0 }}
            className="text-sm text-gray-500"
          >
            Auto-saving...
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleManualSave}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            disabled={isSaving}
          >
            <SaveIcon className="h-5 w-5" />
            <span>Save</span>
          </motion.button>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="editor-wrapper bg-white rounded-lg shadow-lg p-4"
      >
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <Editor
            apiKey="t9etw6h9207mdjibj5lg2it9l62zkjkfmsyaj8tvt85dgyhj"
            onInit={(evt, editor) => (editorRef.current = editor)}
            value={content}
            onEditorChange={handleEditorChange}
            init={{
              height: 600,
              menubar: true,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
                "export",
              ],
              toolbar:
                "undo redo | formatselect | bold italic backcolor | " +
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | removeformat | help",
              skin: "oxide",
              content_css: "default",
              export_file_types: ["pdf", "docx"],
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default LikhAIEditor; 