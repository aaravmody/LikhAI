import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    userId: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    collaborators: [  
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            role: {
                type: String,
                enum: ["editor", "viewer"],  
                required: true
            }
        }
    ],
    docType: { 
        type: String, 
        required: true, 
        enum: ["script", "article", "marketing-material"]
    },
    status: { 
        type: String, 
        required: true, 
        enum: ["inprogess", "todo", "undereview"]
    },
}, { timestamps: true });

export const projectModel = mongoose.model('project', projectSchema);
