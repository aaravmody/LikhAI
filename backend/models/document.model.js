import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    userId: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    projectId: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',  
        required: true,
    },
    title: { 
        type: String, 
        required: true
    },
    description: { 
        type: String 
    },
    comments: [  
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',  
                required: true
            },
            text: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    version: {
        type: Number,
        default: 1
    }
}, { timestamps: true });

export const documentModel = mongoose.model('document', documentSchema);
