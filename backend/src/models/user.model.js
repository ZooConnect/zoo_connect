import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: [function () { return this.isNew; }, 'Password is required on creation'] },
        role: { 
<<<<<<< HEAD
        type: String, 
            enum: ['admin', 'staff', 'visitor'], 
=======
            type: String, 
            enum: ['visitor', 'staff', 'admin'], 
>>>>>>> d4059f5331c357aae44f5f72a7d7fa299d13b663
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