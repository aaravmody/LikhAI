import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { db } from "../../firebase-config";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { debounce } from "lodash";
import { saveAs } from "file-saver";
import axios from "axios"; // Add this to send data to backend

const LikhAIEditor = () => {
  const editorRef = useRef(null);
  const documentRef = doc(db, "documents", "example-doc");
  const isLocalChange = useRef(false);
  const [loading, setLoading] = useState(true);

  const saveContent = debounce(() => {
    if (editorRef.current && isLocalChange.current) {
      const content = editorRef.current.getContent();
      setDoc(documentRef, { content }, { merge: true })
        .then(() => console.log("Content saved to Firestore"))
        .catch(console.error);
      isLocalChange.current = false;
    }
  }, 1000);

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
          const cursorPosition = editor.selection.getRng();
          editor.setContent(newContent);
          editor.selection.setRng(cursorPosition);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 🖥 Save file as a .txt file
  const downloadFile = (format) => {
    if (!editorRef.current) return;
    const content = editorRef.current.getContent();
    
    if (format === "txt") {
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      saveAs(blob, "document.txt");
    } else if (format === "html") {
      const blob = new Blob([content], { type: "text/html;charset=utf-8" });
      saveAs(blob, "document.html");
    }
  };

  // 🌍 Send content to backend
  const saveToBackend = async () => {
    if (!editorRef.current) return;
    
    // Extract content and remove HTML tags
    const contentHtml = editorRef.current.getContent();
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = contentHtml;
    const plainTextContent = tempDiv.textContent || tempDiv.innerText || "";
  
    console.log(plainTextContent); // Debugging
  
    try {
      await axios.post("https://your-backend-url.com/save-document", { content: plainTextContent });
      alert("Document saved to backend successfully!");
    } catch (error) {
      console.error("Error saving document:", error);
      alert("Failed to save document.");
    }
  };
  

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-10">
      <div className="bg-blue-500 text-white p-4 text-center text-lg font-bold">
        📝 LikhAI Editor
      </div>
      <div className="p-6">
        {loading ? (
          <p className="text-center text-gray-600">Loading Editor...</p>
        ) : (
          <>
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

            {/* Buttons for Download and Save */}
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => downloadFile("txt")}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Download as .TXT
              </button>
              <button
                onClick={() => downloadFile("html")}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Download as .HTML
              </button>
              <button
                onClick={saveToBackend}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Save to Backend
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LikhAIEditor;
