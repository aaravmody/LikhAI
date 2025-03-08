import jwt from 'jsonwebtoken';
import { projectModel } from '../models/project.model.js';
import { documentModel } from '../models/document.model.js';

export const getUserDocuments = async (req, res) => {
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
                { userId }, // User is the project creator
                { "collaborators.userId": userId } // User is a collaborator
            ]
        }).select('_id'); // Get only project IDs

        const projectIds = projects.map(proj => proj._id); // Extract project IDs

        // Fetch all documents associated with these projects
        const documents = await documentModel.find({
            projectId: { $in: projectIds }
        }).populate('userId', 'fullname email'); // Populate document creator details

        res.json({ documents });

    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
