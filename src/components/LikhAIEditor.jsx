import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { db } from "../firebase-config";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { debounce } from "lodash";
import { motion } from "framer-motion";
import { PencilIcon, SaveIcon, DocumentTextIcon } from "@heroicons/react/outline";

const LikhAIEditor = ({ onTitleChange, initialTitle = "Untitled Document" }) => {
  const editorRef = useRef(null);
  const [title, setTitle] = useState(initialTitle);
  const [isSaving, setIsSaving] = useState(false);
  const documentRef = doc(db, "documents", "example-doc");
  const isLocalChange = useRef(false);
  const [loading, setLoading] = useState(true);
  
  const saveContent = debounce(() => {
    if (editorRef.current && isLocalChange.current) {
      setIsSaving(true);
      const content = editorRef.current.getContent();
      setDoc(documentRef, { content, title }, { merge: true })
        .then(() => {
          console.log("Content saved to Firestore");
          setIsSaving(false);
        })
        .catch(console.error);
      isLocalChange.current = false;
    }
  }, 1000);

  useEffect(() => {
    getDoc(documentRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          editorRef.current?.setContent(data.content || "");
          setTitle(data.title || initialTitle);
        }
        setLoading(false);
      })
      .catch(console.error);

    const unsubscribe = onSnapshot(documentRef, (snapshot) => {
      if (snapshot.exists() && !isLocalChange.current) {
        const data = snapshot.data();
        if (editorRef.current) {
          const editor = editorRef.current;
          const cursorPosition = editor.selection.getRng();
          editor.setContent(data.content || "");
          editor.selection.setRng(cursorPosition);
        }
        setTitle(data.title || initialTitle);
      }
    });

    return () => unsubscribe();
  }, [initialTitle]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onTitleChange?.(newTitle);
    isLocalChange.current = true;
    saveContent();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="editor-container max-w-6xl mx-auto p-6 space-y-4"
    >
      <div className="flex items-center space-x-4 mb-6">
        <DocumentTextIcon className="h-6 w-6 text-indigo-600" />
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="text-2xl font-semibold bg-transparent border-b-2 border-transparent hover:border-indigo-600 focus:border-indigo-600 focus:outline-none transition-colors duration-200 flex-grow"
          placeholder="Enter document title..."
        />
        <motion.div
          animate={{ opacity: isSaving ? 1 : 0 }}
          className="flex items-center space-x-2 text-sm text-gray-500"
        >
          <SaveIcon className="h-4 w-4" />
          <span>Saving...</span>
        </motion.div>
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
            onEditorChange={() => {
              isLocalChange.current = true;
              saveContent();
            }}
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