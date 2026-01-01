import User from "../models/user.model.js";

const createUser = async ({ name, email, passwordHash }) => User.create({ name, email, passwordHash });

const fastReadUserByEmail = async (email) => User.exists({ email });

const readUserByEmail = async (email) => User.findOne({ email });

const updateUserProfile = async (id, updates) => {
    return User.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
        timestamps: true
    }).select("-passwordHash"); // Security: Remove password from response
}

export const deleteUser = async (userId) => User.findByIdAndDelete(userId);


export default {
    createUser,
    fastReadUserByEmail,
    readUserByEmail,
    updateUserProfile,
    deleteUser
}