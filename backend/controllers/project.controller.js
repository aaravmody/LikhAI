import { userModel } from '../models/user.model.js'
import { projectModel } from '../models/project.model.js'
import jwt from 'jsonwebtoken'
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
        const { token, title, description } = req.body;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Token required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userEmail = decoded.userIdentifier;

        const user = await userModel.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const newProject = new projectModel({
            userId: user._id,
            name: title,
            description,
            docType: 'article', // Default type
            status: 'inprogess', // Default status
            collaborators: [] // Initially no collaborators
        });

        await newProject.save();
        res.status(201).json({ 
            success: true,
            message: 'Project created successfully',
            project: {
                _id: newProject._id,
                title: newProject.name,
                description: newProject.description,
                createdAt: newProject.createdAt,
                category: newProject.status
            }
        });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const fetchProjects = async (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Token required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userEmail = decoded.userIdentifier;

        const user = await userModel.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const projects = await projectModel.find({
            $or: [
                { userId: user._id },
                { 'collaborators.user': userEmail }
            ]
        });

        const formattedProjects = projects.map(project => ({
            _id: project._id,
            title: project.name,
            description: project.description,
            createdAt: project.createdAt,
            category: project.status
        }));

        res.status(200).json({ 
            success: true,
            projects: formattedProjects
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export {
    getUserProjects,
    createProject,
    fetchProjects
}