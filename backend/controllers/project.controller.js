import { userModel } from '../models/user.model.js'
import { projectModel } from '../models/project.model.js'
import { config } from 'dotenv'

config()

const getUserProjects = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Token required' });
        }

        const secretKey = process.env.JWT_SECRET
        const decoded = jwt.verify(token, secretKey);
        const userId = decoded.userIdentifier;

        const projects = await projectModel.find({
            $or: [
                { userId }, // Projects where user is the creator
                { "collaborators.userId": userId } // Projects where user is a collaborator
            ]
        }).populate('collaborators.userId', 'fullname email'); // Populate collaborators' details

        res.json({ projects });

    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: 'Server error' });
    }
}

const createProject = async (req, res) => {
    try {
        const { userProfile, collaborators, docType, status, projectName } = req.body;

        console.log("Collaborators received:", collaborators);

        const findUser = await userModel.findOne({ email: userProfile });
        if (!findUser) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!userProfile || !docType || !status || !projectName) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const userId = findUser._id;

        // Validate and format collaborators
        let formattedCollaborators = [];
        if (Array.isArray(collaborators)) {
            for (const collab of collaborators) {
                if (!collab || typeof collab !== 'string') continue; // Skip invalid entries

                // Find collaborator in userModel
                const collaborator = await userModel.findOne({ email: collab.trim() });

                if (!collaborator) {
                    return res.status(404).json({ error: `Collaborator ${collab} not found` });
                }

                // Store user._id instead of email
                formattedCollaborators.push({
                    user: collaborator._id,  
                    role: "editor"  // Assign "editor" to everyone
                });
            }
        }

        console.log("Formatted Collaborators:", formattedCollaborators);

        const newProject = new projectModel({
            userId,
            name: projectName,
            collaborators: formattedCollaborators,
            docType,
            status
        });

        await newProject.save();
        res.status(201).json({ message: "Project created successfully", project: newProject });
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


const fetchProjects = async (req, res) => {
    try {
        const { userProfile } = req.body;
        const findUser = await userModel.findOne({ email: userProfile })

        const id = findUser._id

        console.log(findUser._id)

        const projects = await projectModel.find({ userId: id })

        console.log(projects)

        res.status(201).json({ message: "Project created successfully", projects });
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


export {
    getUserProjects,
    createProject,
    fetchProjects
}