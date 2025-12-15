import User from "../models/user.model.js";
import bcrypt from "bcrypt";

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