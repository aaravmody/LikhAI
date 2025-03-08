import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

function LandingPage() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authHeader = axios.defaults.headers.common["Authorization"];
        if (!authHeader) {
          navigate("/login");
          return;
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
          navigate("/login");
          return;
        }

        const data = jwtDecode(token);
        const response = await axios.post(
          "http://localhost:3000/api/v1/fetch-projects",
          { userProfile: data.userIdentifier }
        );

        setProjects(response.data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center h-[90vh] text-center px-6 bg-gradient-to-r from-blue-900 to-purple-800 text-white">
        <motion.h1
          className="text-6xl font-extrabold leading-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          AI Copilot for <br /> Content Writers & Filmmakers
        </motion.h1>
        <motion.p
          className="mt-4 text-lg max-w-2xl text-gray-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Elevate your creativity with AI-assisted tools that refine, structure, and
          enhance your content—effortlessly.
        </motion.p>
        <motion.button
          className="mt-6 px-8 py-3 bg-white text-blue-600 font-semibold rounded-full text-lg shadow-lg hover:scale-105 transition"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>
      </section>

      {/* My Projects Section */}
      <section className="py-10 px-8">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-900">My Projects</h2>
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedProject(project)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-semibold text-blue-900">{project.name}</h3>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No projects found.</p>
        )}
      </section>

      {/* Project Details */}
      {selectedProject && (
        <section className="py-16 px-8 bg-gray-100">
          <h2 className="text-4xl font-bold text-center mb-8 text-gray-900">{selectedProject.name} Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedProject.documents.map((doc, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow-md">
                <p className="text-lg font-semibold text-gray-800">{doc}</p>
              </div>
            ))}
          </div>
          <button
            className="mt-6 px-6 py-3 bg-red-500 text-white font-semibold rounded-full shadow-md"
            onClick={() => setSelectedProject(null)}
          >
            Back to Projects
          </button>
        </section>
      )}

      {/* Floating Create Project Button */}
      <motion.div
        className="fixed bottom-8 right-8"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <button
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full text-lg shadow-lg hover:bg-blue-700 transition"
          onClick={() => navigate("/create-project")}
        >
          + Create Project
        </button>
      </motion.div>

      <Footer />
    </>
  );
}

export default LandingPage;
