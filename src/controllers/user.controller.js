import User from "../models/user.model.js";
import bcrypt from "bcrypt";

// --- EXISTING FUNCTION (SCRUM-23) ---
export async function updateUser(req, res, next) {
  try {
    const userId = req.params.id;
    const updates = req.body;

    // 1. Jira: "Hash du mot de passe avant stockage"
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    // 2. Database Action: Update the user
    // { new: true } returns the updated document
    // { runValidators: true } ensures email format is checked
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password"); // Security: Remove password from response

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    // Jira: "Rejet des données ... e-mails déjà utilisés"
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already in use" });
    }
    next(error);
  }
}

// --- NEW FUNCTION (SCRUM-24) ---
export async function getMembership(req, res, next) {
  try {
    const { id } = req.params;

    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return only the membership details
    res.status(200).json({
      membership_type: user.membership_type,
      expiration_date: user.expiration_date,
      status: user.status,
    });
  } catch (error) {
    next(error);
  }
}