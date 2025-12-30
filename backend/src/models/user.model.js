import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: [function () { return this.isNew; }, 'Password is required on creation'] },
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
        timestamps: true //created_at and updated_at

    }
);

userSchema.plugin(uniqueValidator);
export default mongoose.model("User", userSchema);