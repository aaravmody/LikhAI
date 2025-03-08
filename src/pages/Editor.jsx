import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LikhAIEditor from '../components/LikhAIEditor';

const Editor = () => {
  const [documentTitle, setDocumentTitle] = useState('Untitled Document');

  const handleTitleChange = (newTitle) => {
    setDocumentTitle(newTitle);
    // Update document title for export
    document.title = `${newTitle} - LikhAI`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-8"
    >
      <LikhAIEditor
        onTitleChange={handleTitleChange}
        initialTitle={documentTitle}
      />
    </motion.div>
  );
};

export default Editor; 