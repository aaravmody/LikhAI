import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { db } from "../firebase-config";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { debounce } from "lodash";
import "../App.css";

const LikhAIEditor: React.FC = () => {
  const editorRef = useRef<any>(null);
  const documentRef = doc(db, "documents", "example-doc");
  const isLocalChange = useRef(false);
  const [loading, setLoading] = useState(true);
  
  // Save content to Firestore with debounce (reduces writes)
  const saveContent = debounce(() => {
    if (editorRef.current && isLocalChange.current) {
      const content = editorRef.current.getContent();
      setDoc(documentRef, { content }, { merge: true })
        .then(() => console.log("Content saved to Firestore"))
        .catch(console.error);
      isLocalChange.current = false; // Reset local flag after save
    }
  }, 1000);

  // Load and sync content with Firestore
  useEffect(() => {
    getDoc(documentRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          editorRef.current?.setContent(docSnap.data().content || "");
        }
        setLoading(false);
      })
      .catch(console.error);

    const unsubscribe = onSnapshot(documentRef, (snapshot) => {
      if (snapshot.exists() && !isLocalChange.current) {
        const newContent = snapshot.data().content;
        if (editorRef.current) {
          const editor = editorRef.current;
          const cursorPosition = editor.selection.getRng(); // Preserve cursor
          editor.setContent(newContent);
          editor.selection.setRng(cursorPosition);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="editor-container">
      <div className="toolbar">
        <h2>📝 LikhAI Editor</h2>
      </div>
      <div className="editor-wrapper">
        {loading ? (
          <p>Loading Editor...</p>
        ) : (
          <Editor
            apiKey="t9etw6h9207mdjibj5lg2it9l62zkjkfmsyaj8tvt85dgyhj"
            onInit={(evt, editor) => (editorRef.current = editor)}
            onEditorChange={() => {
              isLocalChange.current = true;
              saveContent();
            }}
            init={{
              height: 500,
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
              export_file_types: ["pdf", "docx"],
            }}
          />
        )}
      </div>
    </div>
  );
};

export default LikhAIEditor;
