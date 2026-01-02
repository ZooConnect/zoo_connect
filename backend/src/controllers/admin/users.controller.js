import User from "../../models/user.model.js";

export const getAllUsers = async (req, res) => {
    try {
        // On récupère les utilisateurs ayant un rôle staff ou admin
        const staffMembers = await User.find({ 
            role: { $in: ['staff', 'admin'] } 
        }).select('name _id role');
        
        res.status(200).json(staffMembers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching staff", error: error.message });
    }
};