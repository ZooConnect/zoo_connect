<<<<<<< HEAD
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
=======
import User from "../models/user.model.js";

// Récupérer tous les utilisateurs
export const getAllUsers = async (req, res) => {
    try {
        // On récupère l'ID, le nom et le rôle pour la sécurité
        const users = await User.find({}, 'name email role membershipType');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error: error.message });
    }
};

// Récupérer un utilisateur par son ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id, '-passwordHash');
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
>>>>>>> d4059f5331c357aae44f5f72a7d7fa299d13b663
    }
};