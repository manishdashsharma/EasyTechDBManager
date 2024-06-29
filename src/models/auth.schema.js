import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true, 
    },
    is_active: {
        type: Boolean,
        default: true
    },
    is_paid: {
        type: Boolean,
        default: false
    },
    apiKey: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        default: () => Math.random().toString(36).substr(2, 38)
    },
    dbCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model("User", userSchema)