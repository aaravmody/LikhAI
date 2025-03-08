import {userModel} from '../models/user.model.js'
import {projectModel} from '../models/project.model.js'
import {config} from 'dotenv'

config()

const getUserProjects = async (req,res) => {
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

export {
    getUserProjects
}