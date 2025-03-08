import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    age: { type: Number, required: true },
    termscondition: { type: Boolean, required: true },
},{ timestamps: true });

export const userModel = mongoose.model('user', userSchema);
