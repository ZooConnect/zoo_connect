import User from "../models/user.model.js";

const createUser = async ({ name, email, passwordHash }) => {
    return User.create({ name, email, passwordHash });
}

const fastReadUserByEmail = async (email) => {
    return User.exists({ email });
}

const readUserByEmail = async (email) => {
    return User.findOne({ email });
}

const updateUserProfile = async (id, updates) => {
    await User.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
        timestamps: true
    }).select("-passwordHash"); // Security: Remove password from response
}


export default {
    createUser,
    fastReadUserByEmail,
    readUserByEmail,
    updateUserProfile
}