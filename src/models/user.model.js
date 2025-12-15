import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true }, 
        password_hash: { type: String, required: true }, 

        membership_type: { 
            type: String, 
            enum: ['Basic', 'Premium'], 
            default: 'Basic' 
        },
        expiration_date: { 
            type: Date, 
            default: null 
        },
        status: { 
            type: String, 
            enum: ['active', 'expired', 'cancelled'], 
            default: 'active' 
        },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } } 
);

export default mongoose.model("User", userSchema);
