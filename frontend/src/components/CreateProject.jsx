import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import LikhAIEditor from "./LikhAI"; // TinyMCE Editor

const CreateProject = () => {
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    const [formData, setFormData] = useState({
        projectName: "",
        docType: "script",
        status: "todo",
        collaborators: [],
    });
    const [collaboratorEmail, setCollaboratorEmail] = useState(""); // Input field for collaborator email
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        try {
            const token = axios.defaults.headers.common['Authorization'].split(' ')[1];
            const data = jwtDecode(token);
            if (!data) {
                console.log('Authorization header is missing.');
                navigate('/login');
            }
            setUserProfile(data.userIdentifier);
        } catch (error) {
            console.error("Error decoding token:", error);
            navigate('/login');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddCollaborator = () => {
        if (collaboratorEmail.trim() && !formData.collaborators.includes(collaboratorEmail)) {
            setFormData({ ...formData, collaborators: [...formData.collaborators, collaboratorEmail] });
            setCollaboratorEmail(""); // Clear input field
        }
    };

    const handleRemoveCollaborator = (email) => {
        setFormData({
            ...formData,
            collaborators: formData.collaborators.filter((collab) => collab !== email),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/api/v1/create-project", { 
                ...formData, 
                userProfile 
            });
            console.log("Project Created:", response.data);
            setShowForm(false);
            setShowEditor(true);
        } catch (error) {
            console.error("Error creating project:", error);
            alert("Failed to create project.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Your Documents</h1>
                <button className="px-5 py-2 bg-red-500 text-white rounded-full shadow-md" onClick={() => navigate("/")}>
                    Back to Home
                </button>
            </div>

            <button className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg text-xl" onClick={() => setShowForm(true)}>
                +
            </button>

            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
                        <form onSubmit={handleSubmit}>
                            <label className="block mb-2">Project Name</label>
                            <input
                                type="text"
                                name="projectName"
                                value={formData.projectName}
                                onChange={handleChange}
                                className="w-full border p-2 rounded mb-3"
                                placeholder="Enter project name"
                                required
                            />

                            <label className="block mb-2">Document Type</label>
                            <select name="docType" value={formData.docType} onChange={handleChange} className="w-full border p-2 rounded mb-3">
                                <option value="script">Script</option>
                                <option value="article">Article</option>
                                <option value="marketing-material">Marketing Material</option>
                            </select>

                            <label className="block mb-2">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full border p-2 rounded mb-3">
                                <option value="todo">To Do</option>
                                <option value="inprogress">In Progress</option>
                                <option value="undereview">Under Review</option>
                            </select>

                            <label className="block mb-2">Add Collaborators</label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="email"
                                    value={collaboratorEmail}
                                    onChange={(e) => setCollaboratorEmail(e.target.value)}
                                    className="flex-1 border p-2 rounded"
                                    placeholder="Enter collaborator names"
                                />
                                <button type="button" className="bg-green-500 text-white px-4 rounded" onClick={handleAddCollaborator}>
                                    Add
                                </button>
                            </div>

                            <ul className="mb-3">
                                {formData.collaborators.map((email, index) => (
                                    <li key={index} className="flex justify-between items-center bg-gray-200 p-2 rounded mb-1">
                                        {email}
                                        <button type="button" className="text-red-500" onClick={() => handleRemoveCollaborator(email)}>
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-3">
                                Create Project
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {showEditor && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-screen overflow-y-auto">
                        <button className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-red-700" onClick={() => setShowEditor(false)}>
                            &times;
                        </button>

                        <h2 className="text-2xl font-bold mb-4">Create a New Document</h2>

                        <LikhAIEditor />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateProject;
