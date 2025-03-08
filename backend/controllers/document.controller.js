import jwt from 'jsonwebtoken';
import { userModel } from '../models/user.model.js';
import { projectModel } from '../models/project.model.js';
import { documentModel } from '../models/document.model.js';

const createDocument = async (req, res) => {
    try {
        const { token, title, description, projectId } = req.body;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Token required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userEmail = decoded.userIdentifier;

        const user = await userModel.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // If projectId is provided, verify user has access to the project
        if (projectId) {
            const project = await projectModel.findById(projectId);
            if (!project) {
                return res.status(404).json({ success: false, message: 'Project not found' });
            }

            const hasAccess = project.userId.equals(user._id) || 
                            project.collaborators.some(c => c.user === userEmail);
            if (!hasAccess) {
                return res.status(403).json({ success: false, message: 'Access denied to this project' });
            }
        }

        const newDocument = new documentModel({
            userId: user._id,
            projectId: projectId || null,
            title: title || 'Untitled Document',
            description: description || '',
            content: '',
            comments: []
        });

        await newDocument.save();

        res.status(201).json({
            success: true,
            message: 'Document created successfully',
            document: {
                _id: newDocument._id,
                title: newDocument.title,
                description: newDocument.description,
                createdAt: newDocument.createdAt,
                projectId: newDocument.projectId
            }
        });
    } catch (error) {
        console.error('Error creating document:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const getDocument = async (req, res) => {
    try {
        const { token, documentId } = req.body;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Token required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userEmail = decoded.userIdentifier;

        const user = await userModel.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const document = await documentModel.findById(documentId);
        if (!document) {
            return res.status(404).json({ success: false, message: 'Document not found' });
        }

        // Check if user has access to the document
        if (document.projectId) {
            const project = await projectModel.findById(document.projectId);
            const hasAccess = project.userId.equals(user._id) || 
                            project.collaborators.some(c => c.user === userEmail);
            if (!hasAccess) {
                return res.status(403).json({ success: false, message: 'Access denied to this document' });
            }
        } else if (!document.userId.equals(user._id)) {
            return res.status(403).json({ success: false, message: 'Access denied to this document' });
        }

        res.status(200).json({
            success: true,
            document: {
                _id: document._id,
                title: document.title,
                description: document.description,
                content: document.content,
                createdAt: document.createdAt,
                projectId: document.projectId,
                comments: document.comments
            }
        });
    } catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const updateDocument = async (req, res) => {
    try {
        const { token, documentId, title, description, content } = req.body;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Token required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userEmail = decoded.userIdentifier;

        const user = await userModel.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const document = await documentModel.findById(documentId);
        if (!document) {
            return res.status(404).json({ success: false, message: 'Document not found' });
        }

        // Check if user has access to the document
        if (document.projectId) {
            const project = await projectModel.findById(document.projectId);
            const hasAccess = project.userId.equals(user._id) || 
                            project.collaborators.some(c => c.user === userEmail);
            if (!hasAccess) {
                return res.status(403).json({ success: false, message: 'Access denied to this document' });
            }
        } else if (!document.userId.equals(user._id)) {
            return res.status(403).json({ success: false, message: 'Access denied to this document' });
        }

        // Update document
        if (title) document.title = title;
        if (description) document.description = description;
        if (content !== undefined) document.content = content;
        document.version += 1;

        await document.save();

        res.status(200).json({
            success: true,
            message: 'Document updated successfully',
            document: {
                _id: document._id,
                title: document.title,
                description: document.description,
                content: document.content,
                version: document.version,
                updatedAt: document.updatedAt
            }
        });
    } catch (error) {
        console.error('Error updating document:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const getUserDocuments = async (req, res) => {
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

        // Get all projects where user is creator or collaborator
        const projects = await projectModel.find({
            $or: [
                { userId: user._id },
                { 'collaborators.user': userEmail }
            ]
        });

        const projectIds = projects.map(proj => proj._id);

        // Get all documents where user is creator or document belongs to accessible projects
        const documents = await documentModel.find({
            $or: [
                { userId: user._id },
                { projectId: { $in: projectIds } }
            ]
        });

        const formattedDocuments = documents.map(doc => ({
            _id: doc._id,
            title: doc.title,
            description: doc.description,
            createdAt: doc.createdAt,
            projectId: doc.projectId,
            version: doc.version
        }));

        res.status(200).json({
            success: true,
            documents: formattedDocuments
        });
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export {
    createDocument,
    getDocument,
    updateDocument,
    getUserDocuments
};
