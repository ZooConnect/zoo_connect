import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: [function () { return this.isNew; }, 'Password is required on creation'] },
        role: { 
        type: String, 
            enum: ['admin', 'staff', 'visitor'], 
            default: 'visitor' 
        },
        membershipType: {
            type: String,
            enum: ['Basic', 'Premium'],
            default: 'Basic'
        },
        membershipExpirationDate: {
            type: Date,
            default: null
        },
        membershipStatus: {
            type: String,
            enum: ['active', 'expired', 'cancelled'],
            default: 'active'
        },
    },
    {
        timestamps: true

    }
);

userSchema.plugin(uniqueValidator);
export default mongoose.model("User", userSchema);