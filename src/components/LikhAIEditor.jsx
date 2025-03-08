import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { motion } from "framer-motion";
import { SaveIcon, DocumentTextIcon, UserGroupIcon, DownloadIcon, MicrophoneIcon, VolumeUpIcon, StopIcon, ShieldCheckIcon, ExclamationIcon } from "@heroicons/react/outline";
import { debounce } from "lodash";

const WS_BASE_URL = 'ws://localhost:5000';
const API_BASE_URL = 'http://localhost:5000/api/v1';
const PLAGIARISM_API_URL = 'https://api.copyleaks.com/v3/education/scan';

const LikhAIEditor = ({ onSave, onTitleChange, initialTitle = "Untitled Document", initialContent = "", isSaving, documentId, autoSave = false }) => {
  const editorRef = useRef(null);
  const wsRef = useRef(null);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent || '');
  const [loading, setLoading] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const isLocalChange = useRef(false);
  const [saveTimeout, setSaveTimeout] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(null);
  const [isPlagiarismChecking, setIsPlagiarismChecking] = useState(false);
  const [plagiarismResults, setPlagiarismResults] = useState(null);
  const [currentScene, setCurrentScene] = useState(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      let finalTranscript = '';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (editorRef.current) {
          const editor = editorRef.current;
          const currentContent = editor.getContent();
          
          // Only update with final results
          if (finalTranscript) {
            const newContent = currentContent + ' ' + finalTranscript;
            editor.setContent(newContent);
            setContent(newContent);
            finalTranscript = ''; // Reset final transcript after using it
          }
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const speakText = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = editorRef.current ? editorRef.current.getContent({ format: 'text' }) : '';
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
    };

    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

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

  useEffect(() => {
    if (autoSave && content !== initialContent) {
      // Clear existing timeout
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }

      // Set new timeout
      const timeoutId = setTimeout(() => {
        onSave(content, false);
      }, 2000);

      setSaveTimeout(timeoutId);
    }

    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [content, initialContent, onSave, autoSave]);

  // Debounced auto-save and broadcast changes
  const debouncedSave = debounce((newContent) => {
    isLocalChange.current = true;
    onSave?.(newContent, false);
    
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
    if (autoSave) {
    debouncedSave(newContent);
    }
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

  const handleSave = () => {
    onSave(content, true);
  };

  const handleExport = (format) => {
    if (!editorRef.current) return;

    const editor = editorRef.current;
    const content = editor.getContent();
    
    switch (format) {
      case 'pdf':
        editor.execCommand('mcePrintPdf');
        break;
      case 'doc':
        const blob = new Blob([content], { type: 'application/msword' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${title}.doc`;
        link.click();
        URL.revokeObjectURL(link.href);
        break;
      case 'epub':
        // For EPUB, we'll need to convert HTML to EPUB format
        // This is a basic example - you might want to use a proper EPUB converter library
        const epubBlob = new Blob([content], { type: 'application/epub+zip' });
        const epubLink = document.createElement('a');
        epubLink.href = URL.createObjectURL(epubBlob);
        epubLink.download = `${title}.epub`;
        epubLink.click();
        URL.revokeObjectURL(epubLink.href);
        break;
      default:
        console.error('Unsupported format');
    }
  };

  // Function to split content into scenes
  const splitIntoScenes = (content) => {
    // Split by double line breaks or scene headings (e.g., "Scene 1", "INT.", "EXT.")
    const scenes = content.split(/\n\s*\n|\b(Scene \d+|INT\.|EXT\.)/i)
      .filter(scene => scene && scene.trim())
      .map(scene => scene.trim());
    return scenes;
  };

  // Add new function for text similarity check
  const calculateSimilarity = (text1, text2) => {
    const words1 = text1.toLowerCase().split(/\W+/);
    const words2 = text2.toLowerCase().split(/\W+/);
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return (intersection.size / union.size) * 100;
  };

  // Update the checkPlagiarism function
  const checkPlagiarism = async (sceneContent) => {
    setIsPlagiarismChecking(true);
    try {
      // Split the content into smaller chunks for comparison
      const chunks = sceneContent.split(/[.!?]+/).filter(chunk => chunk.trim().length > 20);
      
      // Simulate plagiarism check by comparing with some sample texts
      // In a real application, you would compare with a database of texts or use an API
      const sampleTexts = [
        "The quick brown fox jumps over the lazy dog.",
        "To be or not to be, that is the question.",
        "It was the best of times, it was the worst of times.",
        // Add more sample texts as needed
      ];

      let maxSimilarity = 0;
      let similarTexts = [];

      for (const chunk of chunks) {
        for (const sampleText of sampleTexts) {
          const similarity = calculateSimilarity(chunk, sampleText);
          if (similarity > 30) { // Threshold for similarity
            maxSimilarity = Math.max(maxSimilarity, similarity);
            similarTexts.push({
              text: sampleText,
              similarity: similarity.toFixed(2)
            });
          }
        }
      }

      // Remove duplicates and sort by similarity
      similarTexts = Array.from(new Set(similarTexts.map(JSON.stringify)))
        .map(JSON.parse)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5); // Keep top 5 matches

      return {
        percentagePlagiarized: maxSimilarity.toFixed(2),
        sources: similarTexts.map(item => ({
          text: item.text,
          similarity: item.similarity
        })),
        text: sceneContent
      };
    } catch (error) {
      console.error('Plagiarism check error:', error);
      return {
        percentagePlagiarized: 0,
        sources: [],
        text: sceneContent,
        error: 'Failed to check plagiarism'
      };
    } finally {
      setIsPlagiarismChecking(false);
    }
  };

  // Function to handle plagiarism check button click
  const handlePlagiarismCheck = async () => {
    if (!editorRef.current) return;

    const content = editorRef.current.getContent({ format: 'text' });
    const scenes = splitIntoScenes(content);
    
    if (scenes.length === 0) {
      alert('No content to check for plagiarism');
      return;
    }

    // Check the first scene or the next unchecked scene
    const sceneToCheck = currentScene === null ? 0 : currentScene + 1;
    if (sceneToCheck >= scenes.length) {
      alert('All scenes have been checked for plagiarism');
      return;
    }

    const result = await checkPlagiarism(scenes[sceneToCheck]);
    setPlagiarismResults(prev => ({
      ...prev,
      [sceneToCheck]: result
    }));
    setCurrentScene(sceneToCheck);
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleRecording}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            title={isRecording ? 'Stop Recording' : 'Start Voice Input'}
          >
            {isRecording ? (
              <StopIcon className="h-5 w-5" />
            ) : (
              <MicrophoneIcon className="h-5 w-5" />
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={speakText}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isSpeaking
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            title={isSpeaking ? 'Stop Speaking' : 'Read Text'}
          >
            <VolumeUpIcon className="h-5 w-5" />
          </motion.button>
          <div className="relative group">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <DownloadIcon className="h-5 w-5" />
              <span>Export</span>
            </motion.button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-1">
                <button
                  onClick={() => handleExport('pdf')}
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as PDF
                </button>
                <button
                  onClick={() => handleExport('doc')}
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as DOC
                </button>
                <button
                  onClick={() => handleExport('epub')}
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as EPUB
                </button>
              </div>
            </div>
          </div>
          <motion.div
            animate={{ opacity: isSaving ? 1 : 0 }}
            className="text-sm text-gray-500"
          >
            Auto-saving...
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            disabled={isSaving}
          >
            <SaveIcon className="h-5 w-5" />
            <span>Save</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlagiarismCheck}
            disabled={isPlagiarismChecking}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isPlagiarismChecking
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
            title="Check Plagiarism"
          >
            <ShieldCheckIcon className="h-5 w-5" />
            {isPlagiarismChecking && <span>Checking...</span>}
          </motion.button>
        </div>
      </div>
      
      {/* Plagiarism Results Panel */}
      {plagiarismResults && currentScene !== null && plagiarismResults[currentScene] && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Scene {currentScene + 1} Similarity Analysis
            </h3>
            <div className="flex items-center space-x-2">
              <ExclamationIcon className={`h-5 w-5 ${
                plagiarismResults[currentScene].percentagePlagiarized > 30
                  ? 'text-red-500'
                  : 'text-green-500'
              }`} />
              <span className={`font-bold ${
                plagiarismResults[currentScene].percentagePlagiarized > 30
                  ? 'text-red-500'
                  : 'text-green-500'
              }`}>
                {plagiarismResults[currentScene].percentagePlagiarized}% Similar Content
              </span>
            </div>
          </div>
          
          {plagiarismResults[currentScene].sources.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Similar Content Found:</h4>
              <ul className="space-y-2">
                {plagiarismResults[currentScene].sources.map((source, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="flex justify-between items-center">
                      <span className="flex-grow">{source.text}</span>
                      <span className="ml-2 text-xs font-medium text-gray-500">
                        {source.similarity}% similar
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {plagiarismResults[currentScene].error && (
            <div className="text-red-500 mt-2">
              {plagiarismResults[currentScene].error}
            </div>
          )}
        </motion.div>
      )}
      
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
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'help', 'wordcount', 'pagebreak',
                'print', 'exportpdf'
              ],
              toolbar:
                "undo redo | formatselect | bold italic backcolor | " +
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | pagebreak | removeformat | print exportpdf | help",
              skin: "oxide",
              content_css: "default",
              content_style: `
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
                  font-size: 14px;
                }
                .mce-pagebreak {
                  border-top: 2px dashed #999;
                  margin-top: 20px;
                  margin-bottom: 20px;
                  page-break-before: always;
                  cursor: default;
                  display: block;
                  position: relative;
                }
                .mce-pagebreak::after {
                  content: 'Page Break';
                  position: absolute;
                  top: -10px;
                  left: 50%;
                  transform: translateX(-50%);
                  background: white;
                  padding: 0 10px;
                  color: #999;
                  font-size: 12px;
                }
                @media print {
                  .mce-pagebreak {
                    page-break-before: always !important;
                    border: none;
                    height: 0;
                  }
                  .mce-pagebreak::after {
                    display: none;
                  }
                }
              `,
              pagebreak_separator: '<div class="mce-pagebreak"></div>',
              pagebreak_split: true,
              branding: false,
              promotion: false
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default LikhAIEditor; 